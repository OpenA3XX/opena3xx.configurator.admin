import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationFilters } from '../../services/notification.service';

@Component({
    selector: 'app-notification-filters',
    templateUrl: './notification-filters.component.html',
    styleUrls: ['./notification-filters.component.scss'],
    standalone: false
})
export class NotificationFiltersComponent implements OnInit, OnDestroy {
  filtersForm: FormGroup;
  expanded = false;

  severityOptions = [
    { value: 'error', label: 'Error', icon: 'error', color: 'error' },
    { value: 'warning', label: 'Warning', icon: 'warning', color: 'warning' },
    { value: 'success', label: 'Success', icon: 'check_circle', color: 'success' },
    { value: 'info', label: 'Info', icon: 'info', color: 'primary' }
  ];

  serviceOptions = [
    { value: 'MSFS 2020/2024', label: 'MSFS 2020/2024', icon: 'flight' },
    { value: 'RabbitMQ', label: 'RabbitMQ', icon: 'compare_arrows' },
    { value: 'SEQ', label: 'SEQ', icon: 'list_alt' },
    { value: 'OpenA3XX Coordinator', label: 'OpenA3XX Coordinator', icon: 'hub' }
  ];

  statusOptions = [
    { value: false, label: 'Unread', icon: 'fiber_manual_record' },
    { value: true, label: 'Read', icon: 'done' }
  ];

  @Output() filtersChanged = new EventEmitter<NotificationFilters>();
  @Output() filtersCleared = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder) {
    // Get all service values for default selection
    const allServiceValues = this.serviceOptions.map(option => option.value);

    this.filtersForm = this.fb.group({
      severity: [[]],
      service: [allServiceValues], // Default to all services selected
      isRead: [null],
      startDate: [null],
      endDate: [null]
    });

    // Ensure form is properly initialized
    setTimeout(() => {
      if (this.filtersForm) {
        this.filtersForm.updateValueAndValidity();
      }
    }, 50);
  }

  ngOnInit(): void {
    // Ensure form controls are properly initialized with a longer delay
    setTimeout(() => {
      this.setupFormSubscriptions();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions(): void {
    if (this.filtersForm) {
      this.filtersForm.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(filters => {
          this.emitFilters(filters);
        });
    }
  }

  private emitFilters(filters: any): void {
    if (!filters) return;

    const cleanFilters: NotificationFilters = {};

    if (filters.severity && filters.severity.length > 0) {
      cleanFilters.severity = filters.severity;
    }

    if (filters.service && filters.service.length > 0) {
      cleanFilters.service = filters.service;
    }

    if (filters.isRead !== null && filters.isRead !== undefined) {
      cleanFilters.isRead = filters.isRead;
    }

    if (filters.startDate && filters.endDate) {
      cleanFilters.dateRange = {
        start: new Date(filters.startDate),
        end: new Date(filters.endDate)
      };
    }

    this.filtersChanged.emit(cleanFilters);
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  clearFilters(): void {
    if (this.filtersForm) {
      this.filtersForm.reset({
        severity: [],
        service: [],
        isRead: null,
        startDate: null,
        endDate: null
      });
    }
    this.filtersCleared.emit();
  }

  getActiveFiltersCount(): number {
    if (!this.filtersForm) return 0;

    const formValue = this.filtersForm.value;
    let count = 0;

    if (formValue.severity && formValue.severity.length > 0) count++;
    if (formValue.service && formValue.service.length > 0) count++;
    if (formValue.isRead !== null && formValue.isRead !== undefined) count++;
    if (formValue.startDate && formValue.endDate && formValue.startDate !== '' && formValue.endDate !== '') count++;

    return count;
  }

  getSeverityIcon(severity: string): string {
    const option = this.severityOptions.find(opt => opt.value === severity);
    return option ? option.icon : 'help';
  }

  getSeverityColor(severity: string): string {
    const option = this.severityOptions.find(opt => opt.value === severity);
    return option ? option.color : 'primary';
  }

  getServiceIcon(service: string): string {
    const option = this.serviceOptions.find(opt => opt.value === service);
    return option ? option.icon : 'settings';
  }

  getStatusIcon(status: boolean): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.icon : 'help';
  }

  selectAllServices(): void {
    const allServiceValues = this.serviceOptions.map(option => option.value);
    this.filtersForm.patchValue({ service: allServiceValues });
  }

}
