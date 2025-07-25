import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from 'src/app/shared/models/field.interface';

@Component({
  selector: 'opena3xx-input',
  template: `
    <mat-form-field appearance="outline" class="full-width" [formGroup]="group" *ngIf="field">
      <mat-label>{{field.label}}</mat-label>
      <input matInput
             [type]="field.inputType || 'text'"
             [formControlName]="field.name"
             [placeholder]="field.label"
             [disabled]="field.disabled">
      <mat-hint *ngIf="field.hint">{{field.hint}}</mat-hint>
      <ng-container *ngFor="let validation of field.validations || [];">
        <mat-error *ngIf="group.get(field.name)?.hasError(validation.name)">
          {{validation.message}}
        </mat-error>
      </ng-container>
    </mat-form-field>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class InputComponent implements OnInit {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;

  ngOnInit() {
    if (!this.field) {
      console.error('InputComponent: field input is required');
    }
    if (!this.group) {
      console.error('InputComponent: group input is required');
    }
  }
}
