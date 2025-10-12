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

  constructor(
    private router: Router,
    private draftService: DraftWorkflowService
  ) {}

  onNext() {
    const stageCount = parseInt(this.numberOfStages, 10);
    if (this.processFlowName && this.processFlowObjective && stageCount > 0) {
      this.draftService.createDraft(this.processFlowName, this.processFlowObjective, stageCount);
      this.router.navigate(['/workspace-wizard']);
    }
  }
}
