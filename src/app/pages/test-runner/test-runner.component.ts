import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { TestRunService } from '../../services/test-run.service';
import { Template, TestRun, TestRunStage, TemplateField, createTestRunFromTemplate } from '../../models/template.model';
import { CaseQualityScoreComponent } from '../../components/case-quality-score/case-quality-score.component';

interface FieldGroup {
  sourceType: 'option' | 'checklist';
  sourceName: string;
  fields: TemplateField[];
}

@Component({
  selector: 'app-test-runner',
  imports: [CommonModule, FormsModule, CaseQualityScoreComponent],
  templateUrl: './test-runner.component.html',
  styleUrl: './test-runner.component.css'
})
export class TestRunnerComponent implements OnInit {
  testRun: TestRun | null = null;
  currentStage: TestRunStage | null = null;
  templateFields: TemplateField[] = [];
  fieldValues: { [fieldId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private testRunService: TestRunService
  ) {}

  ngOnInit() {
    const templateId = this.route.snapshot.paramMap.get('templateId');
    if (!templateId) {
      this.router.navigate(['/available-workflows']);
      return;
    }

    this.loadTemplateFields();

    this.templateService.getTemplateById(templateId).subscribe({
      next: (template) => {
        this.testRun = createTestRunFromTemplate(template);
        this.testRunService.saveTestRun(this.testRun).subscribe({
          next: (savedTestRun) => {
            this.testRun = savedTestRun;
            this.loadFieldValues();
            this.loadCurrentStage();
          },
          error: (error) => {
            console.error('Error saving test run:', error);
            this.router.navigate(['/available-workflows']);
          }
        });
      },
      error: (error) => {
        console.error('Error loading template:', error);
        this.router.navigate(['/available-workflows']);
      }
    });
  }

  loadTemplateFields() {
    const savedFields = localStorage.getItem('template_fields');
    if (savedFields) {
      try {
        this.templateFields = JSON.parse(savedFields);
      } catch (e) {
        console.error('Error loading template fields:', e);
        this.templateFields = [];
      }
    }
  }

  loadFieldValues() {
    if (!this.testRun) return;
    
    const savedValues = localStorage.getItem(`test_run_fields_${this.testRun.id}`);
    if (savedValues) {
      try {
        this.fieldValues = JSON.parse(savedValues);
      } catch (e) {
        console.error('Error loading field values:', e);
        this.fieldValues = {};
      }
    } else {
      this.templateFields.forEach(field => {
        if (field.value) {
          this.fieldValues[field.id] = field.value;
        }
      });
    }
  }

  saveFieldValues() {
    if (!this.testRun) return;
    localStorage.setItem(`test_run_fields_${this.testRun.id}`, JSON.stringify(this.fieldValues));
  }

  getFieldGroupsForCurrentStage(): FieldGroup[] {
    if (!this.currentStage) return [];

    const groups: FieldGroup[] = [];

    this.currentStage.selectedOptions.forEach(option => {
      const fields = this.templateFields.filter(f => 
        f.stageName === this.currentStage!.name && 
        f.sourceType === 'option' && 
        f.sourceName === option
      );
      if (fields.length > 0) {
        groups.push({
          sourceType: 'option',
          sourceName: option,
          fields: fields
        });
      }
    });

    this.currentStage.selectedChecklists.forEach(checklist => {
      const fields = this.templateFields.filter(f => 
        f.stageName === this.currentStage!.name && 
        f.sourceType === 'checklist' && 
        f.sourceName === checklist
      );
      if (fields.length > 0) {
        groups.push({
          sourceType: 'checklist',
          sourceName: checklist,
          fields: fields
        });
      }
    });

    return groups;
  }

  loadCurrentStage() {
    if (this.testRun) {
      const stage = this.testRun.stages[this.testRun.currentStageIndex];
      console.log('Loading stage:', this.testRun.currentStageIndex, stage);

      // Deep copy the stage to avoid reference issues
      this.currentStage = {
        name: stage.name,
        availableOptions: [...stage.availableOptions],
        availableChecklists: [...stage.availableChecklists],
        selectedOptions: [...stage.selectedOptions],
        selectedChecklists: [...stage.selectedChecklists]
      };

      console.log('Current stage loaded:', this.currentStage);
    }
  }

  isOptionSelected(option: string): boolean {
    return this.currentStage?.selectedOptions.includes(option) || false;
  }

  isChecklistSelected(checklist: string): boolean {
    return this.currentStage?.selectedChecklists.includes(checklist) || false;
  }

  toggleOption(option: string) {
    if (!this.currentStage) return;
    
    const index = this.currentStage.selectedOptions.indexOf(option);
    if (index > -1) {
      this.currentStage.selectedOptions.splice(index, 1);
    } else {
      this.currentStage.selectedOptions.push(option);
    }
  }

  toggleChecklist(checklist: string) {
    if (!this.currentStage) return;
    
    const index = this.currentStage.selectedChecklists.indexOf(checklist);
    if (index > -1) {
      this.currentStage.selectedChecklists.splice(index, 1);
    } else {
      this.currentStage.selectedChecklists.push(checklist);
    }
  }

  canProceed(): boolean {
    if (!this.currentStage) return false;
    return this.currentStage.selectedOptions.length >= 1 && 
           this.currentStage.selectedChecklists.length >= 1;
  }

  goBack() {
    if (!this.testRun || !this.currentStage) return;

    this.saveFieldValues();
    this.testRunService.updateStage(this.testRun, this.testRun.currentStageIndex, this.currentStage);

    if (this.testRun.currentStageIndex > 0) {
      this.testRun.currentStageIndex--;
      this.testRunService.saveTestRun(this.testRun).subscribe({
        next: (updated) => {
          this.testRun = updated;
          this.loadCurrentStage();
        },
        error: (error) => {
          console.error('Error updating test run:', error);
        }
      });
    } else {
      this.router.navigate(['/available-workflows']);
    }
  }

  goNext() {
    if (!this.testRun || !this.currentStage || !this.canProceed()) return;
    
    this.saveFieldValues();
    this.testRunService.updateStage(this.testRun, this.testRun.currentStageIndex, this.currentStage);
    
    if (this.testRun.currentStageIndex < this.testRun.stages.length - 1) {
      this.testRun.currentStageIndex++;
      this.testRunService.saveTestRun(this.testRun).subscribe({
        next: (updated) => {
          this.testRun = updated;
          this.loadCurrentStage();
        },
        error: (error) => {
          console.error('Error updating test run:', error);
        }
      });
    }
  }

  submitTest() {
    if (!this.testRun || !this.currentStage || !this.canProceed()) return;
    
    this.saveFieldValues();
    this.testRunService.updateStage(this.testRun, this.testRun.currentStageIndex, this.currentStage);
    this.testRunService.saveTestRun(this.testRun).subscribe({
      next: (updated) => {
        this.router.navigate(['/test-summary', updated.id]);
      },
      error: (error) => {
        console.error('Error submitting test run:', error);
      }
    });
  }

  goToStage(index: number) {
    if (!this.testRun || !this.currentStage) return;
    
    this.testRunService.updateStage(this.testRun, this.testRun.currentStageIndex, this.currentStage);
    this.testRun.currentStageIndex = index;
    this.testRunService.saveTestRun(this.testRun).subscribe({
      next: (updated) => {
        this.testRun = updated;
        this.loadCurrentStage();
      },
      error: (error) => {
        console.error('Error updating test run:', error);
      }
    });
  }

  getStageOptionCount(stageIndex: number): number {
    return this.testRun?.stages[stageIndex].selectedOptions.length || 0;
  }

  getStageChecklistCount(stageIndex: number): number {
    return this.testRun?.stages[stageIndex].selectedChecklists.length || 0;
  }

  isLastStage(): boolean {
    return this.testRun ? this.testRun.currentStageIndex === this.testRun.stages.length - 1 : false;
  }

  isFirstStage(): boolean {
    return this.testRun ? this.testRun.currentStageIndex === 0 : true;
  }

  getCompletedChecklistCount(): number {
    return this.currentStage?.selectedChecklists.length || 0;
  }

  getTotalChecklistCount(): number {
    return this.currentStage?.availableChecklists.length || 0;
  }
}
