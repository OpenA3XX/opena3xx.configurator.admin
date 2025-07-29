import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'opena3xx-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() options: SelectOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<string | string[]>();
  @Output() selectionChange = new EventEmitter<SelectOption | SelectOption[]>();

  // Internal value
  private _value = signal<string | string[]>('');
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  selectClass = computed(() => {
    const classes = ['opena3xx-select'];
    if (this.hasError()) classes.push('opena3xx-select--error');
    if (this.disabled) classes.push('opena3xx-select--disabled');
    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  onChange = (value: string | string[]) => {};
  onTouched = () => {};

  writeValue(value: string | string[]): void {
    this._value.set(value || (this.multiple ? [] : ''));
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onSelectionChange(event: any): void {
    const value = event.value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.selectionChange.emit(this.getSelectedOptions(value));
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  private getSelectedOptions(value: string | string[]): SelectOption | SelectOption[] {
    if (this.multiple && Array.isArray(value)) {
      return this.options.filter(option => value.includes(option.value.toString()));
    } else if (!this.multiple && typeof value === 'string') {
      return this.options.find(option => option.value.toString() === value) || this.options[0];
    }
    return this.options[0];
  }

  // Getters for template
  get value(): string | string[] {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get selectClasses(): string {
    return this.selectClass();
  }

  get showErrorMessage(): boolean {
    return this.hasError();
  }

  get hasOptions(): boolean {
    return this.options.length > 0;
  }
}
