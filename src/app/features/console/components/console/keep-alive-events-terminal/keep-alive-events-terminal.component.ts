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

export interface KeepAliveEvent {
  id: string;
  timestamp: Date;
  source: string;
  type: 'ping' | 'pong' | 'heartbeat' | 'timeout';
  status: 'success' | 'warning' | 'error';
  latency?: number;
  message: string;
  details?: any;
}

@Component({
  selector: 'opena3xx-keep-alive-events-terminal',
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
  templateUrl: './keep-alive-events-terminal.component.html',
  styleUrls: ['./keep-alive-events-terminal.component.scss']
})
export class KeepAliveEventsTerminalComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  events = signal<KeepAliveEvent[]>([]);
  autoScroll = signal(true);
  showTimestamps = signal(true);
  maxEvents = signal(1000);

  // Computed properties
  filteredEvents = computed(() => {
    let events = this.events();
    if (events.length > this.maxEvents()) {
      events = events.slice(-this.maxEvents());
    }
    return events;
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
    this.loadKeepAliveEvents();
  }

  async loadKeepAliveEvents(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const events: KeepAliveEvent[] = [
        {
          id: '1',
          timestamp: new Date(),
          source: 'hardware-panel-1',
          type: 'ping',
          status: 'success',
          latency: 15,
          message: 'Keep-alive ping sent successfully'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 5000),
          source: 'network-device-1',
          type: 'pong',
          status: 'success',
          latency: 25,
          message: 'Keep-alive pong received'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 10000),
          source: 'simulator-connection',
          type: 'heartbeat',
          status: 'warning',
          latency: 150,
          message: 'Heartbeat delayed'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 15000),
          source: 'hardware-panel-2',
          type: 'timeout',
          status: 'error',
          message: 'Keep-alive timeout'
        }
      ];

      this.events.set(events);
    } catch (err) {
      console.error('Error loading keep-alive events:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  clearEvents(): void {
    console.log('Clearing keep-alive events...');
    this.events.set([]);
  }

  exportEvents(): void {
    console.log('Exporting keep-alive events...');
    // Implement export functionality
  }

  openSettings(): void {
    console.log('Opening keep-alive settings...');
    // Open settings dialog
  }

  toggleAutoScroll(): void {
    this.autoScroll.update(scroll => !scroll);
  }

  toggleTimestamps(): void {
    this.showTimestamps.update(show => !show);
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
  get eventList(): KeepAliveEvent[] {
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

  get showEventTimestamps(): boolean {
    return this.showTimestamps();
  }

  get eventTypeIcon(): (type: string) => string {
    return (type: string) => {
      switch (type) {
        case 'ping': return 'send';
        case 'pong': return 'reply';
        case 'heartbeat': return 'favorite';
        case 'timeout': return 'schedule';
        default: return 'help';
      }
    };
  }

  get statusIcon(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'success': return 'check_circle';
        case 'warning': return 'warning';
        case 'error': return 'error';
        default: return 'help';
      }
    };
  }

  get statusColor(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'success': return 'primary';
        case 'warning': return 'accent';
        case 'error': return 'warn';
        default: return 'default';
      }
    };
  }

  get formatTimestamp(): (date: Date) => string {
    return (date: Date) => {
      return date.toLocaleTimeString();
    };
  }
}
