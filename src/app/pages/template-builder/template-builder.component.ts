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
  stageNavigationError: string = '';

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
    if (index > this.selectedStageIndex && !this.isStageComplete(this.selectedStageIndex)) {
      this.stageNavigationError = 'Please add at least one field for all options and checklists in the current stage before proceeding.';
      setTimeout(() => this.stageNavigationError = '', 3000);
      return;
    }
    this.stageNavigationError = '';
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
    localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    this.cancelFieldCreation();
  }

  deleteField(fieldId: string) {
    const index = this.templateFields.findIndex(f => f.id === fieldId);
    if (index > -1) {
      this.templateFields.splice(index, 1);
      localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    }
  }

  saveDraft() {
    localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    this.router.navigate(['/workflow-completion']);
  }

  proceedToCompletion() {
    localStorage.setItem('template_fields', JSON.stringify(this.templateFields));
    this.router.navigate(['/workflow-completion']);
  }

  hasFieldsFor(stageName: string, sourceType: 'option' | 'checklist', sourceName: string): boolean {
    return this.templateFields.some(field => 
      field.stageName === stageName && 
      field.sourceType === sourceType && 
      field.sourceName === sourceName
    );
  }

  isStageComplete(stageIndex: number): boolean {
    if (!this.workflow || stageIndex >= this.workflow.stages.length) {
      return false;
    }

    const stage = this.workflow.stages[stageIndex];
    
    for (const option of stage.selectedOptions) {
      if (!this.hasFieldsFor(stage.name, 'option', option)) {
        return false;
      }
    }

    for (const checklist of stage.selectedChecklists) {
      if (!this.hasFieldsFor(stage.name, 'checklist', checklist)) {
        return false;
      }
    }

    return stage.selectedOptions.length > 0 || stage.selectedChecklists.length > 0;
  }

  isAllStagesComplete(): boolean {
    if (!this.workflow) {
      return false;
    }

    for (let i = 0; i < this.workflow.stages.length; i++) {
      if (!this.isStageComplete(i)) {
        return false;
      }
    }

    return true;
  }

  getNextSource(): { type: 'option' | 'checklist', name: string } | null {
    if (!this.currentStage) {
      return null;
    }

    const allSources: { type: 'option' | 'checklist', name: string }[] = [
      ...this.currentStage.selectedOptions.map((opt: string) => ({ type: 'option' as const, name: opt })),
      ...this.currentStage.selectedChecklists.map((chk: string) => ({ type: 'checklist' as const, name: chk }))
    ];

    const currentIndex = allSources.findIndex(
      src => src.type === this.selectedSourceType && src.name === this.selectedSourceName
    );

    if (currentIndex >= 0 && currentIndex < allSources.length - 1) {
      return allSources[currentIndex + 1];
    }

    return null;
  }

  goToNextSource() {
    const nextSource = this.getNextSource();
    if (nextSource) {
      this.selectSource(nextSource.type, nextSource.name);
    }
  }

  canShowNextButton(): boolean {
    return this.getFieldsForCurrentSelection().length > 0 && this.getNextSource() !== null;
  }

  canSave(): boolean {
    return this.isAllStagesComplete();
  }

  goBack() {
    this.router.navigate(['/workspace-wizard']);
  }
}
