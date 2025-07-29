import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'opena3xx-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<boolean>();
  @Output() change = new EventEmitter<boolean>();

  // Internal value
  private _value = signal(false);
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  checkboxClass = computed(() => {
    const classes = ['opena3xx-checkbox'];
    if (this.hasError()) classes.push('opena3xx-checkbox--error');
    if (this.disabled) classes.push('opena3xx-checkbox--disabled');
    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  onChange = (value: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this._value.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onCheckboxChange(event: any): void {
    const value = event.checked;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.change.emit(value);
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  // Getters for template
  get value(): boolean {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get checkboxClasses(): string {
    return this.checkboxClass();
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
}
