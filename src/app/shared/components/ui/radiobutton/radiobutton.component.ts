import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'opena3xx-radio-button',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ],
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadioButtonComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() options: RadioOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<RadioOption>();

  // Internal value
  private _value = signal('');
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  radioClass = computed(() => {
    const classes = ['opena3xx-radio-button'];
    if (this.hasError()) classes.push('opena3xx-radio-button--error');
    if (this.disabled) classes.push('opena3xx-radio-button--disabled');
    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this._value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onRadioChange(value: string): void {
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    const selectedOption = this.options.find(option => option.value.toString() === value);
    if (selectedOption) {
      this.selectionChange.emit(selectedOption);
    }
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  // Getters for template
  get value(): string {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get radioClasses(): string {
    return this.radioClass();
  }

  get showErrorMessage(): boolean {
    return this.hasError();
  }

  get hasLabel(): boolean {
    return !!this.label;
  }

  get hasHint(): boolean {
    return !!this.hint;
  }

  get hasOptions(): boolean {
    return this.options.length > 0;
  }
}
