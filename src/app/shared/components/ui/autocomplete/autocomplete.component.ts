import { Component, Input, Output, EventEmitter, signal, computed, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface AutocompleteOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'opena3xx-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() options: AutocompleteOption[] = [];
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() showError = false;
  @Input() icon = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<AutocompleteOption>();

  // Internal value
  private _value = signal('');
  private _touched = signal(false);

  // Computed properties
  hasError = computed(() => this.showError && !!this.errorMessage);
  autocompleteClass = computed(() => {
    const classes = ['opena3xx-autocomplete'];
    if (this.hasError()) classes.push('opena3xx-autocomplete--error');
    if (this.disabled) classes.push('opena3xx-autocomplete--disabled');
    return classes.join(' ');
  });

  // Filtered options
  filteredOptions: Observable<AutocompleteOption[]> = of([]);

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
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this._value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.updateFilteredOptions(value);
  }

  onOptionSelected(option: AutocompleteOption): void {
    this._value.set(option.label);
    this.onChange(option.value.toString());
    this.valueChange.emit(option.value.toString());
    this.selectionChange.emit(option);
  }

  onBlur(): void {
    this._touched.set(true);
    this.onTouched();
  }

  private updateFilteredOptions(value: string): void {
    this.filteredOptions = of(this.options).pipe(
      map(options => this.filterOptions(options, value))
    );
  }

  private filterOptions(options: AutocompleteOption[], value: string): AutocompleteOption[] {
    const filterValue = value.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(filterValue) && !option.disabled
    );
  }

  // Getters for template
  get value(): string {
    return this._value();
  }

  get isTouched(): boolean {
    return this._touched();
  }

  get autocompleteClasses(): string {
    return this.autocompleteClass();
  }

  get showErrorMessage(): boolean {
    return this.hasError();
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  get hasOptions(): boolean {
    return this.options.length > 0;
  }
}
