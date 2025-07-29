import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

export interface ConsoleFilters {
  eventType: 'all' | 'flight' | 'system' | 'hardware' | 'error';
  severity: 'all' | 'info' | 'warning' | 'error' | 'critical';
  source: 'all' | string;
  dateRange?: { start: Date; end: Date };
  search: string;
  showErrors: boolean;
  showWarnings: boolean;
  showInfo: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

@Component({
  selector: 'opena3xx-console-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './console-filters.component.html',
  styleUrls: ['./console-filters.component.scss']
})
export class ConsoleFiltersComponent {
  @Input() filters: ConsoleFilters = {
    eventType: 'all',
    severity: 'all',
    source: 'all',
    search: '',
    showErrors: true,
    showWarnings: true,
    showInfo: true,
    autoRefresh: true,
    refreshInterval: 5000
  };
  @Input() sources: string[] = [];
  @Input() showAdvanced = false;
  @Output() filtersChange = new EventEmitter<ConsoleFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  // Computed properties
  hasActiveFilters = computed(() => {
    return this.filters.eventType !== 'all' ||
           this.filters.severity !== 'all' ||
           this.filters.source !== 'all' ||
           this.filters.search !== '' ||
           this.filters.dateRange ||
           !this.filters.showErrors ||
           !this.filters.showWarnings ||
           !this.filters.showInfo;
  });

  filterClass = computed(() => {
    const classes = ['opena3xx-console-filters'];
    if (this.hasActiveFilters()) classes.push('opena3xx-console-filters--active');
    return classes.join(' ');
  });

  onEventTypeChange(eventType: string): void {
    this.filters = { ...this.filters, eventType: eventType as any };
    this.filtersChange.emit(this.filters);
  }

  onSeverityChange(severity: string): void {
    this.filters = { ...this.filters, severity: severity as any };
    this.filtersChange.emit(this.filters);
  }

  onSourceChange(source: string): void {
    this.filters = { ...this.filters, source };
    this.filtersChange.emit(this.filters);
  }

  onSearchChange(search: string): void {
    this.filters = { ...this.filters, search };
    this.filtersChange.emit(this.filters);
  }

  onDateRangeChange(dateRange: { start: Date; end: Date }): void {
    this.filters = { ...this.filters, dateRange };
    this.filtersChange.emit(this.filters);
  }

  onShowErrorsChange(showErrors: boolean): void {
    this.filters = { ...this.filters, showErrors };
    this.filtersChange.emit(this.filters);
  }

  onShowWarningsChange(showWarnings: boolean): void {
    this.filters = { ...this.filters, showWarnings };
    this.filtersChange.emit(this.filters);
  }

  onShowInfoChange(showInfo: boolean): void {
    this.filters = { ...this.filters, showInfo };
    this.filtersChange.emit(this.filters);
  }

  onAutoRefreshChange(autoRefresh: boolean): void {
    this.filters = { ...this.filters, autoRefresh };
    this.filtersChange.emit(this.filters);
  }

  onRefreshIntervalChange(refreshInterval: number): void {
    this.filters = { ...this.filters, refreshInterval };
    this.filtersChange.emit(this.filters);
  }

  onClearFilters(): void {
    this.filters = {
      eventType: 'all',
      severity: 'all',
      source: 'all',
      search: '',
      showErrors: true,
      showWarnings: true,
      showInfo: true,
      autoRefresh: true,
      refreshInterval: 5000
    };
    this.clearFilters.emit();
  }

  // Getters for template
  get filterClasses(): string {
    return this.filterClass();
  }

  get hasActiveFilterState(): boolean {
    return this.hasActiveFilters();
  }

  get eventTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Events' },
      { value: 'flight', label: 'Flight Events' },
      { value: 'system', label: 'System Events' },
      { value: 'hardware', label: 'Hardware Events' },
      { value: 'error', label: 'Error Events' }
    ];
  }

  get severityOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Severities' },
      { value: 'info', label: 'Info' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
      { value: 'critical', label: 'Critical' }
    ];
  }

  get sourceOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Sources' },
      ...this.sources.map(source => ({ value: source, label: source }))
    ];
  }

  get refreshIntervalOptions(): { value: number; label: string }[] {
    return [
      { value: 1000, label: '1 second' },
      { value: 5000, label: '5 seconds' },
      { value: 10000, label: '10 seconds' },
      { value: 30000, label: '30 seconds' },
      { value: 60000, label: '1 minute' }
    ];
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.eventType !== 'all') count++;
    if (this.filters.severity !== 'all') count++;
    if (this.filters.source !== 'all') count++;
    if (this.filters.search) count++;
    if (this.filters.dateRange) count++;
    if (!this.filters.showErrors) count++;
    if (!this.filters.showWarnings) count++;
    if (!this.filters.showInfo) count++;
    return count;
  }
}
