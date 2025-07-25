import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeModel } from '@ngstack/code-editor';
import { RealTimeService, FlightEvent, KeepAliveEvent } from 'src/app/core/services/realtime.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { ThemeService } from 'src/app/core/services/theme.service';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareBoardDto } from 'src/app/shared/models/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'opena3xx-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, OnDestroy {
  private filterValue: string = '';
  private eventsPerMinute: number = 0;
  private lastMinuteEvents: any[] = [];
  private activeFilters: any = {};
  private chartData: any[] = [];
  private boardActivity: any[] = [];
  private themeSubscription: any;
  private hardwareBoards: HardwareBoardDto[] = [];

  // Form for advanced filtering
  filterForm: FormGroup;
  showCharts: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    public realtimeService: RealTimeService,
    public router: Router,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private themeService: ThemeService,
    private dataService: DataService
  ) {
    this.filterForm = this.fb.group({
      boardIdFilter: [''],
      eventTypeFilter: [''],
      timeRangeFilter: ['']
    });
  }

  ngOnDestroy(): void {
    this.realtimeService.disconnect();
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.realtimeService.connect();
    this.startEventsPerMinuteTracking();
    this.initializeChartData();
    this.fetchHardwareBoards();

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  // Hardware Boards API Integration
  private async fetchHardwareBoards(): Promise<void> {
    try {
      this.hardwareBoards = await firstValueFrom(this.dataService.getAllHardwareBoards()) as HardwareBoardDto[];
      console.log('Hardware Boards loaded:', this.hardwareBoards);
    } catch (error: any) {
      console.error('Error fetching hardware boards:', error);
      this.showSnackBar('Error loading hardware boards');
    }
  }

  // Connection Management
  onConnect(): void {
    this.realtimeService.connect();
    this.showSnackBar('Connecting to real-time service...');
  }

  onDisconnect(): void {
    this.realtimeService.disconnect();
    this.showSnackBar('Disconnected from real-time service');
  }

  // Statistics Methods
  getTotalEvents(): number {
    return this.realtimeService.flightEvents.length + this.realtimeService.keepAliveEvents.length;
  }

  getEventsPerMinute(): number {
    return this.eventsPerMinute;
  }

  getConnectedBoards(): number {
    const flightBoardIds = new Set(this.realtimeService.flightEvents.map(e => e.hardware_board_id));
    const keepAliveBoardIds = new Set(this.realtimeService.keepAliveEvents.map(e => e.hardware_board_id));
    return new Set([...flightBoardIds, ...keepAliveBoardIds]).size;
  }

  getActiveSelectors(): number {
    const selectorIds = new Set(this.realtimeService.flightEvents.map(e => e.input_selector_id));
    return selectorIds.size;
  }

  // Chart and Performance Methods
  onToggleCharts(): void {
    this.showCharts = !this.showCharts;
  }

  getChartData(): any[] {
    return this.chartData;
  }

  getBoardActivity(): any[] {
    return this.boardActivity;
  }

  private initializeChartData(): void {
    // Initialize chart data with 10 data points
    this.chartData = Array.from({ length: 10 }, (_, i) => ({
      time: i,
      value: Math.floor(Math.random() * 20) + 5 // Random values between 5-25
    }));

    // Update chart data every 10 seconds
    setInterval(() => {
      this.updateChartData();
      this.updateBoardActivity();
    }, 10000);
  }

  private updateChartData(): void {
    // Shift data and add new value
    this.chartData.shift();
    this.chartData.push({
      time: Date.now(),
      value: this.eventsPerMinute
    });
  }

  private updateBoardActivity(): void {
    const boardIds = this.getUniqueBoardIds();
    this.boardActivity = boardIds.map(id => {
      const flightEvents = this.realtimeService.flightEvents.filter(e => e.hardware_board_id === id);
      const keepAliveEvents = this.realtimeService.keepAliveEvents.filter(e => e.hardware_board_id === id);
      const totalEvents = flightEvents.length + keepAliveEvents.length;

      // Check if board has been active in the last minute
      const oneMinuteAgo = new Date(Date.now() - 60000);
      const recentEvents = [...flightEvents, ...keepAliveEvents].filter(e =>
        new Date(e.timestamp) > oneMinuteAgo
      );

      return {
        id: id,
        events: totalEvents,
        isActive: recentEvents.length > 0
      };
    });
  }

  // Dialog Methods
  onOpenSettingsDialog(): void {
    this.showSnackBar('Settings dialog would open here');
    // TODO: Implement settings dialog
  }

  onOpenEventHistoryDialog(): void {
    this.showSnackBar('Event history dialog would open here');
    // TODO: Implement event history dialog
  }

  onOpenPerformanceDialog(): void {
    this.showSnackBar('Performance metrics dialog would open here');
    // TODO: Implement performance dialog
  }

  // Enhanced Filtering Methods
  onSearchChange(searchValue: string): void {
    this.filterValue = searchValue;
  }

  onFilterChange(filters: any): void {
    this.activeFilters = filters;
  }

  onClearFilters(): void {
    this.filterValue = '';
    this.activeFilters = {};
    this.showSnackBar('Filters cleared');
  }

  getUniqueBoardIds(): number[] {
    const flightBoardIds = this.realtimeService.flightEvents.map(e => e.hardware_board_id);
    const keepAliveBoardIds = this.realtimeService.keepAliveEvents.map(e => e.hardware_board_id);
    return [...new Set([...flightBoardIds, ...keepAliveBoardIds])].sort((a, b) => a - b);
  }

  // Get hardware boards for dropdown
  getHardwareBoards(): HardwareBoardDto[] {
    return this.hardwareBoards;
  }

  private filterByTimeRange(events: any[]): any[] {
    if (!this.activeFilters.timeRangeFilter) return events;

    const now = new Date();
    let cutoffTime: Date;

    switch (this.activeFilters.timeRangeFilter) {
      case '1min':
        cutoffTime = new Date(now.getTime() - 60000);
        break;
      case '5min':
        cutoffTime = new Date(now.getTime() - 300000);
        break;
      case '15min':
        cutoffTime = new Date(now.getTime() - 900000);
        break;
      case '1hour':
        cutoffTime = new Date(now.getTime() - 3600000);
        break;
      default:
        return events;
    }

    return events.filter(event => new Date(event.timestamp) > cutoffTime);
  }

  private filterByBoardId(events: any[]): any[] {
    if (!this.activeFilters.boardIdFilter) return events;
    return events.filter(event => event.hardware_board_id.toString() === this.activeFilters.boardIdFilter);
  }

  getFilteredFlightEvents(): FlightEvent[] {
    let events = this.realtimeService.flightEvents;

    // Apply time range filter
    events = this.filterByTimeRange(events);

    // Apply board ID filter
    events = this.filterByBoardId(events);

    // Apply search filter
    if (this.filterValue) {
      events = events.filter(event =>
        event.hardware_board_id.toString().includes(this.filterValue) ||
        event.extender_bus_name.toLowerCase().includes(this.filterValue) ||
        event.extender_bit_name.toLowerCase().includes(this.filterValue) ||
        event.input_selector_name.toLowerCase().includes(this.filterValue) ||
        event.input_selector_id.toLowerCase().includes(this.filterValue)
      );
    }

    return events;
  }

  getFilteredKeepAliveEvents(): KeepAliveEvent[] {
    let events = this.realtimeService.keepAliveEvents;

    // Apply time range filter
    events = this.filterByTimeRange(events);

    // Apply board ID filter
    events = this.filterByBoardId(events);

    // Apply search filter
    if (this.filterValue) {
      events = events.filter(event =>
        event.hardware_board_id.toString().includes(this.filterValue) ||
        event.message.toLowerCase().includes(this.filterValue)
      );
    }

    return events;
  }

  // Event Management
  onClearEvents(): void {
    this.realtimeService.flightEvents = [];
    this.realtimeService.keepAliveEvents = [];
    this.showSnackBar('All events cleared');
  }

  onExportEvents(): void {
    const allEvents = {
      flightEvents: this.realtimeService.flightEvents,
      keepAliveEvents: this.realtimeService.keepAliveEvents,
      exportTime: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `opena3xx-events-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.showSnackBar('Events exported successfully');
  }

  // Event Actions
  onCopyEvent(event: any): void {
    const eventDetails = JSON.stringify(event, null, 2);
    this.clipboard.copy(eventDetails);
    this.showSnackBar('Event details copied to clipboard');
  }

  onExportSingleEvent(event: any): void {
    const dataStr = JSON.stringify(event, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event-${event.timestamp.split('T')[0]}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.showSnackBar('Event exported successfully');
  }

  // Events Per Minute Tracking
  private startEventsPerMinuteTracking(): void {
    setInterval(() => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);

      const recentFlightEvents = this.realtimeService.flightEvents.filter(event =>
        new Date(event.timestamp) > oneMinuteAgo
      );

      const recentKeepAliveEvents = this.realtimeService.keepAliveEvents.filter(event =>
        new Date(event.timestamp) > oneMinuteAgo
      );

      this.eventsPerMinute = recentFlightEvents.length + recentKeepAliveEvents.length;
    }, 10000); // Update every 10 seconds
  }

  // Utility Methods
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  // Legacy methods (keeping for compatibility)
  goBack() {
    this.router.navigateByUrl('/');
  }
}
