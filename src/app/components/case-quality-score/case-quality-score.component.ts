import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-quality-score',
  imports: [CommonModule],
  templateUrl: './case-quality-score.component.html',
  styleUrl: './case-quality-score.component.css'
})
export class CaseQualityScoreComponent implements OnChanges {
  @Input() completed: number = 0;
  @Input() total: number = 0;
  @Input() stageName: string = '';
  @Input() checklistItems: string[] = [];
  @Input() selectedItems: string[] = [];

  percentage: number = 0;
  circumference: number = 2 * Math.PI * 40;

  ngOnChanges() {
    this.percentage = this.total > 0 ? Math.round((this.completed / this.total) * 100) : 0;
  }

  getStrokeDashoffset(): number {
    const progress = this.total > 0 ? this.completed / this.total : 0;
    return this.circumference * (1 - progress);
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }
}
