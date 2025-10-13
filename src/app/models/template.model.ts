import { DraftWorkflow } from './draft-workflow.model';

export interface Template {
  id?: string | null;
  name: string;
  objective: string;
  stages: TemplateStage[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  version: number;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface TemplateStage {
  name: string;
  availableOptions: string[];
  availableChecklists: string[];
}

export interface TestRun {
  id: string;
  templateId: string;
  templateName: string;
  currentStageIndex: number;
  stages: TestRunStage[];
  startedAt: Date;
}

export interface TestRunStage {
  name: string;
  availableOptions: string[];
  availableChecklists: string[];
  selectedOptions: string[];
  selectedChecklists: string[];
}

export function convertDraftToTemplate(draft: DraftWorkflow): Template {
  return {
    name: draft.name,
    objective: draft.objective,
    stages: draft.stages.map(stage => ({
      name: stage.name,
      availableOptions: [...stage.selectedOptions],
      availableChecklists: [...stage.selectedChecklists]
    })),
    status: 'DRAFT',
    version: 1
  };
}

export function createTestRunFromTemplate(template: Template): TestRun {
  return {
    id: 'temp_' + Date.now().toString(),
    templateId: template.id || '',
    templateName: template.name,
    currentStageIndex: 0,
    stages: template.stages.map(stage => ({
      name: stage.name,
      availableOptions: [...stage.availableOptions],
      availableChecklists: [...stage.availableChecklists],
      selectedOptions: [],
      selectedChecklists: []
    })),
    startedAt: new Date()
  };
}
