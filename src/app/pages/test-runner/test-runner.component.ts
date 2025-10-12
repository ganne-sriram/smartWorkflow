import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { TestRunService } from '../../services/test-run.service';
import { Template, TestRun, TestRunStage, createTestRunFromTemplate } from '../../models/template.model';
import { CaseQualityScoreComponent } from '../../components/case-quality-score/case-quality-score.component';

@Component({
  selector: 'app-test-runner',
  imports: [CommonModule, FormsModule, CaseQualityScoreComponent],
  templateUrl: './test-runner.component.html',
  styleUrl: './test-runner.component.css'
})
export class TestRunnerComponent implements OnInit {
  testRun: TestRun | null = null;
  currentStage: TestRunStage | null = null;

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

    this.templateService.getTemplateById(templateId).subscribe({
      next: (template) => {
        this.testRun = createTestRunFromTemplate(template);
        this.testRunService.saveTestRun(this.testRun).subscribe({
          next: (savedTestRun) => {
            this.testRun = savedTestRun;
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

  loadCurrentStage() {
    if (this.testRun) {
      this.currentStage = { ...this.testRun.stages[this.testRun.currentStageIndex] };
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
    }
  }

  goNext() {
    if (!this.testRun || !this.currentStage || !this.canProceed()) return;
    
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
