import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

export interface NotificationFilters {
  type: 'all' | 'info' | 'success' | 'warning' | 'error';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: 'all' | string;
  read: 'all' | 'read' | 'unread';
  dateRange?: { start: Date; end: Date };
}

@Component({
  selector: 'opena3xx-notification-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './notification-filters.component.html',
  styleUrls: ['./notification-filters.component.scss']
})
export class NotificationFiltersComponent {
  @Input() filters: NotificationFilters = {
    type: 'all',
    priority: 'all',
    category: 'all',
    read: 'all'
  };
  @Input() categories: string[] = [];
  @Input() showAdvanced = false;
  @Output() filtersChange = new EventEmitter<NotificationFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  // Computed properties
  hasActiveFilters = computed(() => {
    return this.filters.type !== 'all' ||
           this.filters.priority !== 'all' ||
           this.filters.category !== 'all' ||
           this.filters.read !== 'all' ||
           !!this.filters.dateRange;
  });

  filterClass = computed(() => {
    const classes = ['opena3xx-notification-filters'];
    if (this.hasActiveFilters()) classes.push('opena3xx-notification-filters--active');
    return classes.join(' ');
  });

  onTypeChange(type: string): void {
    this.filters = { ...this.filters, type: type as any };
    this.filtersChange.emit(this.filters);
  }

  onPriorityChange(priority: string): void {
    this.filters = { ...this.filters, priority: priority as any };
    this.filtersChange.emit(this.filters);
  }

  onCategoryChange(category: string): void {
    this.filters = { ...this.filters, category };
    this.filtersChange.emit(this.filters);
  }

  onReadStatusChange(read: string): void {
    this.filters = { ...this.filters, read: read as any };
    this.filtersChange.emit(this.filters);
  }

  onDateRangeChange(dateRange: { start: Date; end: Date }): void {
    this.filters = { ...this.filters, dateRange };
    this.filtersChange.emit(this.filters);
  }

  onClearFilters(): void {
    this.filters = {
      type: 'all',
      priority: 'all',
      category: 'all',
      read: 'all'
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

  get typeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'info', label: 'Info' },
      { value: 'success', label: 'Success' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' }
    ];
  }

  get priorityOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Priorities' },
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' }
    ];
  }

  get readOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All' },
      { value: 'read', label: 'Read' },
      { value: 'unread', label: 'Unread' }
    ];
  }

  get categoryOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Categories' },
      ...this.categories.map(cat => ({ value: cat, label: cat }))
    ];
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.type !== 'all') count++;
    if (this.filters.priority !== 'all') count++;
    if (this.filters.category !== 'all') count++;
    if (this.filters.read !== 'all') count++;
    if (this.filters.dateRange) count++;
    return count;
  }
}
