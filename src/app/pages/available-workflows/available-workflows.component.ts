import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
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

  constructor(
    private router: Router,
    private templateService: TemplateService
  ) {}

  ngOnInit() {
    this.loadWorkflows();
  }

  loadWorkflows() {
    const regularWorkflows: Workflow[] = [
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
      },
      {
        id: '4',
        name: 'Product Development Pipeline',
        status: 'active',
        stages: 8,
        totalCases: 156,
        openCases: 67,
        resolvedCases: 89,
        lastUpdated: 'Oct 9, 2024',
        type: 'workflow'
      },
      {
        id: '5',
        name: 'HR Recruitment Process',
        status: 'active',
        stages: 7,
        totalCases: 345,
        openCases: 78,
        resolvedCases: 267,
        lastUpdated: 'Oct 10, 2024',
        type: 'workflow'
      },
      {
        id: '6',
        name: 'Quality Assurance Testing',
        status: 'active',
        stages: 5,
        totalCases: 423,
        openCases: 91,
        resolvedCases: 332,
        lastUpdated: 'Oct 11, 2024',
        type: 'workflow'
      }
    ];

    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        const templateWorkflows: Workflow[] = templates.map(template => ({
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

        this.workflows = [...templateWorkflows, ...regularWorkflows];
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.workflows = [...regularWorkflows];
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
}
