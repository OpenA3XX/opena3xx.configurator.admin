import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { FieldConfig, Validator } from '../../../../models/field.interface';

@Component({
  exportAs: 'dynamicForm',
  selector: 'dynamic-form',
  template: `
    <form class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
      <ng-container *ngFor="let field of fields" dynamicField [field]="field" [group]="form">
      </ng-container>
    </form>
  `,
  styles: [],
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];

  @Input() identifier!: number;

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  form!: FormGroup;

  get value() {
    return this.form.value;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createControl();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      if (this.identifier != undefined) {
        this.form.value.identifier = this.identifier;
      }
      this.submit.emit(this.form.value);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach((field: FieldConfig) => {
      if (field.type === 'button' || field.type === 'heading') return;

      if (field.value == 'true') {
        field.value = true;
      } else if (field.value == 'false') {
        field.value = false;
      }

      const control = this.fb.control(field.value, this.bindValidations(field.validations || []));
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any[]) {
    if (validations.length > 0) {
      const validList: (ValidatorFn | null | undefined)[] = [];
      validations.forEach((valid) => {
        if (valid.name == 'required') {
          validList.push(Validators.required);
        } else if (valid.name == 'pattern') {
          validList.push(Validators.pattern(valid.pattern));
        } else {
          validList.push(valid.validator);
        }
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control != null) control.markAsTouched({ onlySelf: true });
    });
  }
}
