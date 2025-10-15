import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
import { NotificationService } from '../../services/notification.service';
import { Template } from '../../models/template.model';
import { DraftWorkflow } from '../../models/draft-workflow.model';

@Component({
  selector: 'app-template-library',
  imports: [CommonModule],
  templateUrl: './template-library.component.html',
  styleUrl: './template-library.component.css'
})
export class TemplateLibraryComponent implements OnInit {
  templates: Template[] = [];
  activeMenuId: string | null | undefined = null;

  constructor(
    private templateService: TemplateService,
    private draftService: DraftWorkflowService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        // Show both ACTIVE and DRAFT templates
        this.templates = templates.filter(t => t.status === 'ACTIVE' || t.status === 'DRAFT');
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.templates = [];
      }
    });
  }

  selectTemplate(template: Template) {
    const draft: DraftWorkflow = {
      id: Date.now().toString(),
      name: template.name,
      objective: template.objective,
      stages: template.stages.map(stage => ({
        name: stage.name,
        selectedOptions: [...stage.availableOptions],
        selectedChecklists: [...stage.availableChecklists]
      })),
      currentStageIndex: 0,
      createdAt: new Date()
    };

    this.draftService.saveDraft(draft);
    this.router.navigate(['/workspace-wizard']);
  }

  toggleMenu(event: Event, template: Template) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === template.id ? null : template.id;
  }

  deleteTemplate(event: Event, template: Template) {
    event.stopPropagation(); // Prevent card click
    this.activeMenuId = null; // Close menu

    const templateName = template.name;
    if (confirm(`Are you sure you want to delete "${templateName}"?`)) {
      this.templateService.deleteTemplate(template.id || '').subscribe({
        next: () => {
          this.templates = this.templates.filter(t => t.id !== template.id);
          this.notificationService.showSuccess(`Template "${templateName}" deleted successfully!`);
        },
        error: (error) => {
          console.error('Error deleting template:', error);
          this.notificationService.showError('Failed to delete template. Please try again.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/design-process-flow']);
  }
}
