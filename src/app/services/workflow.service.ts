import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Workflow {
  id: string;
  name: string;
  status: string;
  stages: number;
  totalCases: number;
  openCases: number;
  resolvedCases: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private apiService: ApiService) {}

  getWorkflows(): Observable<Workflow[]> {
    return this.apiService.get<Workflow[]>('workflows');
  }

  getWorkflowById(id: string): Observable<Workflow> {
    return this.apiService.get<Workflow>(`workflows/${id}`);
  }

  createWorkflow(workflow: Partial<Workflow>): Observable<Workflow> {
    return this.apiService.post<Workflow>('workflows', workflow);
  }

  updateWorkflow(id: string, workflow: Partial<Workflow>): Observable<Workflow> {
    return this.apiService.put<Workflow>(`workflows/${id}`, workflow);
  }

  deleteWorkflow(id: string): Observable<void> {
    return this.apiService.delete<void>(`workflows/${id}`);
  }
}
