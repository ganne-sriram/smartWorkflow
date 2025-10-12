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
      this.currentStage = { ...this.draft.stages[this.draft.currentStageIndex] };
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

  saveProgress() {
    if (!this.draft || !this.currentStage) return;
    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
  }

  proceedToNextStage() {
    if (!this.draft || !this.currentStage) return;
    
    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    
    if (this.draft.currentStageIndex < this.draft.stages.length - 1) {
      this.draft.currentStageIndex++;
      this.draftService.saveDraft(this.draft);
      this.loadCurrentStage();
    } else {
      this.router.navigate(['/workflow-completion']);
    }
  }

  goToStage(index: number) {
    if (!this.draft || !this.currentStage) return;
    
    this.draftService.updateStage(this.draft, this.draft.currentStageIndex, this.currentStage);
    this.draft.currentStageIndex = index;
    this.draftService.saveDraft(this.draft);
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

  toggleLeftRail() {
    this.leftRailCollapsed = !this.leftRailCollapsed;
  }
}
