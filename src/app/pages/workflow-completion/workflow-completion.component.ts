import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { DraftWorkflow } from '../../models/draft-workflow.model';

@Component({
  selector: 'app-workflow-completion',
  imports: [CommonModule],
  templateUrl: './workflow-completion.component.html',
  styleUrl: './workflow-completion.component.css'
})
export class WorkflowCompletionComponent implements OnInit {
  workflow: DraftWorkflow | null = null;

  constructor(
    private draftService: DraftWorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workflow = this.draftService.getDraft();
    if (!this.workflow) {
      this.router.navigate(['/process-flow-info']);
    }
  }

  exploreWorkflow() {
    this.draftService.clearDraft();
    this.router.navigate(['/available-workflows']);
  }

  designAnother() {
    this.draftService.clearDraft();
    this.router.navigate(['/design-process-flow']);
  }

  goToDashboard() {
    this.draftService.clearDraft();
    this.router.navigate(['/available-workflows']);
  }
}
