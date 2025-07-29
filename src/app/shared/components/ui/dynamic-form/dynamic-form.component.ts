
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface DynamicFormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'toggle' | 'date' | 'radio';
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: string | number; label: string; disabled?: boolean }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    email?: boolean;
  };
  [key: string]: any;
}

export interface DynamicFormConfig {
  title?: string;
  subtitle?: string;
  fields: DynamicFormField[];
  layout?: 'single' | 'two-column' | 'three-column';
  submitText?: string;
  cancelText?: string;
  showCancel?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'opena3xx-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent {
  @Input() config!: DynamicFormConfig;
  @Input() initialData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formChange = new EventEmitter<any>();

  // Form
  form: FormGroup = new FormGroup({});

  // Computed properties
  formClass = computed(() => {
    const classes = ['opena3xx-dynamic-form'];
    if (this.config?.layout) {
      classes.push(`opena3xx-dynamic-form--${this.config.layout}`);
    }
    return classes.join(' ');
  });

  isSubmitting = computed(() => this.config?.loading || false);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.setInitialValues();
  }

  private buildForm(): void {
    const group: any = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      group[field.key] = ['', validators];
    });

    this.form = this.formBuilder.group(group);
  }

  private buildValidators(field: DynamicFormField): any[] {
    const validators = [];

    if (field.validation) {
      if (field.validation.required) {
        validators.push(Validators.required);
      }
      if (field.validation.minLength) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation.maxLength) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation.min) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation.max) {
        validators.push(Validators.max(field.validation.max));
      }
      if (field.validation.pattern) {
        validators.push(Validators.pattern(field.validation.pattern));
      }
      if (field.validation.email) {
        validators.push(Validators.email);
      }
    }

    return validators;
  }

  private setInitialValues(): void {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onFieldChange(): void {
    this.formChange.emit(this.form.value);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for template
  get formClasses(): string {
    return this.formClass();
  }

  get submitting(): boolean {
    return this.isSubmitting();
  }

  get hasTitle(): boolean {
    return !!this.config?.title;
  }

  get hasSubtitle(): boolean {
    return !!this.config?.subtitle;
  }

  get showCancelButton(): boolean {
    return this.config?.showCancel || false;
  }

  get submitButtonText(): string {
    return this.config?.submitText || 'Submit';
  }

  get cancelButtonText(): string {
    return this.config?.cancelText || 'Cancel';
  }
}
