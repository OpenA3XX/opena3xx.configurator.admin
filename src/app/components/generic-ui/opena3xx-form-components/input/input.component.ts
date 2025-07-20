import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';

@Component({
  selector: 'opena3xx-input',
  template: `
    <mat-form-field appearance="outline" class="full-width" [formGroup]="group">
      <mat-label>{{field.label}}</mat-label>
      <input matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType">
      <mat-hint>{{field.hint}}</mat-hint>
      <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name)!.hasError(validation.name)">{{validation.message}}</mat-error>
      </ng-container>
    </mat-form-field>
  `,
  styles: []
})
export class InputComponent  {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }

}
