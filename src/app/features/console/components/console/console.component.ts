import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { ConsoleStore } from '../../stores/console.store';
import { ConsoleMessage, ConsoleCommand } from '../../services/console.service';
import { Subscription, interval } from 'rxjs';

interface ConsoleEvent {
  id: string;
  timestamp: Date;
  type: string;
  data: unknown;
}

interface ConsoleFilters {
  boardIdFilter: string;
  eventTypeFilter: string;
  timeRangeFilter: string;
}

interface ChartDataPoint {
  time: number;
  value: number;
}

interface BoardActivityData {
  id: number;
  events: number;
  isActive: boolean;
}

@Component({
  selector: 'opena3xx-console',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageLayoutComponent,
    LoadingWrapperComponent,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  messages = signal<ConsoleMessage[]>([]);
  commands = signal<ConsoleCommand[]>([]);
  loading = signal(false);
  error = signal(false);
  isConnected = signal(false);
  showCharts = signal(false);

  // Computed values
  isEmpty = computed(() => this.messages().length === 0 && !this.loading() && !this.error());
  stats = computed(() => this.consoleStore.stats());

  // Form for advanced filtering
  filterForm: FormGroup;
  private eventsPerMinute: number = 0;
  private lastMinuteEvents: ConsoleEvent[] = [];
  private chartData: ChartDataPoint[] = [];
  private boardActivity: BoardActivityData[] = [];
  private subscription = new Subscription();

  // Page actions
  pageActions: ActionButton[] = [
    {
      label: 'Clear Events',
      icon: 'clear_all',
      action: 'clear',
      color: 'warn'
    },
    {
      label: 'Export Events',
      icon: 'download',
      action: 'export',
      color: 'accent'
    },
    {
      label: 'Toggle Charts',
      icon: 'show_chart',
      action: 'charts',
      color: 'primary'
    }
  ];

  constructor(
    private consoleStore: ConsoleStore,
    private router: Router,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      boardIdFilter: [''],
      eventTypeFilter: [''],
      timeRangeFilter: ['']
    });
  }

  ngOnInit(): void {
    this.initializeConsole();
    this.startEventsPerMinuteTracking();
    this.initializeChartData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeConsole(): void {
    this.loading.set(true);
    this.error.set(false);

    // Load initial data
    this.consoleStore.loadMessages(100);
    this.consoleStore.loadCommands(50);
    this.consoleStore.loadSessions();
    this.consoleStore.loadConfig();

    // Use computed values to sync with store
    this.subscription.add(
      interval(1000).subscribe(() => {
        this.messages.set(this.consoleStore.messages());
        this.commands.set(this.consoleStore.commands());
        this.isConnected.set(this.consoleStore.isConnected());
        this.loading.set(this.consoleStore.loading());

        const error = this.consoleStore.error();
        this.error.set(!!error);
        if (error) {
          this.snackBar.open(error, 'Close', { duration: 3000 });
        }
      })
    );
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'clear':
        this.onClearEvents();
        break;
      case 'export':
        this.onExportEvents();
        break;
      case 'charts':
        this.onToggleCharts();
        break;
    }
  }

  onRetry(): void {
    this.consoleStore.refreshData();
  }

  onToggleCharts(): void {
    this.showCharts.update(show => !show);
  }

  onClearEvents(): void {
    this.consoleStore.clearMessages();
    this.snackBar.open('Events cleared successfully', 'Close', { duration: 2000 });
  }

  onExportEvents(): void {
    const format = 'json';
    this.consoleStore.exportMessages(format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-events-${new Date().toISOString()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Events exported successfully', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error exporting events:', error);
        this.snackBar.open('Error exporting events', 'Close', { duration: 3000 });
      }
    });
  }

  onCopyEvent(event: ConsoleMessage | ConsoleCommand): void {
    const eventText = JSON.stringify(event, null, 2);
    this.clipboard.copy(eventText);
    this.snackBar.open('Event copied to clipboard', 'Close', { duration: 2000 });
  }

  onSearchChange(searchValue: string): void {
    this.consoleStore.setFilters({ searchTerm: searchValue });
  }

  onFilterChange(filters: ConsoleFilters): void {
    // Update form and store filters
    this.filterForm.patchValue(filters);
    this.consoleStore.setFilters({
      searchTerm: filters.boardIdFilter || filters.eventTypeFilter || ''
    });
  }

  onClearFilters(): void {
    this.filterForm.reset();
    this.consoleStore.clearFilters();
  }

  // Statistics methods
  getTotalEvents(): number {
    return this.stats().totalMessages;
  }

  getEventsPerMinute(): number {
    return this.eventsPerMinute;
  }

  getConnectedBoards(): number {
    return this.stats().activeSessions;
  }

  getActiveSelectors(): number {
    return this.stats().totalCommands;
  }

  getChartData(): ChartDataPoint[] {
    return this.chartData;
  }

  getBoardActivity(): BoardActivityData[] {
    return this.boardActivity;
  }

  // Private methods
  private startEventsPerMinuteTracking(): void {
    this.subscription.add(
      interval(60000).subscribe(() => {
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);

        this.lastMinuteEvents = this.lastMinuteEvents.filter(event =>
          new Date(event.timestamp) > oneMinuteAgo
        );

        this.eventsPerMinute = this.lastMinuteEvents.length;
        this.updateChartData();
      })
    );
  }

  private initializeChartData(): void {
    this.chartData = [];
    this.boardActivity = [];

    // Initialize with some sample data
    for (let i = 0; i < 10; i++) {
      this.chartData.push({
        time: Date.now() - (10 - i) * 60000,
        value: Math.floor(Math.random() * 100)
      });
    }
  }

  private updateChartData(): void {
    const now = Date.now();
    this.chartData.push({
      time: now,
      value: this.eventsPerMinute
    });

    // Keep only last 60 data points
    if (this.chartData.length > 60) {
      this.chartData = this.chartData.slice(-60);
    }
  }

  private updateBoardActivity(): void {
    // Update board activity based on current messages
    const messages = this.messages();
    const boardMap = new Map<number, number>();

    messages.forEach(message => {
      // Extract board ID from message source if available
      const boardId = this.extractBoardId(message.source);
      if (boardId) {
        boardMap.set(boardId, (boardMap.get(boardId) || 0) + 1);
      }
    });

    this.boardActivity = Array.from(boardMap.entries()).map(([id, events]) => ({
      id,
      events,
      isActive: events > 0
    }));
  }

  private extractBoardId(source: string): number | null {
    // Extract board ID from source string
    const match = source.match(/board[_-]?(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }

  goBack(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
