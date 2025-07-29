import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormFieldComponent, FormFieldConfig } from './form-field.component';

export interface DynamicFormConfig {
  title?: string;
  subtitle?: string;
  fields: FormFieldConfig[];
  layout?: 'single' | 'two-column' | 'three-column';
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export interface DynamicFormData {
  [key: string]: any;
}

@Component({
  selector: 'opena3xx-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FormFieldComponent
  ],
  template: `
    <mat-card class="dynamic-form-card">
      <mat-card-header *ngIf="config.title || config.subtitle">
        <mat-card-title>{{ config.title }}</mat-card-title>
        <mat-card-subtitle *ngIf="config.subtitle">{{ config.subtitle }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" [class]="'form-layout-' + (config.layout || 'single')">
          <div class="form-fields-container">
            <div *ngFor="let field of config.fields"
                 class="form-field-wrapper"
                 [class]="getFieldWrapperClass()">

              <opena3xx-form-field
                [config]="field"
                [control]="getFieldControl(field.key)"
                [parentForm]="form"
                [appearance]="'outline'"
                [floatLabel]="'auto'">
              </opena3xx-form-field>
            </div>
          </div>

          <div class="form-actions" *ngIf="showActions()">
            <button type="button"
                    mat-button
                    *ngIf="config.showCancel"
                    (click)="onCancel()"
                    [disabled]="config.disabled">
              {{ config.cancelText || 'Cancel' }}
            </button>

            <button type="submit"
                    mat-raised-button
                    color="primary"
                    [disabled]="form.invalid || config.disabled || config.loading">
              <mat-spinner *ngIf="config.loading"
                          diameter="16"
                          class="button-spinner">
              </mat-spinner>
              <mat-icon *ngIf="!config.loading">save</mat-icon>
              {{ config.submitText || 'Submit' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() config!: DynamicFormConfig;
  @Input() initialData?: DynamicFormData;
  @Output() formSubmit = new EventEmitter<DynamicFormData>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formChange = new EventEmitter<DynamicFormData>();

  form!: FormGroup;

  // Signals for reactive state
  isFormValid = signal(false);
  isFormDirty = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.setupFormListeners();
  }

  private createForm(): void {
    const group: { [key: string]: any } = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.initialData?.[field.key] || this.getDefaultValue(field);

      group[field.key] = [initialValue, validators];
    });

    this.form = this.fb.group(group);
  }

  private buildValidators(field: FormFieldConfig): any[] {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }

    // Type-specific validators
    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.type === 'url') {
      validators.push(Validators.pattern(/^https?:\/\/.+/));
    }

    return validators;
  }

  private getDefaultValue(field: FormFieldConfig): any {
    switch (field.type) {
      case 'checkbox':
      case 'toggle':
        return false;
      case 'select':
        return field.multiple ? [] : null;
      case 'number':
        return null;
      default:
        return '';
    }
  }

  private setupFormListeners(): void {
    this.form.valueChanges.subscribe(value => {
      this.isFormDirty.set(this.form.dirty);
      this.formChange.emit(value);
    });

    this.form.statusChanges.subscribe(status => {
      this.isFormValid.set(status === 'VALID');
    });
  }

  getFieldControl(key: string): any {
    return this.form.get(key);
  }

  getFieldWrapperClass(): string {
    const layout = this.config.layout || 'single';

    switch (layout) {
      case 'two-column':
        return 'field-wrapper-two-column';
      case 'three-column':
        return 'field-wrapper-three-column';
      default:
        return 'field-wrapper-single';
    }
  }

  showActions(): boolean {
    return this.config.submitText !== undefined || this.config.showCancel;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  // Public methods for external control
  resetForm(): void {
    this.form.reset();
  }

  setFormData(data: DynamicFormData): void {
    this.form.patchValue(data);
  }

  getFormData(): DynamicFormData {
    return this.form.value;
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  setFieldValue(key: string, value: any): void {
    const control = this.form.get(key);
    if (control) {
      control.setValue(value);
    }
  }

  getFieldValue(key: string): any {
    const control = this.form.get(key);
    return control ? control.value : null;
  }

  isFieldValid(key: string): boolean {
    const control = this.form.get(key);
    return control ? control.valid : true;
  }

  getFieldError(key: string): string | null {
    const control = this.form.get(key);
    if (control && control.invalid && control.touched) {
      const errors = control.errors;
      if (errors) {
        if (errors['required']) return 'This field is required';
        if (errors['email']) return 'Please enter a valid email';
        if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength}`;
        if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength}`;
        if (errors['min']) return `Minimum value is ${errors['min'].min}`;
        if (errors['max']) return `Maximum value is ${errors['max'].max}`;
        if (errors['pattern']) return 'Invalid format';
      }
    }
    return null;
  }
}
