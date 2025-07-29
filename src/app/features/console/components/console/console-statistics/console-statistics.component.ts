import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PageLayoutComponent, ActionButton } from '../../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface ConsoleMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: Date;
}

export interface ConsoleStatistics {
  totalEvents: number;
  eventsPerSecond: number;
  activeConnections: number;
  averageLatency: number;
  errorRate: number;
  uptime: string;
  lastEvent: Date;
  metrics: ConsoleMetric[];
}

@Component({
  selector: 'opena3xx-console-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatMenuModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './console-statistics.component.html',
  styleUrls: ['./console-statistics.component.scss']
})
export class ConsoleStatisticsComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  statistics = signal<ConsoleStatistics | null>(null);

  // Computed properties
  isEmpty = computed(() => !this.statistics() && !this.loading() && !this.error());

  criticalMetrics = computed(() => {
    if (!this.statistics()) return [];
    return this.statistics()!.metrics.filter(m => m.status === 'critical');
  });

  warningMetrics = computed(() => {
    if (!this.statistics()) return [];
    return this.statistics()!.metrics.filter(m => m.status === 'warning');
  });

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Export Data',
      icon: 'download',
      action: 'export-data',
      color: 'accent'
    },
    {
      label: 'Reset Stats',
      icon: 'restart_alt',
      action: 'reset-stats',
      color: 'warn'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadConsoleStatistics();
  }

  async loadConsoleStatistics(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statistics: ConsoleStatistics = {
        totalEvents: 15420,
        eventsPerSecond: 12.5,
        activeConnections: 8,
        averageLatency: 45,
        errorRate: 2.3,
        uptime: '3d 7h 23m',
        lastEvent: new Date(),
        metrics: [
          {
            name: 'Events Processed',
            value: 15420,
            unit: 'events',
            change: 5.2,
            trend: 'up',
            status: 'normal',
            lastUpdate: new Date()
          },
          {
            name: 'Active Connections',
            value: 8,
            unit: 'connections',
            change: -1,
            trend: 'down',
            status: 'warning',
            lastUpdate: new Date()
          },
          {
            name: 'Average Latency',
            value: 45,
            unit: 'ms',
            change: 2.1,
            trend: 'up',
            status: 'normal',
            lastUpdate: new Date()
          },
          {
            name: 'Error Rate',
            value: 2.3,
            unit: '%',
            change: 0.5,
            trend: 'up',
            status: 'warning',
            lastUpdate: new Date()
          },
          {
            name: 'Memory Usage',
            value: 78,
            unit: '%',
            change: 3.2,
            trend: 'up',
            status: 'critical',
            lastUpdate: new Date()
          }
        ]
      };

      this.statistics.set(statistics);
    } catch (err) {
      console.error('Error loading console statistics:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onMetricClick(metric: ConsoleMetric): void {
    console.log('Opening detailed view for:', metric.name);
    // Open detailed metric view
  }

  exportData(): void {
    console.log('Exporting console statistics data...');
    // Implement data export functionality
  }

  resetStats(): void {
    console.log('Resetting console statistics...');
    // Implement statistics reset
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadConsoleStatistics();
        break;
      case 'export-data':
        this.exportData();
        break;
      case 'reset-stats':
        this.resetStats();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get consoleStats(): ConsoleStatistics | null {
    return this.statistics();
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

  get criticalMetricCount(): number {
    return this.criticalMetrics().length;
  }

  get warningMetricCount(): number {
    return this.warningMetrics().length;
  }

  get metricIcon(): (metric: ConsoleMetric) => string {
    return (metric: ConsoleMetric) => {
      switch (metric.name.toLowerCase()) {
        case 'events processed': return 'event';
        case 'active connections': return 'link';
        case 'average latency': return 'speed';
        case 'error rate': return 'error';
        case 'memory usage': return 'memory';
        default: return 'monitor';
      }
    };
  }

  get metricColor(): (metric: ConsoleMetric) => string {
    return (metric: ConsoleMetric) => {
      switch (metric.status) {
        case 'normal': return 'primary';
        case 'warning': return 'accent';
        case 'critical': return 'warn';
        default: return 'default';
      }
    };
  }

  get trendIcon(): (trend: string) => string {
    return (trend: string) => {
      switch (trend) {
        case 'up': return 'trending_up';
        case 'down': return 'trending_down';
        case 'stable': return 'trending_flat';
        default: return 'help';
      }
    };
  }

  get changeColor(): (change: number) => string {
    return (change: number) => {
      if (change > 0) return 'warn';
      if (change < 0) return 'primary';
      return 'default';
    };
  }
}
