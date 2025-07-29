import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'opena3xx-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  dashboardData = signal<any>(null);
  isEmpty = computed(() => !this.dashboardData() && !this.loading() && !this.error());

  // Dashboard widgets configuration
  widgets = signal([
    {
      id: 'system-status',
      title: 'System Status',
      type: 'status',
      data: { status: 'online', uptime: '24h 30m', lastUpdate: new Date() },
      size: 'medium',
      refreshInterval: 30000
    },
    {
      id: 'hardware-overview',
      title: 'Hardware Overview',
      type: 'metric',
      data: { total: 15, active: 12, inactive: 3 },
      size: 'small',
      refreshInterval: 60000
    },
    {
      id: 'recent-activity',
      title: 'Recent Activity',
      type: 'list',
      data: [
        { id: 1, message: 'Hardware panel connected', time: '2 min ago', type: 'info' },
        { id: 2, message: 'Configuration updated', time: '5 min ago', type: 'success' },
        { id: 3, message: 'New device detected', time: '10 min ago', type: 'warning' }
      ],
      size: 'large',
      refreshInterval: 45000
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics',
      type: 'chart',
      data: { cpu: 45, memory: 62, network: 28 },
      size: 'medium',
      refreshInterval: 15000
    }
  ]);

  // Page actions
  pageActions = signal<any[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Settings',
      icon: 'settings',
      action: 'settings',
      color: 'accent'
    }
  ]);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      const data = await this.dashboardService.getDashboardData();
      this.dashboardData.set(data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  openSettings(): void {
    // Navigate to settings or open settings dialog
    console.log('Opening settings...');
  }

  onWidgetAction(widgetId: string, action: string): void {
    console.log(`Widget ${widgetId} action: ${action}`);
    // Handle widget-specific actions
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadDashboardData();
        break;
      case 'settings':
        this.openSettings();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get dashboardWidgets(): any[] {
    return this.widgets();
  }

  get pageActionButtons(): any[] {
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

  get hasData(): boolean {
    return !!this.dashboardData();
  }

  // Dashboard data properties
  get totalBoards(): number {
    return this.dashboardData()?.totalBoards || 0;
  }

  get totalPanels(): number {
    return this.dashboardData()?.totalPanels || 0;
  }

  get connectedSystems(): number {
    return this.dashboardData()?.connectedSystems || 0;
  }

  get lastUpdated(): Date {
    return this.dashboardData()?.lastUpdated || new Date();
  }

  get isDarkMode(): boolean {
    return false; // TODO: Implement dark mode detection
  }

  get systemHealth(): any {
    return this.dashboardData()?.systemHealth || { status: 'unknown' };
  }

  get activeBoards(): number {
    return this.dashboardData()?.activeBoards || 0;
  }

  get configuredPanels(): number {
    return this.dashboardData()?.configuredPanels || 0;
  }

  get recentEvents(): any[] {
    return this.dashboardData()?.recentEvents || [];
  }

  get recentActivities(): any[] {
    return this.dashboardData()?.recentActivities || [];
  }

  get apiStatus(): string {
    return this.dashboardData()?.apiStatus || 'unknown';
  }

  get databaseStatus(): string {
    return this.dashboardData()?.databaseStatus || 'unknown';
  }

  get realtimeStatus(): string {
    return this.dashboardData()?.realtimeStatus || 'unknown';
  }

  get systemStatus(): string {
    return this.dashboardData()?.systemStatus || 'unknown';
  }

  // Navigation methods
  navigateToHardware(): void {
    // TODO: Implement navigation
    console.log('Navigate to hardware');
  }

  navigateToPanels(): void {
    // TODO: Implement navigation
    console.log('Navigate to panels');
  }

  navigateToConsole(): void {
    // TODO: Implement navigation
    console.log('Navigate to console');
  }

  navigateToSettings(): void {
    // TODO: Implement navigation
    console.log('Navigate to settings');
  }
}
