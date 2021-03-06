import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";
@Component({
  selector: "opena3xx-input",
  template: `
<mat-form-field appearance="standard" class="full-width" [formGroup]="group">
  <mat-label>{{field.label}}</mat-label>
  <input autocomplete="off" matInput [formControlName]="field.name" [placeholder]="field.label" [type]="field.inputType">
  <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
    <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{validation.message}}</mat-error>
  </ng-container>
  <mat-hint>{{field.hint}}</mat-hint>
</mat-form-field>
`,
  styles: []
})
export class InputComponent {
  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;
  
  constructor() {}
}
