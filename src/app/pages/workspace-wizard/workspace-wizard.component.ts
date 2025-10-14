import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { DraftWorkflow, Stage, AVAILABLE_OPTIONS, AVAILABLE_CHECKLISTS } from '../../models/draft-workflow.model';

@Component({
  selector: 'app-workspace-wizard',
  imports: [CommonModule, FormsModule],
  templateUrl: './workspace-wizard.component.html',
  styleUrl: './workspace-wizard.component.css'
})
export class WorkspaceWizardComponent implements OnInit {
  draft: DraftWorkflow | null = null;
  currentStage: Stage | null = null;
  availableOptions = AVAILABLE_OPTIONS;
  availableChecklists = AVAILABLE_CHECKLISTS;
  leftRailCollapsed = false;

  // Validation flags
  optionsError: string = '';
  checklistsError: string = '';
  showValidation: boolean = false;

  constructor(
    private draftService: DraftWorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.draft = this.draftService.getDraft();
    if (!this.draft) {
      this.router.navigate(['/process-flow-info']);
      return;
    }
    this.loadCurrentStage();
  }

  loadCurrentStage() {
    if (this.draft) {
      const stage = this.draft.stages[this.draft.currentStageIndex];
      this.currentStage = {
        name: stage.name,
        selectedOptions: [...stage.selectedOptions],
        selectedChecklists: [...stage.selectedChecklists]
      };
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

    // Validate after toggle
    if (this.showValidation) {
      this.validateSelections();
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

    // Validate after toggle
    if (this.showValidation) {
      this.validateSelections();
    }
  }

  validateSelections(): boolean {
    this.optionsError = '';
    this.checklistsError = '';
    let isValid = true;

    if (!this.currentStage) return false;

    // Validate options
    if (this.currentStage.selectedOptions.length === 0) {
      this.optionsError = 'Please select at least one option';
      isValid = false;
    }

    // Validate checklists
    if (this.currentStage.selectedChecklists.length === 0) {
      this.checklistsError = 'Please select at least one checklist';
      isValid = false;
    }

    return isValid;
  }

  validateAllStages(): { isValid: boolean; invalidStageIndex: number; invalidStageName: string } {
    if (!this.draft) {
      return { isValid: false, invalidStageIndex: -1, invalidStageName: '' };
    }

    // Save current stage changes first
    if (this.currentStage) {
      this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    }

    // Check all stages
    for (let i = 0; i < this.draft.stages.length; i++) {
      const stage = this.draft.stages[i];
      if (stage.selectedOptions.length === 0 || stage.selectedChecklists.length === 0) {
        return {
          isValid: false,
          invalidStageIndex: i,
          invalidStageName: stage.name
        };
      }
    }

    return { isValid: true, invalidStageIndex: -1, invalidStageName: '' };
  }

  saveProgress() {
    if (!this.draft || !this.currentStage) return;
    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
  }

  proceedToNextStage() {
    if (!this.draft || !this.currentStage) return;

    // Enable validation display
    this.showValidation = true;

    // If this is the last stage, validate ALL stages before completion
    if (this.draft.currentStageIndex === this.draft.stages.length - 1) {
      const validation = this.validateAllStages();

      if (!validation.isValid) {
        // Navigate to the invalid stage and show error
        this.draft.currentStageIndex = validation.invalidStageIndex;
        this.draftService.saveDraft(this.draft);
        this.loadCurrentStage();

        // Show validation errors for the invalid stage
        this.validateSelections();

        alert(`Please complete all selections in "${validation.invalidStageName}" before proceeding.`);
        return;
      }

      // All stages are valid, proceed to completion
      this.router.navigate(['/workflow-completion']);
      return;
    }

    // For non-final stages, just validate current stage
    if (!this.validateSelections()) {
      return; // Don't proceed if validation fails
    }

    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    this.draft.currentStageIndex++;
    this.draftService.saveDraft(this.draft);
    this.showValidation = false; // Reset validation for next stage
    this.loadCurrentStage();
  }

  goToStage(index: number) {
    if (!this.draft || !this.currentStage) return;

    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    this.draft.currentStageIndex = index;
    this.draftService.saveDraft(this.draft);
    this.showValidation = false; // Reset validation when navigating
    this.loadCurrentStage();
  }

  getStageOptionCount(stageIndex: number): number {
    return this.draft?.stages[stageIndex].selectedOptions.length || 0;
  }

  getStageChecklistCount(stageIndex: number): number {
    return this.draft?.stages[stageIndex].selectedChecklists.length || 0;
  }

  isLastStage(): boolean {
    return this.draft ? this.draft.currentStageIndex === this.draft.stages.length - 1 : false;
  }

  isFirstStage(): boolean {
    return this.draft ? this.draft.currentStageIndex === 0 : true;
  }

  goBack() {
    if (!this.draft || !this.currentStage) return;

    // If on first stage, go back to process-flow-info
    if (this.draft.currentStageIndex === 0) {
      this.router.navigate(['/process-flow-info']);
      return;
    }

    // Otherwise, go to previous stage
    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    this.draft.currentStageIndex--;
    this.draftService.saveDraft(this.draft);
    this.showValidation = false; // Reset validation when going back
    this.loadCurrentStage();
  }

  toggleLeftRail() {
    this.leftRailCollapsed = !this.leftRailCollapsed;
  }
}
