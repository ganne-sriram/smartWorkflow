import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private apiService: ApiService) {}

  saveTemplate(template: Template): Observable<Template> {
    return this.apiService.post<Template>('templates', template);
  }

  getTemplates(): Observable<Template[]> {
    return this.apiService.get<Template[]>('templates');
  }

  getTemplateById(id: string): Observable<Template> {
    return this.apiService.get<Template>(`templates/${id}`);
  }

  updateTemplate(template: Template): Observable<Template> {
    return this.apiService.put<Template>(`templates/${template.id}`, template);
  }

  publishTemplate(id: string): Observable<Template> {
    return this.apiService.post<Template>(`templates/${id}/publish`, {});
  }

  deleteTemplate(id: string): Observable<void> {
    return this.apiService.delete<void>(`templates/${id}`);
  }

  importTemplate(json: string): Observable<Template> {
    return this.apiService.post<Template>('templates/import', { data: json });
  }

  exportTemplate(id: string): Observable<string> {
    return this.apiService.get<string>(`templates/${id}/export`);
  }
}
