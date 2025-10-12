import { Injectable } from '@angular/core';
import { Template } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private readonly STORAGE_KEY = 'saved_templates';

  saveTemplate(template: Template): void {
    const templates = this.getTemplates();
    templates.push(template);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
  }

  getTemplates(): Template[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getTemplateById(id: string): Template | null {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id) || null;
  }

  updateTemplate(template: Template): void {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === template.id);
    if (index > -1) {
      templates[index] = template;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
    }
  }

  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(templates));
  }
}
