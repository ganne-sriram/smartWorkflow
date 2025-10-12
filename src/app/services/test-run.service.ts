import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TestRun, TestRunStage } from '../models/template.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TestRunService {

  constructor(private apiService: ApiService) {}

  saveTestRun(testRun: TestRun): Observable<TestRun> {
    if (testRun.id && !testRun.id.startsWith('temp_')) {
      return this.apiService.put<TestRun>(`test-runs/${testRun.id}`, testRun);
    } else {
      return this.apiService.post<TestRun>('test-runs', testRun);
    }
  }

  getTestRun(id: string): Observable<TestRun> {
    return this.apiService.get<TestRun>(`test-runs/${id}`);
  }

  getAllTestRuns(): Observable<TestRun[]> {
    return this.apiService.get<TestRun[]>('test-runs');
  }

  updateStage(testRun: TestRun, stageIndex: number, stage: TestRunStage): void {
    testRun.stages[stageIndex] = stage;
  }
}
