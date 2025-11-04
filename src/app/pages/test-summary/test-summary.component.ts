import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TestRunService } from '../../services/test-run.service';
import { TestRun, TemplateField } from '../../models/template.model';

interface FieldGroup {
  stageName: string;
  sourceType: string;
  sourceName: string;
  fields: TemplateField[];
}

@Component({
  selector: 'app-test-summary',
  imports: [CommonModule],
  templateUrl: './test-summary.component.html',
  styleUrl: './test-summary.component.css'
})
export class TestSummaryComponent implements OnInit {
  testRun: TestRun | null = null;
  summaryText: string = '';
  resultPayload: string = '';
  templateFields: TemplateField[] = [];
  displayedFields: FieldGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private testRunService: TestRunService,
    private router: Router
  ) {}

  ngOnInit() {
    const testRunId = this.route.snapshot.paramMap.get('testRunId');
    if (!testRunId) {
      this.router.navigate(['/available-workflows']);
      return;
    }

    this.loadTemplateFields();

    this.testRunService.getTestRun(testRunId).subscribe({
      next: (testRun) => {
        this.testRun = testRun;
        this.generateSummary();
        this.generateResultPayload();
        this.filterDisplayedFields();
      },
      error: (error) => {
        console.error('Error loading test run:', error);
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

  filterDisplayedFields() {
    if (!this.testRun) return;

    this.displayedFields = [];

    this.testRun.stages.forEach(stage => {
      stage.selectedOptions.forEach(option => {
        const fields = this.templateFields.filter(f => 
          f.stageName === stage.name && 
          f.sourceType === 'option' && 
          f.sourceName === option
        );
        if (fields.length > 0) {
          this.displayedFields.push({
            stageName: stage.name,
            sourceType: 'Option',
            sourceName: option,
            fields: fields
          });
        }
      });

      stage.selectedChecklists.forEach(checklist => {
        const fields = this.templateFields.filter(f => 
          f.stageName === stage.name && 
          f.sourceType === 'checklist' && 
          f.sourceName === checklist
        );
        if (fields.length > 0) {
          this.displayedFields.push({
            stageName: stage.name,
            sourceType: 'Checklist',
            sourceName: checklist,
            fields: fields
          });
        }
      });
    });
  }

  generateSummary() {
    if (!this.testRun) return;
    
    const totalOptions = this.testRun.stages.reduce((sum, stage) => sum + stage.selectedOptions.length, 0);
    const totalChecklists = this.testRun.stages.reduce((sum, stage) => sum + stage.selectedChecklists.length, 0);
    
    this.summaryText = `Successfully completed test run for "${this.testRun.templateName}" workflow. ` +
      `Processed ${this.testRun.stages.length} stages with ${totalOptions} options selected and ` +
      `${totalChecklists} checklist items verified. All validation requirements were met.`;
  }

  generateResultPayload() {
    if (!this.testRun) return;
    
    const payload = {
      testRunId: this.testRun.id,
      templateId: this.testRun.templateId,
      templateName: this.testRun.templateName,
      startedAt: this.testRun.startedAt,
      completedAt: new Date(),
      stages: this.testRun.stages.map(stage => ({
        name: stage.name,
        selectedOptions: stage.selectedOptions,
        selectedChecklists: stage.selectedChecklists,
        optionsCount: stage.selectedOptions.length,
        checklistsCount: stage.selectedChecklists.length
      })),
      totalStages: this.testRun.stages.length,
      totalOptionsSelected: this.testRun.stages.reduce((sum, stage) => sum + stage.selectedOptions.length, 0),
      totalChecklistsCompleted: this.testRun.stages.reduce((sum, stage) => sum + stage.selectedChecklists.length, 0)
    };

    this.resultPayload = JSON.stringify(payload, null, 2);
  }

  goToDashboard() {
    this.router.navigate(['/available-workflows']);
  }

  runAnotherTest() {
    this.router.navigate(['/available-workflows']);
  }
}
