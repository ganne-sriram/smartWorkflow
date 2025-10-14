import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';

@Component({
  selector: 'app-process-flow-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './process-flow-info.component.html',
  styleUrl: './process-flow-info.component.css'
})
export class ProcessFlowInfoComponent {
  processFlowName: string = '';
  processFlowObjective: string = '';
  numberOfStages: string = '';

  // Validation flags
  nameError: string = '';
  objectiveError: string = '';
  stagesError: string = '';
  formSubmitted: boolean = false;

  constructor(
    private router: Router,
    private draftService: DraftWorkflowService
  ) {}

  // Real-time validation for name
  validateName() {
    if (this.formSubmitted || this.processFlowName.length > 0) {
      if (!this.processFlowName.trim()) {
        this.nameError = 'Process flow name is required';
      } else {
        this.nameError = '';
      }
    }
  }

  // Real-time validation for objective
  validateObjective() {
    if (this.formSubmitted || this.processFlowObjective.length > 0) {
      if (!this.processFlowObjective.trim()) {
        this.objectiveError = 'Process flow objective is required';
      } else {
        this.objectiveError = '';
      }
    }
  }

  // Real-time validation for stages (only numbers allowed)
  validateStages() {
    if (this.formSubmitted || this.numberOfStages.length > 0) {
      if (!this.numberOfStages.trim()) {
        this.stagesError = 'Number of stages is required';
      } else if (!/^\d+$/.test(this.numberOfStages)) {
        this.stagesError = 'Only numbers are allowed';
      } else if (parseInt(this.numberOfStages, 10) <= 0) {
        this.stagesError = 'Number of stages must be greater than 0';
      } else {
        this.stagesError = '';
      }
    }
  }

  onNext() {
    this.formSubmitted = true;

    // Validate all fields
    this.validateName();
    this.validateObjective();
    this.validateStages();

    // Check if there are any errors
    if (!this.nameError && !this.objectiveError && !this.stagesError) {
      const stageCount = parseInt(this.numberOfStages, 10);
      this.draftService.createDraft(this.processFlowName, this.processFlowObjective, stageCount);
      this.router.navigate(['/workspace-wizard']);
    }
  }

  goBack() {
    this.router.navigate(['/design-process-flow']);
  }
  
}
