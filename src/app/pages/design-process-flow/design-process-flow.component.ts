import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-process-flow',
  imports: [],
  templateUrl: './design-process-flow.component.html',
  styleUrl: './design-process-flow.component.css'
})
export class DesignProcessFlowComponent {
  
  constructor(private router: Router) {}

  navigateToWorkflow(type: string) {
    console.log(`Navigate to ${type} workflow`);
  }
}
