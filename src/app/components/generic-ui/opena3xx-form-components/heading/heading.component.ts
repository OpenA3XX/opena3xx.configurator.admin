import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';

@Component({
  selector: 'opena3xx-heading',
  template: `
    <h5 *ngIf="field?.label">{{ field.label }}</h5>
  `,
  styles: [`
    h5 {
      font-size: 20px;
      border-bottom: 1px dashed #d0d0d0;
      margin-top: 20px;
      margin-bottom: 10px;
      color: var(--mat-sys-on-surface, #333);
    }
  `]
  // Remove standalone: true
})
export class HeadingComponent implements OnInit {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;

  ngOnInit() {
    if (!this.field) {
      console.error('HeadingComponent: field input is required');
    }
  }
}
