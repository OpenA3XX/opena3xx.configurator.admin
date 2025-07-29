import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'opena3xx-slider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() hint = '';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() required = false;
  @Input() disabled = false;
  @Input() showInput = false;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Output() valueChange = new EventEmitter<number>();
  @Output() change = new EventEmitter<number>();

  // Internal value
  private _value = signal(0);
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  sliderClass = computed(() => {
    const classes = ['opena3xx-slider'];
    if (this.hasError()) classes.push('opena3xx-slider--error');
    if (this.disabled) classes.push('opena3xx-slider--disabled');
    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this._value.set(value || 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Event handlers
  onSliderChange(event: any): void {
    const value = event.value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.change.emit(value);
  }

  onInputChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value)) {
      this._value.set(value);
      this.onChange(value);
      this.valueChange.emit(value);
      this.change.emit(value);
    }
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  // Getters for template
  get value(): number {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get sliderClasses(): string {
    return this.sliderClass();
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

  get showInputField(): boolean {
    return this.showInput;
  }
}
