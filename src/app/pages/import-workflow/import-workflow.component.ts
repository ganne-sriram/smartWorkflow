import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-workflow',
  imports: [],
  templateUrl: './import-workflow.component.html',
  styleUrl: './import-workflow.component.css'
})
export class ImportWorkflowComponent {
  
  constructor(private router: Router) {}

  handleImportOption(type: string) {
    console.log(`Import option selected: ${type}`);
  }
}
