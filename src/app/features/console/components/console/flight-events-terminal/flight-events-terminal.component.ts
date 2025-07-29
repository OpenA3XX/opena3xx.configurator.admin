import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PageLayoutComponent, ActionButton } from '../../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface FlightEvent {
  id: string;
  timestamp: Date;
  type: 'takeoff' | 'landing' | 'altitude' | 'speed' | 'heading' | 'fuel' | 'warning' | 'error';
  severity: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  data?: any;
  coordinates?: { lat: number; lng: number };
  altitude?: number;
  speed?: number;
  heading?: number;
}

@Component({
  selector: 'opena3xx-flight-events-terminal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './flight-events-terminal.component.html',
  styleUrls: ['./flight-events-terminal.component.scss']
})
export class FlightEventsTerminalComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  events = signal<FlightEvent[]>([]);
  autoScroll = signal(true);
  showDetails = signal(false);
  maxEvents = signal(500);
  selectedEventType = signal('all');

  // Computed properties
  filteredEvents = computed(() => {
    let events = this.events();

    if (this.selectedEventType() !== 'all') {
      events = events.filter(event => event.type === this.selectedEventType());
    }

    if (events.length > this.maxEvents()) {
      events = events.slice(-this.maxEvents());
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  isEmpty = computed(() => this.filteredEvents().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Clear',
      icon: 'clear',
      action: 'clear',
      color: 'warn'
    },
    {
      label: 'Export',
      icon: 'download',
      action: 'export',
      color: 'accent'
    },
    {
      label: 'Settings',
      icon: 'settings',
      action: 'settings',
      color: 'primary'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadFlightEvents();
  }

  async loadFlightEvents(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const events: FlightEvent[] = [
        {
          id: '1',
          timestamp: new Date(),
          type: 'takeoff',
          severity: 'info',
          source: 'flight-system',
          message: 'Aircraft takeoff initiated',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          altitude: 0,
          speed: 0,
          heading: 270
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 30000),
          type: 'altitude',
          severity: 'info',
          source: 'altitude-sensor',
          message: 'Altitude: 10,000 feet',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          altitude: 10000,
          speed: 450,
          heading: 270
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 60000),
          type: 'speed',
          severity: 'warning',
          source: 'speed-sensor',
          message: 'Speed approaching limit',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          altitude: 8000,
          speed: 480,
          heading: 270
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 90000),
          type: 'fuel',
          severity: 'info',
          source: 'fuel-system',
          message: 'Fuel level: 75%',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          altitude: 12000,
          speed: 420,
          heading: 270
        }
      ];

      this.events.set(events);
    } catch (err) {
      console.error('Error loading flight events:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onEventTypeChange(eventType: string): void {
    this.selectedEventType.set(eventType);
  }

  clearEvents(): void {
    console.log('Clearing flight events...');
    this.events.set([]);
  }

  exportEvents(): void {
    console.log('Exporting flight events...');
    // Implement export functionality
  }

  openSettings(): void {
    console.log('Opening flight events settings...');
    // Open settings dialog
  }

  toggleAutoScroll(): void {
    this.autoScroll.update(scroll => !scroll);
  }

  toggleDetails(): void {
    this.showDetails.update(show => !show);
  }

  onEventClick(event: FlightEvent): void {
    console.log('Flight event clicked:', event.id);
    // Open event details dialog
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'clear':
        this.clearEvents();
        break;
      case 'export':
        this.exportEvents();
        break;
      case 'settings':
        this.openSettings();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get eventList(): FlightEvent[] {
    return this.filteredEvents();
  }

  get pageActionButtons(): ActionButton[] {
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

  get autoScrollEnabled(): boolean {
    return this.autoScroll();
  }

  get showEventDetails(): boolean {
    return this.showDetails();
  }

  get selectedEventTypeValue(): string {
    return this.selectedEventType();
  }

  get eventTypeIcon(): (type: string) => string {
    return (type: string) => {
      switch (type) {
        case 'takeoff': return 'flight_takeoff';
        case 'landing': return 'flight_land';
        case 'altitude': return 'height';
        case 'speed': return 'speed';
        case 'heading': return 'compass_calibration';
        case 'fuel': return 'local_gas_station';
        case 'warning': return 'warning';
        case 'error': return 'error';
        default: return 'flight';
      }
    };
  }

  get severityIcon(): (severity: string) => string {
    return (severity: string) => {
      switch (severity) {
        case 'info': return 'info';
        case 'warning': return 'warning';
        case 'error': return 'error';
        case 'critical': return 'error_outline';
        default: return 'help';
      }
    };
  }

  get severityColor(): (severity: string) => string {
    return (severity: string) => {
      switch (severity) {
        case 'info': return 'primary';
        case 'warning': return 'accent';
        case 'error': return 'warn';
        case 'critical': return 'warn';
        default: return 'default';
      }
    };
  }

  get formatTimestamp(): (date: Date) => string {
    return (date: Date) => {
      return date.toLocaleTimeString();
    };
  }

  get eventTypeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Events' },
      { value: 'takeoff', label: 'Takeoff' },
      { value: 'landing', label: 'Landing' },
      { value: 'altitude', label: 'Altitude' },
      { value: 'speed', label: 'Speed' },
      { value: 'heading', label: 'Heading' },
      { value: 'fuel', label: 'Fuel' },
      { value: 'warning', label: 'Warnings' },
      { value: 'error', label: 'Errors' }
    ];
  }
}
