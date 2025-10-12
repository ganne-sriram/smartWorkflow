import { Injectable } from '@angular/core';
import { TestRun, TestRunStage } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TestRunService {
  private readonly STORAGE_KEY = 'current_test_run';

  saveTestRun(testRun: TestRun): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(testRun));
  }

  getTestRun(): TestRun | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearTestRun(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  updateStage(testRun: TestRun, stageIndex: number, stage: TestRunStage): void {
    testRun.stages[stageIndex] = stage;
    this.saveTestRun(testRun);
  }
}
