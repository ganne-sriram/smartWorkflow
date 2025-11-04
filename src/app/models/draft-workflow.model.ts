export interface DraftWorkflow {
  id: string;
  name: string;
  objective: string;
  stages: Stage[];
  currentStageIndex: number;
  createdAt: Date;
}

export interface Stage {
  name: string;
  selectedOptions: string[];
  selectedChecklists: string[];
}

export const AVAILABLE_OPTIONS = [
  'Case Details',
  'Case Summary',
  'Case History',
  'Transaction Details',
  'Account Details',
  'Merchant Response',
  'Documents Submitted',
  'Evidence Collection',
  'Customer Information',
  'Maker Vs Original',
  'Chargeback Documents',
  'Addendums'
];

export const AVAILABLE_CHECKLISTS = [
  'Documents Verified',
  'Reg-E Timeline Met',
  'Reg-Z Timeline Met',
  'Maker Verified',
  'Checker Verified',
  'Fraud Flagged',
  'Merchant Resp. Verified',
  'Customer Notified',
  'Case Intake Verified',
  'Chargeback Verified',
  'Representment Verified',
  'Arbitration Verified'
];

export function generateStageNames(count: number): string[] {
  if (count === 5) {
    return ['Case Initiate', 'Maker', 'Checker', 'QC', 'Resolve'];
  }
  return Array.from({ length: count }, (_, i) => `Stage ${i + 1}`);
}
