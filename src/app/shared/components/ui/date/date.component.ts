
import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'opena3xx-date',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ],
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() min?: Date;
  @Input() max?: Date;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<Date>();
  @Output() dateChange = new EventEmitter<Date>();

  // Internal value
  private _value = signal<Date | null>(null);
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  dateClass = computed(() => {
    const classes = ['opena3xx-date'];
    if (this.hasError()) classes.push('opena3xx-date--error');
    if (this.disabled) classes.push('opena3xx-date--disabled');
    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  onChange = (value: Date | null) => {};
  onTouched = () => {};

  writeValue(value: Date | null): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onDateChange(event: any): void {
    const value = event.value;
    this._value.set(value);
    this.onChange(value);
    if (value) {
      this.valueChange.emit(value);
      this.dateChange.emit(value);
    }
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  // Getters for template
  get value(): Date | null {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get dateClasses(): string {
    return this.dateClass();
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

  get hasMinDate(): boolean {
    return !!this.min;
  }

  get hasMaxDate(): boolean {
    return !!this.max;
  }
}
