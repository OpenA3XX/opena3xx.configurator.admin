import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface ConnectionLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  connectionId?: string;
  details?: any;
  duration?: number;
}

export interface LogFilters {
  level: 'all' | 'info' | 'warning' | 'error' | 'debug';
  source: 'all' | string;
  dateRange?: { start: Date; end: Date };
  search: string;
}

@Component({
  selector: 'opena3xx-connection-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './connection-logs.component.html',
  styleUrls: ['./connection-logs.component.scss']
})
export class ConnectionLogsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  logs = signal<ConnectionLog[]>([]);
  filters = signal<LogFilters>({
    level: 'all',
    source: 'all',
    search: ''
  });

  // Computed properties
  filteredLogs = computed(() => {
    let filtered = this.logs();

    if (this.filters().level !== 'all') {
      filtered = filtered.filter(log => log.level === this.filters().level);
    }

    if (this.filters().source !== 'all') {
      filtered = filtered.filter(log => log.source === this.filters().source);
    }

    if (this.filters().search) {
      const search = this.filters().search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(search) ||
        log.source.toLowerCase().includes(search)
      );
    }

    if (this.filters().dateRange) {
      const { start, end } = this.filters().dateRange;
      filtered = filtered.filter(log =>
        log.timestamp >= start && log.timestamp <= end
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  isEmpty = computed(() => this.filteredLogs().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Export Logs',
      icon: 'download',
      action: 'export-logs',
      color: 'accent'
    },
    {
      label: 'Clear Logs',
      icon: 'clear_all',
      action: 'clear-logs',
      color: 'warn'
    }
  ]);

  // Table columns
  displayedColumns = signal(['timestamp', 'level', 'source', 'message', 'actions']);

  constructor() {}

  ngOnInit(): void {
    this.loadLogs();
  }

  async loadLogs(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const logs: ConnectionLog[] = [
        {
          id: '1',
          timestamp: new Date(),
          level: 'info',
          message: 'Hardware panel connected successfully',
          source: 'hardware-panel-1',
          connectionId: 'conn-001',
          duration: 150
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000),
          level: 'warning',
          message: 'High latency detected on network connection',
          source: 'network-device-1',
          connectionId: 'conn-002',
          duration: 250
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 600000),
          level: 'error',
          message: 'Connection timeout to simulator',
          source: 'simulator-connection',
          connectionId: 'conn-003'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 900000),
          level: 'debug',
          message: 'Diagnostic test completed',
          source: 'diagnostic-tools',
          duration: 5000
        }
      ];
      this.logs.set(logs);
    } catch (err) {
      console.error('Error loading connection logs:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: LogFilters): void {
    this.filters.set(filters);
  }

  exportLogs(): void {
    console.log('Exporting connection logs...');
    // Implement export functionality
  }

  clearLogs(): void {
    console.log('Clearing connection logs...');
    this.logs.set([]);
  }

  viewLogDetails(log: ConnectionLog): void {
    console.log('Viewing log details:', log.id);
    // Open log details dialog
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadLogs();
        break;
      case 'export-logs':
        this.exportLogs();
        break;
      case 'clear-logs':
        this.clearLogs();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get logList(): ConnectionLog[] {
    return this.filteredLogs();
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

  get totalLogCount(): number {
    return this.logs().length;
  }

  get filteredLogCount(): number {
    return this.filteredLogs().length;
  }

  get levelOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Levels' },
      { value: 'info', label: 'Info' },
      { value: 'warning', label: 'Warning' },
      { value: 'error', label: 'Error' },
      { value: 'debug', label: 'Debug' }
    ];
  }

  get sourceOptions(): { value: string; label: string }[] {
    const sources = [...new Set(this.logs().map(log => log.source))];
    return [
      { value: 'all', label: 'All Sources' },
      ...sources.map(source => ({ value: source, label: source }))
    ];
  }

  get levelIcon(): (level: string) => string {
    return (level: string) => {
      switch (level) {
        case 'error': return 'error';
        case 'warning': return 'warning';
        case 'info': return 'info';
        case 'debug': return 'bug_report';
        default: return 'info';
      }
    };
  }

  get levelColor(): (level: string) => string {
    return (level: string) => {
      switch (level) {
        case 'error': return 'warn';
        case 'warning': return 'accent';
        case 'info': return 'primary';
        case 'debug': return 'default';
        default: return 'primary';
      }
    };
  }
}
