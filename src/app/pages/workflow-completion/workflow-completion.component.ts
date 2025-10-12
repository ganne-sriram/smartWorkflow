import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { TemplateService } from '../../services/template.service';
import { DraftWorkflow } from '../../models/draft-workflow.model';
import { convertDraftToTemplate } from '../../models/template.model';

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
    private templateService: TemplateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workflow = this.draftService.getDraft();
    if (!this.workflow) {
      this.router.navigate(['/process-flow-info']);
    }
  }

  saveAsTemplate() {
    if (!this.workflow) return;
    const template = convertDraftToTemplate(this.workflow);
    this.templateService.saveTemplate(template);
    this.draftService.clearDraft();
    this.router.navigate(['/available-workflows']);
  }

  exploreWorkflow() {
    if (!this.workflow) return;
    const template = convertDraftToTemplate(this.workflow);
    this.templateService.saveTemplate(template);
    this.draftService.clearDraft();
    this.router.navigate(['/test-runner', template.id]);
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
