import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  maxValue: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  cpu: SystemMetric;
  memory: SystemMetric;
  disk: SystemMetric;
  network: SystemMetric;
  temperature: SystemMetric;
  uptime: string;
  lastCheck: Date;
  alerts: number;
}

@Component({
  selector: 'opena3xx-system-health-overview',
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
  templateUrl: './system-health-overview.component.html',
  styleUrls: ['./system-health-overview.component.scss']
})
export class SystemHealthOverviewComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  health = signal<SystemHealth | null>(null);

  // Computed properties
  isEmpty = computed(() => !this.health() && !this.loading() && !this.error());

  criticalMetrics = computed(() => {
    if (!this.health()) return [];
    return [
      this.health()!.cpu,
      this.health()!.memory,
      this.health()!.disk,
      this.health()!.network,
      this.health()!.temperature
    ].filter(m => m.status === 'critical');
  });

  warningMetrics = computed(() => {
    if (!this.health()) return [];
    return [
      this.health()!.cpu,
      this.health()!.memory,
      this.health()!.disk,
      this.health()!.network,
      this.health()!.temperature
    ].filter(m => m.status === 'warning');
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
      label: 'Detailed Report',
      icon: 'assessment',
      action: 'detailed-report',
      color: 'accent'
    },
    {
      label: 'Export Data',
      icon: 'download',
      action: 'export-data',
      color: 'accent'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadSystemHealth();
  }

  async loadSystemHealth(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const health: SystemHealth = {
        overall: 'healthy',
        cpu: {
          name: 'CPU Usage',
          value: 45,
          unit: '%',
          maxValue: 100,
          status: 'normal',
          trend: 'stable',
          lastUpdate: new Date()
        },
        memory: {
          name: 'Memory Usage',
          value: 62,
          unit: '%',
          maxValue: 100,
          status: 'warning',
          trend: 'up',
          lastUpdate: new Date()
        },
        disk: {
          name: 'Disk Usage',
          value: 78,
          unit: '%',
          maxValue: 100,
          status: 'warning',
          trend: 'up',
          lastUpdate: new Date()
        },
        network: {
          name: 'Network Load',
          value: 35,
          unit: '%',
          maxValue: 100,
          status: 'normal',
          trend: 'stable',
          lastUpdate: new Date()
        },
        temperature: {
          name: 'System Temperature',
          value: 65,
          unit: '°C',
          maxValue: 85,
          status: 'normal',
          trend: 'stable',
          lastUpdate: new Date()
        },
        uptime: '7d 12h 34m',
        lastCheck: new Date(),
        alerts: 2
      };

      this.health.set(health);
    } catch (err) {
      console.error('Error loading system health:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onMetricClick(metric: SystemMetric): void {
    console.log('Opening detailed view for:', metric.name);
    // Open detailed metric view
  }

  generateDetailedReport(): void {
    console.log('Generating detailed system health report...');
    // Implement detailed report generation
  }

  exportData(): void {
    console.log('Exporting system health data...');
    // Implement data export functionality
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadSystemHealth();
        break;
      case 'detailed-report':
        this.generateDetailedReport();
        break;
      case 'export-data':
        this.exportData();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get systemHealth(): SystemHealth | null {
    return this.health();
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

  get overallStatusIcon(): string {
    if (!this.health()) return 'help';

    switch (this.health()!.overall) {
      case 'healthy': return 'check_circle';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'help';
    }
  }

  get overallStatusColor(): string {
    if (!this.health()) return 'default';

    switch (this.health()!.overall) {
      case 'healthy': return 'primary';
      case 'warning': return 'accent';
      case 'critical': return 'warn';
      default: return 'default';
    }
  }

  get metricIcon(): (metric: SystemMetric) => string {
    return (metric: SystemMetric) => {
      switch (metric.name.toLowerCase()) {
        case 'cpu usage': return 'memory';
        case 'memory usage': return 'storage';
        case 'disk usage': return 'hard_drive';
        case 'network load': return 'network_check';
        case 'system temperature': return 'thermostat';
        default: return 'monitor';
      }
    };
  }

  get metricColor(): (metric: SystemMetric) => string {
    return (metric: SystemMetric) => {
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

  get progressValue(): (metric: SystemMetric) => number {
    return (metric: SystemMetric) => {
      return (metric.value / metric.maxValue) * 100;
    };
  }
}
