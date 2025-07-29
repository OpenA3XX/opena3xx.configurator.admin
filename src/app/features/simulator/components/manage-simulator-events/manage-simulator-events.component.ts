import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulatorEventItemDto } from '../../../../shared/models/models';
import { SimulatorEventService } from '../../services/simulator-event.service';

// Define SimulatorEvent interface locally since it's not exported
export interface SimulatorEvent {
  id: string;
  name: string;
  description: string;
  type: 'custom' | 'builtin';
  status: 'active' | 'inactive';
  frequency: number;
  eventCode: string;
}

@Component({
  selector: 'opena3xx-manage-simulator-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule
  ],
  templateUrl: './manage-simulator-events.component.html',
  styleUrls: ['./manage-simulator-events.component.scss']
})
export class ManageSimulatorEventsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  events = signal<SimulatorEvent[]>([]);
  dataSource = signal<SimulatorEvent[]>([]);
  data_loaded = signal(false);

  // Filters
  filters = signal({
    search: '',
    status: 'all',
    type: 'all'
  });

  // Computed properties
  filteredEvents = computed(() => {
    const events = this.events();
    const filters = this.filters();

    return events.filter(event => {
      const matchesSearch = !filters.search ||
        event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || event.status === filters.status;
      const matchesType = filters.type === 'all' || event.type === filters.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  });

  isEmpty = computed(() => !this.events().length && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<any[]>([
    {
      label: 'Add Event',
      icon: 'add',
      action: 'add-event',
      color: 'primary'
    },
    {
      label: 'Bulk Actions',
      icon: 'more_vert',
      action: 'bulk-actions',
      color: 'accent'
    }
  ]);

  // Table columns
  displayedColumns = signal(['select', 'name', 'type', 'status', 'frequency', 'lastTriggered', 'actions']);

  // Data source for the table
  // dataSource = signal<SimulatorEvent[]>([]);
  // data_loaded = signal(false);

  constructor(private simulatorEventService: SimulatorEventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      const events = await this.simulatorEventService.getEvents().toPromise();
      const mappedEvents: SimulatorEvent[] = (events || []).map(dto => ({
        id: dto.id.toString(),
        name: dto.friendlyName,
        description: dto.eventName,
        type: 'custom' as const,
        status: 'active' as const,
        frequency: 0,
        eventCode: dto.eventCode
      }));
      this.events.set(mappedEvents);
      this.dataSource.set(mappedEvents);
      this.data_loaded.set(true);
    } catch (err) {
      console.error('Error loading simulator events:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: any): void {
    this.filters.set(filters);
    this.applyFilter();
  }

  onSelectionChange(selectedIds: string[]): void {
    // this.selectedEvents.set(selectedIds); // This signal is removed
  }

  addEvent(): void {
    // Open add event dialog
    console.log('Opening add event dialog...');
  }

  editEvent(event: SimulatorEvent): void {
    // Open edit event dialog
    console.log('Opening edit event dialog for:', event.id);
  }

  deleteEvent(event: SimulatorEvent): void {
    // Open delete confirmation dialog
    console.log('Opening delete confirmation for:', event.id);
  }

  toggleEventStatus(event: SimulatorEvent): void {
    const newStatus = event.status === 'active' ? 'inactive' : 'active';
    this.simulatorEventService.updateEventStatus(event.id, newStatus);
    this.events.update(events =>
      events.map(e => e.id === event.id ? { ...e, status: newStatus } : e)
    );
    this.applyFilter(); // Re-apply filters to update table
  }

  showBulkActions(): void {
    // Show bulk actions menu
    console.log('Showing bulk actions for:', this.events().length, 'events');
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add-event':
        this.addEvent();
        break;
      case 'bulk-actions':
        this.showBulkActions();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Apply filters to the data source
  applyFilter(event?: any): void {
    const filterValue = event?.target?.value?.toLowerCase() || this.filters().search.toLowerCase();
    this.dataSource.set(this.events().filter(event =>
      event.name.toLowerCase().includes(filterValue) ||
      event.description.toLowerCase().includes(filterValue)
    ));
  }

  // Getters for template
  get eventList(): SimulatorEvent[] {
    return this.filteredEvents();
  }

  get pageActionButtons(): any[] { // Changed from ActionButton[] to any[]
    return this.pageActions();
  }

  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return this.error();
  }

  get isEmptyState(): boolean {
    return this.isEmpty();
  }

  get selectedEventCount(): number {
    return this.events().length; // This signal is removed
  }

  get hasSelectedEvents(): boolean {
    return this.events().length > 0; // This signal is removed
  }

  get dataSourceData(): SimulatorEvent[] {
    return this.dataSource();
  }

  get typeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'flight', label: 'Flight' },
      { value: 'system', label: 'System' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'custom', label: 'Custom' }
    ];
  }

  get statusOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'error', label: 'Error' }
    ];
  }
}
