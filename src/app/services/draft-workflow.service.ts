import { Injectable } from '@angular/core';
import { DraftWorkflow, Stage, generateStageNames } from '../models/draft-workflow.model';

@Injectable({
  providedIn: 'root'
})
export class DraftWorkflowService {
  private readonly STORAGE_KEY = 'draft_workflow';

  createDraft(name: string, objective: string, stageCount: number): DraftWorkflow {
    const stageNames = generateStageNames(stageCount);
    const stages: Stage[] = stageNames.map(stageName => ({
      name: stageName,
      selectedOptions: [],
      selectedChecklists: []
    }));

    const draft: DraftWorkflow = {
      id: Date.now().toString(),
      name,
      objective,
      stages,
      currentStageIndex: 0,
      createdAt: new Date()
    };

    this.saveDraft(draft);
    return draft;
  }

  saveDraft(draft: DraftWorkflow): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
  }

  getDraft(): DraftWorkflow | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearDraft(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  updateStage(draft: DraftWorkflow, stageIndex: number, stage: Stage): void {
    draft.stages[stageIndex] = stage;
    this.saveDraft(draft);
  }
}
