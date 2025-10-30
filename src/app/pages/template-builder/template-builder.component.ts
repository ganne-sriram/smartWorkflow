import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { DraftWorkflow } from '../../models/draft-workflow.model';

export interface TemplateField {
  id: string;
  type: 'text' | 'date' | 'number' | 'address';
  name: string;
  value: string;
  stageName: string;
  sourceType: 'option' | 'checklist';
  sourceName: string;
}

@Component({
  selector: 'app-template-builder',
  imports: [CommonModule, FormsModule],
  templateUrl: './template-builder.component.html',
  styleUrl: './template-builder.component.css'
})
export class TemplateBuilderComponent implements OnInit {
  workflow: DraftWorkflow | null = null;
  templateFields: TemplateField[] = [];
  selectedStageIndex: number = 0;
  selectedSourceType: 'option' | 'checklist' = 'option';
  selectedSourceName: string = '';
  showFieldNamePrompt: boolean = false;
  pendingFieldType: 'text' | 'date' | 'number' | 'address' | null = null;
  newFieldName: string = '';
  
  currentStage: any = null;

  constructor(
    private draftService: DraftWorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workflow = this.draftService.getDraft();
    if (!this.workflow) {
      this.router.navigate(['/process-flow-info']);
      return;
    }

    this.loadCurrentStage();
    this.loadTemplateFields();
  }

  loadCurrentStage() {
    if (this.workflow && this.workflow.stages.length > 0) {
      this.currentStage = this.workflow.stages[this.selectedStageIndex];
      const allSources = [...this.currentStage.selectedOptions, ...this.currentStage.selectedChecklists];
      if (allSources.length > 0) {
        if (this.currentStage.selectedOptions.length > 0) {
          this.selectedSourceType = 'option';
          this.selectedSourceName = this.currentStage.selectedOptions[0];
        } else {
          this.selectedSourceType = 'checklist';
          this.selectedSourceName = this.currentStage.selectedChecklists[0];
        }
      }
    }
  }

  loadTemplateFields() {
    const savedFields = localStorage.getItem('template_fields');
    if (savedFields) {
      try {
        this.templateFields = JSON.parse(savedFields);
      } catch (e) {
        console.error('Error loading template fields:', e);
      }
    }
  }

  goToStage(index: number) {
    this.selectedStageIndex = index;
    this.loadCurrentStage();
  }

  getStages(): any[] {
    return this.workflow?.stages || [];
  }

  selectSource(sourceType: 'option' | 'checklist', sourceName: string) {
    this.selectedSourceType = sourceType;
    this.selectedSourceName = sourceName;
  }

  getStageOptions(stageIndex: number): string[] {
    return this.workflow?.stages[stageIndex].selectedOptions || [];
  }

  getStageChecklists(stageIndex: number): string[] {
    return this.workflow?.stages[stageIndex].selectedChecklists || [];
  }

  getCurrentSources(): string[] {
    if (this.selectedSourceType === 'option') {
      return this.getStageOptions(this.selectedStageIndex);
    } else {
      return this.getStageChecklists(this.selectedStageIndex);
    }
  }

  getFieldsForCurrentSelection(): TemplateField[] {
    return this.templateFields.filter(field => 
      field.stageName === this.workflow?.stages[this.selectedStageIndex].name &&
      field.sourceType === this.selectedSourceType &&
      field.sourceName === this.selectedSourceName
    );
  }

  getAllFieldsByStageAndSource(): { stageName: string, sourceType: string, sourceName: string, fields: TemplateField[] }[] {
    if (!this.workflow) return [];

    const grouped: { stageName: string, sourceType: string, sourceName: string, fields: TemplateField[] }[] = [];

    this.workflow.stages.forEach(stage => {
      stage.selectedOptions.forEach(option => {
        const fields = this.templateFields.filter(f => 
          f.stageName === stage.name && 
          f.sourceType === 'option' && 
          f.sourceName === option
        );
        if (fields.length > 0) {
          grouped.push({
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
          grouped.push({
            stageName: stage.name,
            sourceType: 'Checklist',
            sourceName: checklist,
            fields: fields
          });
        }
      });
    });

    return grouped;
  }

  onStageChange() {
    const sources = this.getCurrentSources();
    if (sources.length > 0) {
      this.selectedSourceName = sources[0];
    } else {
      this.selectedSourceName = '';
    }
  }

  onSourceTypeChange() {
    const sources = this.getCurrentSources();
    if (sources.length > 0) {
      this.selectedSourceName = sources[0];
    } else {
      this.selectedSourceName = '';
    }
  }

  promptForFieldName(fieldType: 'text' | 'date' | 'number' | 'address') {
    if (!this.selectedSourceName) {
      alert('Please select a stage and source (option or checklist) first.');
      return;
    }
    this.pendingFieldType = fieldType;
    this.newFieldName = '';
    this.showFieldNamePrompt = true;
  }

  cancelFieldCreation() {
    this.showFieldNamePrompt = false;
    this.pendingFieldType = null;
    this.newFieldName = '';
  }

  createField() {
    if (!this.workflow || !this.pendingFieldType || !this.newFieldName.trim()) {
      return;
    }

    const newField: TemplateField = {
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: this.pendingFieldType,
      name: this.newFieldName.trim(),
      value: '',
      stageName: this.workflow.stages[this.selectedStageIndex].name,
      sourceType: this.selectedSourceType,
      sourceName: this.selectedSourceName
    };

    this.templateFields.push(newField);
    this.cancelFieldCreation();
  }

  deleteField(fieldId: string) {
    const index = this.templateFields.findIndex(f => f.id === fieldId);
    if (index > -1) {
      this.templateFields.splice(index, 1);
    }
  }

  saveDraft() {
    localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    alert('Draft saved successfully!');
  }

  proceedToCompletion() {
    localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    this.router.navigate(['/workflow-completion']);
  }

  canSave(): boolean {
    return this.templateFields.some(field => field.value && field.value.trim() !== '');
  }

  goBack() {
    this.router.navigate(['/workspace-wizard']);
  }
}
