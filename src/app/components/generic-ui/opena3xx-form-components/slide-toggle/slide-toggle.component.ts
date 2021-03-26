import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';
@Component({
  selector: 'opena3xx-slide-toggle',
  template: `<div class="full-width margin-top" [formGroup]="group">
      <mat-slide-toggle [placeholder]="field.label" [formControlName]="field.name">
        {{ field.label }}
      </mat-slide-toggle>
    </div>
    <mat-hint>{{ field.hint }}</mat-hint> `,
  styles: ['mat-hint{ font-size:75%;}'],
})
export class SlideToggleComponent implements OnInit {
  field!: FieldConfig;
  group!: FormGroup;
  constructor() {}
  ngOnInit() {}
}
