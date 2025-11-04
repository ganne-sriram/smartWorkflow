import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { NotificationService } from '../../services/notification.service';
import { Template } from '../../models/template.model';

interface Workflow {
  id: string;
  name: string;
  status: string;
  stages: number;
  totalCases: number;
  openCases: number;
  resolvedCases: number;
  lastUpdated: string;
  type: 'workflow' | 'template';
}

@Component({
  selector: 'app-available-workflows',
  imports: [CommonModule],
  templateUrl: './available-workflows.component.html',
  styleUrl: './available-workflows.component.css'
})
export class AvailableWorkflowsComponent implements OnInit {
  workflows: Workflow[] = [];
  templateWorkflows: Workflow[] = [];
  exampleWorkflows: Workflow[] = [];
  activeMenuId: string | null = null;

  constructor(
    private router: Router,
    private templateService: TemplateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadWorkflows();
  }

  loadWorkflows() {
    const exampleWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Customer Onboarding Process',
        status: 'active',
        stages: 5,
        totalCases: 234,
        openCases: 45,
        resolvedCases: 189,
        lastUpdated: 'Oct 11, 2024',
        type: 'workflow'
      },
      {
        id: '2',
        name: 'Invoice Approval Workflow',
        status: 'active',
        stages: 4,
        totalCases: 567,
        openCases: 89,
        resolvedCases: 478,
        lastUpdated: 'Oct 10, 2024',
        type: 'workflow'
      },
      {
        id: '3',
        name: 'Support Ticket Resolution',
        status: 'active',
        stages: 6,
        totalCases: 892,
        openCases: 123,
        resolvedCases: 769,
        lastUpdated: 'Oct 11, 2024',
        type: 'workflow'
      }
    ];

    this.exampleWorkflows = exampleWorkflows;

    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.templateWorkflows = templates.map(template => ({
          id: template.id || '',
          name: template.name,
          status: template.status,
          stages: template.stages.length,
          totalCases: 0,
          openCases: 0,
          resolvedCases: 0,
          lastUpdated: new Date(template.updatedAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'template' as const
        }));

        this.workflows = [...this.templateWorkflows, ...this.exampleWorkflows];
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.templateWorkflows = [];
        this.workflows = [...this.exampleWorkflows];
      }
    });
  }

  openWorkflow(workflow: Workflow) {
    if (workflow.type === 'template') {
      this.router.navigate(['/test-runner', workflow.id]);
    } else {
      console.log(`Opening workflow: ${workflow.id}`);
    }
  }

  toggleMenu(event: Event, workflow: Workflow) {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === workflow.id ? null : workflow.id;
  }

  deleteTemplate(event: Event, workflow: Workflow) {
    event.stopPropagation(); // Prevent card click
    this.activeMenuId = null; // Close menu

    if (workflow.type !== 'template') {
      return; // Only allow deleting templates
    }

    const templateName = workflow.name;
    if (confirm(`Are you sure you want to delete "${templateName}"?`)) {
      this.templateService.deleteTemplate(workflow.id).subscribe({
        next: () => {
          this.templateWorkflows = this.templateWorkflows.filter(w => w.id !== workflow.id);
          this.workflows = this.workflows.filter(w => w.id !== workflow.id);
          this.notificationService.showSuccess(`Template "${templateName}" deleted successfully!`);
        },
        error: (error) => {
          console.error('Error deleting template:', error);
          this.notificationService.showError('Failed to delete template. Please try again.');
        }
      });
    }
  }
}
