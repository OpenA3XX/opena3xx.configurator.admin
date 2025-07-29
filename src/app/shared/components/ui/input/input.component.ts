import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'opena3xx-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;
  @Input() icon = '';
  @Input() suffixIcon = '';
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  // Internal value
  private _value = signal('');
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  inputClass = computed(() => {
    const classes = ['opena3xx-input'];
    if (this.hasError()) classes.push('opena3xx-input--error');
    if (this.disabled) classes.push('opena3xx-input--disabled');
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
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this._touched.set(true);
    this.onTouched();
    this.blur.emit(event);
  }

  // Getters for template
  get value(): string {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  get hasSuffixIcon(): boolean {
    return !!this.suffixIcon;
  }

  get inputClasses(): string {
    return this.inputClass();
  }

  get showErrorMessage(): boolean {
    return this.hasError();
  }
}
