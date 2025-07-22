import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig, OptionList } from 'src/app/shared/models/field.interface';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

//  <mat-autocomplete
//         [disabled]="field.disabled"
//         [placeholder]="field.label"
//         [formControlName]="field.name"
//       >
//         <mat-option *ngFor="let item of field.options" [value]="item.key">{{
//           item.value
//         }}</mat-option>
//       </mat-autocomplete>
// <ng-container *ngFor="let validation of field.validations" ngProjectAs="mat-error">
//         <mat-error *ngIf="group.get(field.name).hasError(validation.name)">{{
//           validation.message
//         }}</mat-error>
//       </ng-container>
@Component({
  selector: 'opena3xx-forms-autocomplete',
  template: `
    <mat-form-field class="full-width margin-top" [formGroup]="group">
      <input
        [name]="field.name"
        type="text"
        [placeholder]="field.label"
        matInput
        [formControl]="myControl"
        [formControlName]="field.name"
        [matAutocomplete]="auto"
      />
      <mat-autocomplete #auto="matAutocomplete">
        <mat-option *ngFor="let option of filteredOptions | async" [value]="option.value">
          {{ option.value }}
        </mat-option>
      </mat-autocomplete>

      <mat-hint>{{ field.hint }}</mat-hint>
    </mat-form-field>
  `,
  styles: [],
})
export class AutocompleteComponent implements OnInit {
  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;

  @Output() AutoCompleteValue: EventEmitter<string> = new EventEmitter<string>();

  myControl = new FormControl();

  filteredOptions: Observable<OptionList[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.group.addControl(this.field.name, this.myControl);
  }

  private _filter(value: string): OptionList[] {
    console.log('_filter', value);
    this.AutoCompleteValue.emit(value);
    const filterValue = value.toLowerCase();
    return this.field.options.filter((option) => option.value.toLowerCase().includes(filterValue));
  }
}
