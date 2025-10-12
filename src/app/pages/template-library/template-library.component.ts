import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { DraftWorkflowService } from '../../services/draft-workflow.service';
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

  constructor(
    private templateService: TemplateService,
    private draftService: DraftWorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.templates = this.templateService.getTemplates();
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

  goBack() {
    this.router.navigate(['/design-process-flow']);
  }
}
