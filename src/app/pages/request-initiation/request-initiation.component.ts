import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'address' | 'number';
  value: string;
}

@Component({
  selector: 'app-request-initiation',
  imports: [CommonModule, FormsModule],
  templateUrl: './request-initiation.component.html',
  styleUrl: './request-initiation.component.css'
})
export class RequestInitiationComponent implements OnInit {
  currentStage: number = 1;
  totalStages: number = 4;
  
  caseDetailsFields: DynamicField[] = [];
  transactionDetailsFields: DynamicField[] = [];
  
  selectedSection: 'case' | 'transaction' = 'case';
  newFieldLabel: string = '';
  newFieldType: 'text' | 'address' | 'number' = 'text';
  showAddFieldDialog: boolean = false;
  
  requestComments: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeDefaultFields();
  }

  initializeDefaultFields() {
    this.caseDetailsFields = [
      {
        id: 'field_' + Date.now() + '_1',
        label: 'Account Number',
        type: 'text',
        value: ''
      },
      {
        id: 'field_' + Date.now() + '_2',
        label: 'First Name',
        type: 'text',
        value: ''
      },
      {
        id: 'field_' + Date.now() + '_3',
        label: 'Last Name',
        type: 'text',
        value: ''
      },
      {
        id: 'field_' + Date.now() + '_4',
        label: 'Date of Birth (mm/cd/yl)',
        type: 'text',
        value: ''
      },
      {
        id: 'field_' + Date.now() + '_5',
        label: 'Address',
        type: 'address',
        value: ''
      }
    ];
  }

  getStages(): number[] {
    return Array.from({ length: this.totalStages }, (_, i) => i + 1);
  }

  openAddFieldDialog(section: 'case' | 'transaction') {
    this.selectedSection = section;
    this.newFieldLabel = '';
    this.newFieldType = 'text';
    this.showAddFieldDialog = true;
  }

  closeAddFieldDialog() {
    this.showAddFieldDialog = false;
    this.newFieldLabel = '';
    this.newFieldType = 'text';
  }

  addField() {
    if (!this.newFieldLabel.trim()) {
      return;
    }

    const newField: DynamicField = {
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      label: this.newFieldLabel.trim(),
      type: this.newFieldType,
      value: ''
    };

    if (this.selectedSection === 'case') {
      this.caseDetailsFields.push(newField);
    } else {
      this.transactionDetailsFields.push(newField);
    }

    this.closeAddFieldDialog();
  }

  deleteField(section: 'case' | 'transaction', fieldId: string) {
    if (section === 'case') {
      const index = this.caseDetailsFields.findIndex(f => f.id === fieldId);
      if (index > -1) {
        this.caseDetailsFields.splice(index, 1);
      }
    } else {
      const index = this.transactionDetailsFields.findIndex(f => f.id === fieldId);
      if (index > -1) {
        this.transactionDetailsFields.splice(index, 1);
      }
    }
  }

  canSave(): boolean {
    const caseFieldsFilled = this.caseDetailsFields.some(field => field.value.trim() !== '');
    const transactionFieldsFilled = this.transactionDetailsFields.some(field => field.value.trim() !== '');
    return caseFieldsFilled || transactionFieldsFilled;
  }

  saveDraft() {
    if (!this.canSave()) {
      alert('Please fill in at least one field before saving.');
      return;
    }

    const draftData = {
      caseDetailsFields: this.caseDetailsFields,
      transactionDetailsFields: this.transactionDetailsFields,
      requestComments: this.requestComments,
      savedAt: new Date()
    };

    localStorage.setItem('request_initiation_draft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  }

  cancelRequest() {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.router.navigate(['/available-workflows']);
    }
  }

  loadDraft() {
    const savedDraft = localStorage.getItem('request_initiation_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        this.caseDetailsFields = draftData.caseDetailsFields || [];
        this.transactionDetailsFields = draftData.transactionDetailsFields || [];
        this.requestComments = draftData.requestComments || '';
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }
}
