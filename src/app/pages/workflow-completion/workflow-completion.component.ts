import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { TemplateService } from '../../services/template.service';
import { NotificationService } from '../../services/notification.service';
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
    private notificationService: NotificationService,
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
    this.templateService.saveTemplate(template).subscribe({
      next: (savedTemplate) => {
        this.notificationService.showSuccess(`Template "${savedTemplate.name}" created successfully!`);
        this.draftService.clearDraft();
        this.router.navigate(['/available-workflows']);
      },
      error: (error) => {
        console.error('Error saving template:', error);
        this.notificationService.showError('Failed to create template. Please try again.');
      }
    });
  }

  exploreWorkflow() {
    if (!this.workflow) return;
    const template = convertDraftToTemplate(this.workflow);
    this.templateService.saveTemplate(template).subscribe({
      next: (savedTemplate) => {
        if (!savedTemplate.id) {
          console.error('Error: Template ID is missing');
          this.notificationService.showError('Failed to create template. Template ID is missing.');
          return;
        }
        this.notificationService.showSuccess(`Template "${savedTemplate.name}" created successfully!`);
        this.templateService.publishTemplate(savedTemplate.id).subscribe({
          next: (publishedTemplate) => {
            this.draftService.clearDraft();
            this.router.navigate(['/test-runner', publishedTemplate.id]);
          },
          error: (error) => {
            console.error('Error publishing template:', error);
            this.notificationService.showError('Failed to publish template. Please try again.');
          }
        });
      },
      error: (error) => {
        console.error('Error saving template:', error);
        this.notificationService.showError('Failed to create template. Please try again.');
      }
    });
  }

  designAnother() {
    this.draftService.clearDraft();
    this.router.navigate(['/design-process-flow']);
  }

  goToDashboard() {
    this.draftService.clearDraft();
    this.router.navigate(['/available-workflows']);
  }

  goBack() {
    this.router.navigate(['/workspace-wizard']);
  }
}
