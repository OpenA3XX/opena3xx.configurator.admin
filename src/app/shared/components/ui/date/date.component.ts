
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/models/field.interface';

@Component({
  selector: 'opena3xx-date',
  template: `
    <mat-form-field appearance="outline" class="full-width margin-top" [formGroup]="group">
      <mat-label>{{field?.label}}</mat-label>
      <input matInput [matDatepicker]="picker" [formControlName]="field?.name" [placeholder]="field?.label" [disabled]="field?.disabled">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <mat-hint>{{field?.hint}}</mat-hint>
      <ng-container *ngFor="let validation of field?.validations || [];" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field?.name)?.hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </mat-form-field>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    .margin-top {
      margin-top: 16px;
    }
  `]
})
export class DateComponent implements OnInit {
  @Input() field!: FieldConfig;  // ✅ Added missing @Input()
  @Input() group!: FormGroup;    // ✅ Added missing @Input()

  constructor() { }

  ngOnInit() {
    // Add validation check
    if (!this.field) {
      console.error('DateComponent: field input is required');
    }
    if (!this.group) {
      console.error('DateComponent: group input is required');
    }
  }
}
