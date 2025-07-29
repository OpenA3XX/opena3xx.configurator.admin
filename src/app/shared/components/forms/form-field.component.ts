import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'toggle' | 'date' | 'time' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: Array<{ value: any; label: string; disabled?: boolean }>;
  multiple?: boolean;
  rows?: number;
  cols?: number;
  step?: number;
  hint?: string;
  errorMessages?: Record<string, string>;
  conditional?: {
    field: string;
    value: any;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  };
  validation?: {
    required?: boolean;
    email?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

@Component({
  selector: 'opena3xx-form-field',
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
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div *ngIf="isVisible()" class="form-field-container" [class]="fieldClass()">
      <mat-form-field [appearance]="appearance" [floatLabel]="floatLabel">
        <mat-label>{{ config.label }}</mat-label>

        <!-- Text Input -->
        <input *ngIf="config.type === 'text' || config.type === 'email' || config.type === 'password' || config.type === 'url'"
               matInput
               [type]="getInputType()"
               [placeholder]="config.placeholder"
               [formControl]="control"
               [readonly]="config.readonly"
               [attr.minlength]="config.minLength"
               [attr.maxlength]="config.maxLength"
               [attr.pattern]="config.pattern">

        <!-- Number Input -->
        <input *ngIf="config.type === 'number'"
               matInput
               type="number"
               [placeholder]="config.placeholder"
               [formControl]="control"
               [readonly]="config.readonly"
               [attr.min]="config.min"
               [attr.max]="config.max"
               [attr.step]="config.step">

        <!-- Textarea -->
        <textarea *ngIf="config.type === 'textarea'"
                  matInput
                  [placeholder]="config.placeholder"
                  [formControl]="control"
                  [readonly]="config.readonly"
                  [attr.minlength]="config.minLength"
                  [attr.maxlength]="config.maxLength"
                  [rows]="config.rows || 3"
                  [cols]="config.cols"></textarea>

        <!-- Select -->
        <mat-select *ngIf="config.type === 'select'"
                    [formControl]="control"
                    [multiple]="config.multiple"
                    [placeholder]="config.placeholder">
          <mat-option *ngFor="let option of config.options"
                      [value]="option.value"
                      [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
        </mat-select>

        <!-- Date Picker -->
        <input *ngIf="config.type === 'date'"
               matInput
               [matDatepicker]="datepicker"
               [placeholder]="config.placeholder"
               [formControl]="control"
               [readonly]="config.readonly">
        <mat-datepicker-toggle *ngIf="config.type === 'date'" matSuffix [for]="datepicker"></mat-datepicker-toggle>
        <mat-datepicker *ngIf="config.type === 'date'" #datepicker></mat-datepicker>

        <!-- Time Input -->
        <input *ngIf="config.type === 'time'"
               matInput
               type="time"
               [placeholder]="config.placeholder"
               [formControl]="control"
               [readonly]="config.readonly">

        <!-- Error Messages -->
        <mat-error *ngIf="control.invalid && control.touched">
          <span *ngIf="control.errors?.['required']">{{ getErrorMessage('required') }}</span>
          <span *ngIf="control.errors?.['email']">{{ getErrorMessage('email') }}</span>
          <span *ngIf="control.errors?.['minlength']">{{ getErrorMessage('minlength') }}</span>
          <span *ngIf="control.errors?.['maxlength']">{{ getErrorMessage('maxlength') }}</span>
          <span *ngIf="control.errors?.['min']">{{ getErrorMessage('min') }}</span>
          <span *ngIf="control.errors?.['max']">{{ getErrorMessage('max') }}</span>
          <span *ngIf="control.errors?.['pattern']">{{ getErrorMessage('pattern') }}</span>
          <span *ngIf="control.errors?.['custom']">{{ control.errors?.['custom'] }}</span>
        </mat-error>

        <!-- Hint -->
        <mat-hint *ngIf="config.hint">{{ config.hint }}</mat-hint>
      </mat-form-field>

      <!-- Checkbox (outside form field) -->
      <mat-checkbox *ngIf="config.type === 'checkbox'"
                    [formControl]="control"
                    [disabled]="config.disabled">
        {{ config.label }}
      </mat-checkbox>

      <!-- Toggle (outside form field) -->
      <div *ngIf="config.type === 'toggle'" class="toggle-container">
        <mat-slide-toggle [formControl]="control" [disabled]="config.disabled">
          {{ config.label }}
        </mat-slide-toggle>
      </div>
    </div>
  `,
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() floatLabel: 'always' | 'auto' = 'auto';
  @Input() parentForm?: any; // For conditional logic

  // Signals for reactive state
  isVisible = signal(true);
  fieldClass = computed(() => `field-${this.config.type}`);

  ngOnInit(): void {
    this.setupValidation();
    this.setupConditionalLogic();
  }

  private setupValidation(): void {
    const validators = [];

    if (this.config.validation?.required) {
      validators.push(Validators.required);
    }

    if (this.config.validation?.email) {
      validators.push(Validators.email);
    }

    if (this.config.validation?.minLength) {
      validators.push(Validators.minLength(this.config.validation.minLength!));
    }

    if (this.config.validation?.maxLength) {
      validators.push(Validators.maxLength(this.config.validation.maxLength!));
    }

    if (this.config.validation?.min) {
      validators.push(Validators.min(this.config.validation.min!));
    }

    if (this.config.validation?.max) {
      validators.push(Validators.max(this.config.validation.max!));
    }

    if (this.config.validation?.pattern) {
      validators.push(Validators.pattern(this.config.validation.pattern!));
    }

    if (this.config.validation?.custom) {
      validators.push(this.config.validation.custom);
    }

    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }

  private setupConditionalLogic(): void {
    if (this.config.conditional && this.parentForm) {
      const dependentField = this.parentForm.get(this.config.conditional.field);

      if (dependentField) {
        dependentField.valueChanges.subscribe(value => {
          this.isVisible.set(this.evaluateCondition(value));
        });

        // Initial evaluation
        this.isVisible.set(this.evaluateCondition(dependentField.value));
      }
    }
  }

  private evaluateCondition(value: any): boolean {
    if (!this.config.conditional) return true;

    const { operator, value: expectedValue } = this.config.conditional;

    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'notEquals':
        return value !== expectedValue;
      case 'contains':
        return String(value).includes(String(expectedValue));
      case 'greaterThan':
        return Number(value) > Number(expectedValue);
      case 'lessThan':
        return Number(value) < Number(expectedValue);
      default:
        return true;
    }
  }

  getInputType(): string {
    switch (this.config.type) {
      case 'email':
        return 'email';
      case 'password':
        return 'password';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  }

  getErrorMessage(errorType: string): string {
    const defaultMessages: Record<string, string> = {
      required: `${this.config.label} is required`,
      email: `Please enter a valid email address`,
      minlength: `${this.config.label} must be at least ${this.config.validation?.minLength} characters`,
      maxlength: `${this.config.label} must be no more than ${this.config.validation?.maxLength} characters`,
      min: `${this.config.label} must be at least ${this.config.validation?.min}`,
      max: `${this.config.label} must be no more than ${this.config.validation?.max}`,
      pattern: `${this.config.label} format is invalid`
    };

    return this.config.errorMessages?.[errorType] || defaultMessages[errorType] || `${this.config.label} is invalid`;
  }
}
