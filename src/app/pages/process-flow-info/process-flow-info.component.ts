import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onNext() {
    console.log('Process Flow Information:', {
      name: this.processFlowName,
      objective: this.processFlowObjective,
      stages: this.numberOfStages
    });
  }
}
