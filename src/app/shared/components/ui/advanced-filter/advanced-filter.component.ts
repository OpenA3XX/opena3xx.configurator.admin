import { Component, Input, Output, EventEmitter, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'dateRange' | 'checkbox' | 'toggle' | 'number' | 'numberRange';
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  clearable?: boolean;
  searchable?: boolean;
}

export interface FilterConfig {
  title?: string;
  fields: FilterField[];
  showAdvanced?: boolean;
  showClearAll?: boolean;
  showApply?: boolean;
  showReset?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
  maxVisibleFields?: number;
}

export interface FilterData {
  [key: string]: any;
}

@Component({
  selector: 'opena3xx-advanced-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="advanced-filter-container">
      <!-- Filter Header -->
      <div class="filter-header" *ngIf="config.title">
        <h3>{{ config.title }}</h3>
        <div class="filter-actions">
          <button mat-icon-button
                  *ngIf="config.showClearAll && hasActiveFilters()"
                  (click)="clearAllFilters()"
                  matTooltip="Clear all filters">
            <mat-icon>clear_all</mat-icon>
          </button>
          <button mat-icon-button
                  (click)="toggleAdvanced()"
                  [class.expanded]="showAdvanced()"
                  matTooltip="Toggle advanced filters">
            <mat-icon>{{ showAdvanced() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div class="active-filters" *ngIf="hasActiveFilters()">
        <mat-chip-set>
          <mat-chip *ngFor="let filter of getActiveFilters()"
                    (removed)="removeFilter(filter.key)"
                    removable>
            {{ filter.label }}: {{ filter.value }}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
        </mat-chip-set>
      </div>

      <!-- Filter Form -->
      <form [formGroup]="filterForm" class="filter-form" [class]="'layout-' + (config.layout || 'vertical')">
        <div class="filter-fields">
          <!-- Visible Fields -->
          <div *ngFor="let field of getVisibleFields(); trackBy: trackByField"
               class="filter-field"
               [class]="'field-type-' + field.type">

            <!-- Text Input -->
            <mat-form-field *ngIf="field.type === 'text'" appearance="outline">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     [formControlName]="field.key"
                     [placeholder]="field.placeholder || 'Enter ' + field.label.toLowerCase()">
              <mat-icon matSuffix *ngIf="getFieldValue(field.key)">search</mat-icon>
            </mat-form-field>

            <!-- Number Input -->
            <mat-form-field *ngIf="field.type === 'number'" appearance="outline">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     type="number"
                     [formControlName]="field.key"
                     [placeholder]="field.placeholder || 'Enter ' + field.label.toLowerCase()"
                     [min]="field.min"
                     [max]="field.max"
                     [step]="field.step">
            </mat-form-field>

            <!-- Select -->
            <mat-form-field *ngIf="field.type === 'select'" appearance="outline">
              <mat-label>{{ field.label }}</mat-label>
              <mat-select [formControlName]="field.key"
                         [placeholder]="field.placeholder || 'Select ' + field.label.toLowerCase()">
                <mat-option *ngIf="field.clearable" value="">None</mat-option>
                <mat-option *ngFor="let option of field.options"
                           [value]="option.value"
                           [disabled]="option.disabled">
                  {{ option.label }}
                  <span *ngIf="option.count" class="option-count">({{ option.count }})</span>
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Multi-Select -->
            <mat-form-field *ngIf="field.type === 'multiselect'" appearance="outline">
              <mat-label>{{ field.label }}</mat-label>
              <mat-select [formControlName]="field.key"
                         multiple
                         [placeholder]="field.placeholder || 'Select ' + field.label.toLowerCase()">
                <mat-option *ngFor="let option of field.options"
                           [value]="option.value"
                           [disabled]="option.disabled">
                  {{ option.label }}
                  <span *ngIf="option.count" class="option-count">({{ option.count }})</span>
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Date Picker -->
            <mat-form-field *ngIf="field.type === 'date'" appearance="outline">
              <mat-label>{{ field.label }}</mat-label>
              <input matInput
                     [matDatepicker]="datepicker"
                     [formControlName]="field.key"
                     [placeholder]="field.placeholder || 'Select date'">
              <mat-datepicker-toggle matSuffix [for]="datepicker"></mat-datepicker-toggle>
              <mat-datepicker #datepicker></mat-datepicker>
            </mat-form-field>

            <!-- Date Range -->
            <div *ngIf="field.type === 'dateRange'" class="date-range-container">
              <mat-form-field appearance="outline">
                <mat-label>{{ field.label }} - From</mat-label>
                <input matInput
                       [matDatepicker]="startDatepicker"
                       [formControlName]="field.key + '_start'"
                       placeholder="Start date">
                <mat-datepicker-toggle matSuffix [for]="startDatepicker"></mat-datepicker-toggle>
                <mat-datepicker #startDatepicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ field.label }} - To</mat-label>
                <input matInput
                       [matDatepicker]="endDatepicker"
                       [formControlName]="field.key + '_end'"
                       placeholder="End date">
                <mat-datepicker-toggle matSuffix [for]="endDatepicker"></mat-datepicker-toggle>
                <mat-datepicker #endDatepicker></mat-datepicker>
              </mat-form-field>
            </div>

            <!-- Number Range -->
            <div *ngIf="field.type === 'numberRange'" class="number-range-container">
              <mat-form-field appearance="outline">
                <mat-label>{{ field.label }} - From</mat-label>
                <input matInput
                       type="number"
                       [formControlName]="field.key + '_min'"
                       [placeholder]="'Min ' + field.label.toLowerCase()"
                       [min]="field.min"
                       [max]="field.max"
                       [step]="field.step">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>{{ field.label }} - To</mat-label>
                <input matInput
                       type="number"
                       [formControlName]="field.key + '_max'"
                       [placeholder]="'Max ' + field.label.toLowerCase()"
                       [min]="field.min"
                       [max]="field.max"
                       [step]="field.step">
              </mat-form-field>
            </div>

            <!-- Checkbox -->
            <mat-checkbox *ngIf="field.type === 'checkbox'"
                         [formControlName]="field.key">
              {{ field.label }}
            </mat-checkbox>

            <!-- Toggle -->
            <mat-slide-toggle *ngIf="field.type === 'toggle'"
                             [formControlName]="field.key">
              {{ field.label }}
            </mat-slide-toggle>
          </div>
        </div>

        <!-- Advanced Fields (Collapsible) -->
        <mat-expansion-panel *ngIf="config.showAdvanced && getAdvancedFields().length > 0"
                            [expanded]="showAdvanced()"
                            class="advanced-filters">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>tune</mat-icon>
              Advanced Filters
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="advanced-filter-fields">
            <div *ngFor="let field of getAdvancedFields(); trackBy: trackByField"
                 class="filter-field"
                 [class]="'field-type-' + field.type">

              <!-- Same field types as above, but for advanced fields -->
              <mat-form-field *ngIf="field.type === 'text'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <input matInput
                       [formControlName]="field.key"
                       [placeholder]="field.placeholder || 'Enter ' + field.label.toLowerCase()">
              </mat-form-field>

              <mat-form-field *ngIf="field.type === 'select'" appearance="outline">
                <mat-label>{{ field.label }}</mat-label>
                <mat-select [formControlName]="field.key"
                           [placeholder]="field.placeholder || 'Select ' + field.label.toLowerCase()">
                  <mat-option *ngIf="field.clearable" value="">None</mat-option>
                  <mat-option *ngFor="let option of field.options"
                             [value]="option.value"
                             [disabled]="option.disabled">
                    {{ option.label }}
                    <span *ngIf="option.count" class="option-count">({{ option.count }})</span>
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Add other field types as needed -->
            </div>
          </div>
        </mat-expansion-panel>

        <!-- Filter Actions -->
        <div class="filter-actions" *ngIf="config.showApply || config.showReset">
          <button mat-button
                  *ngIf="config.showReset"
                  (click)="resetFilters()"
                  class="reset-button">
            <mat-icon>refresh</mat-icon>
            Reset
          </button>

          <button mat-raised-button
                  color="primary"
                  *ngIf="config.showApply"
                  (click)="applyFilters()"
                  [disabled]="!hasActiveFilters()"
                  class="apply-button">
            <mat-icon>filter_list</mat-icon>
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent implements OnInit {
  @Input() config!: FilterConfig;
  @Input() initialData?: FilterData;
  @Output() filterChange = new EventEmitter<FilterData>();
  @Output() filterApply = new EventEmitter<FilterData>();
  @Output() filterReset = new EventEmitter<void>();

  // Signals for reactive state
  showAdvanced = signal(false);
  activeFilters = signal<FilterData>({});

  // Form
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.setupFormListeners();
  }

  private createForm(): void {
    const group: { [key: string]: any } = {};

    this.config.fields.forEach(field => {
      switch (field.type) {
        case 'dateRange':
          group[field.key + '_start'] = [''];
          group[field.key + '_end'] = [''];
          break;
        case 'numberRange':
          group[field.key + '_min'] = [''];
          group[field.key + '_max'] = [''];
          break;
        default:
          group[field.key] = [''];
      }
    });

    this.filterForm = this.fb.group(group);

    if (this.initialData) {
      this.filterForm.patchValue(this.initialData);
    }
  }

  private setupFormListeners(): void {
    this.filterForm.valueChanges.subscribe(value => {
      this.activeFilters.set(this.processFormValue(value));
      this.filterChange.emit(this.activeFilters());
    });
  }

  private processFormValue(value: any): FilterData {
    const processed: FilterData = {};

    this.config.fields.forEach(field => {
      switch (field.type) {
        case 'dateRange':
          if (value[field.key + '_start'] || value[field.key + '_end']) {
            processed[field.key] = {
              start: value[field.key + '_start'],
              end: value[field.key + '_end']
            };
          }
          break;
        case 'numberRange':
          if (value[field.key + '_min'] || value[field.key + '_max']) {
            processed[field.key] = {
              min: value[field.key + '_min'],
              max: value[field.key + '_max']
            };
          }
          break;
        default:
          if (value[field.key]) {
            processed[field.key] = value[field.key];
          }
      }
    });

    return processed;
  }

  getVisibleFields(): FilterField[] {
    const maxFields = this.config.maxVisibleFields || this.config.fields.length;
    return this.config.fields.slice(0, maxFields);
  }

  getAdvancedFields(): FilterField[] {
    const maxFields = this.config.maxVisibleFields || this.config.fields.length;
    return this.config.fields.slice(maxFields);
  }

  getActiveFilters(): Array<{key: string, label: string, value: string}> {
    const active: Array<{key: string, label: string, value: string}> = [];
    const filters = this.activeFilters();

    Object.keys(filters).forEach(key => {
      const field = this.config.fields.find(f => f.key === key);
      if (field && filters[key]) {
        let value = filters[key];
        if (typeof value === 'object') {
          if (field.type === 'dateRange') {
            value = `${value.start || ''} to ${value.end || ''}`;
          } else if (field.type === 'numberRange') {
            value = `${value.min || ''} to ${value.max || ''}`;
          }
        }
        active.push({ key, label: field.label, value: String(value) });
      }
    });

    return active;
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters()).length > 0;
  }

  getFieldValue(key: string): any {
    return this.filterForm.get(key)?.value;
  }

  toggleAdvanced(): void {
    this.showAdvanced.set(!this.showAdvanced());
  }

  clearAllFilters(): void {
    this.filterForm.reset();
    this.activeFilters.set({});
  }

  removeFilter(key: string): void {
    this.filterForm.get(key)?.reset();
  }

  resetFilters(): void {
    this.clearAllFilters();
    this.filterReset.emit();
  }

  applyFilters(): void {
    this.filterApply.emit(this.activeFilters());
  }

  trackByField(index: number, field: FilterField): string {
    return field.key;
  }
}
