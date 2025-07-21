import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';
@Component({
  selector: 'opena3xx-forms-select',
  template: `
    <mat-form-field class="full-width margin-top" [formGroup]="group">
      <mat-select
        [disabled]="field.disabled"
        [placeholder]="field.label"
        [formControlName]="field.name"
        (selectionChange)="onSelectComponentChange($event)"
      >
        <mat-option *ngFor="let item of field.options" [value]="item.key">{{
          item.value
        }}</mat-option>
      </mat-select>
      <ng-container *ngFor="let validation of field.validations" ngProjectAs="mat-error">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{
          validation.message
        }}</mat-error>
      </ng-container>
      <mat-hint>{{ field.hint }}</mat-hint>
    </mat-form-field>
  `,
  styles: [],
})
export class SelectComponent {
  @Output() selectChange: EventEmitter<{value: string}> = new EventEmitter<{value: string}>();

  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;

  ngOnInit() {
    console.log('SelectComponent initialized with field:', this.field);
    console.log('Field options:', this.field?.options);
  }

  ngOnChanges() {
    console.log('SelectComponent field changed:', this.field);
    console.log('Field options updated:', this.field?.options);
  }

  onSelectComponentChange(event: {value: string}) {
    this.selectChange.emit(event);
    console.log('Event OnSelectComponent Change Emmited');
  }
}
