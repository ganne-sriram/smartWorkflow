import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Workflow {
  id: string;
  name: string;
  status: string;
  stages: number;
  totalCases: number;
  openCases: number;
  resolvedCases: number;
  lastUpdated: string;
}

@Component({
  selector: 'app-available-workflows',
  imports: [CommonModule],
  templateUrl: './available-workflows.component.html',
  styleUrl: './available-workflows.component.css'
})
export class AvailableWorkflowsComponent implements OnInit {
  workflows: Workflow[] = [];

  ngOnInit() {
    this.workflows = [
      {
        id: '1',
        name: 'Customer Onboarding Process',
        status: 'active',
        stages: 5,
        totalCases: 234,
        openCases: 45,
        resolvedCases: 189,
        lastUpdated: 'Oct 11, 2024'
      },
      {
        id: '2',
        name: 'Invoice Approval Workflow',
        status: 'active',
        stages: 4,
        totalCases: 567,
        openCases: 89,
        resolvedCases: 478,
        lastUpdated: 'Oct 10, 2024'
      },
      {
        id: '3',
        name: 'Support Ticket Resolution',
        status: 'active',
        stages: 6,
        totalCases: 892,
        openCases: 123,
        resolvedCases: 769,
        lastUpdated: 'Oct 11, 2024'
      },
      {
        id: '4',
        name: 'Product Development Pipeline',
        status: 'active',
        stages: 8,
        totalCases: 156,
        openCases: 67,
        resolvedCases: 89,
        lastUpdated: 'Oct 9, 2024'
      },
      {
        id: '5',
        name: 'HR Recruitment Process',
        status: 'active',
        stages: 7,
        totalCases: 345,
        openCases: 78,
        resolvedCases: 267,
        lastUpdated: 'Oct 10, 2024'
      },
      {
        id: '6',
        name: 'Quality Assurance Testing',
        status: 'active',
        stages: 5,
        totalCases: 423,
        openCases: 91,
        resolvedCases: 332,
        lastUpdated: 'Oct 11, 2024'
      }
    ];
  }

  openWorkflow(id: string) {
    console.log(`Opening workflow: ${id}`);
  }
}
