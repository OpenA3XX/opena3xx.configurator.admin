import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  maxValue?: number;
  status: 'normal' | 'warning' | 'critical';
  icon: string;
  description?: string;
}

export interface SystemStatus {
  overall: 'online' | 'offline' | 'warning';
  uptime: string;
  lastUpdate: Date;
  metrics: SystemMetric[];
}

@Component({
  selector: 'opena3xx-system-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './system-overview.component.html',
  styleUrls: ['./system-overview.component.scss']
})
export class SystemOverviewComponent {
  @Input() title = 'System Overview';
  @Input() status: SystemStatus = {
    overall: 'online',
    uptime: '0h 0m',
    lastUpdate: new Date(),
    metrics: []
  };
  @Input() showDetails = true;
  @Output() refresh = new EventEmitter<void>();
  @Output() metricClick = new EventEmitter<SystemMetric>();

  // Computed properties
  statusClass = computed(() => {
    const classes = ['opena3xx-system-overview'];
    classes.push(`opena3xx-system-overview--${this.status.overall}`);
    return classes.join(' ');
  });

  metricClass = (metric: SystemMetric) => {
    const classes = ['opena3xx-system-overview__metric'];
    classes.push(`opena3xx-system-overview__metric--${metric.status}`);
    return classes.join(' ');
  };

  progressValue = (metric: SystemMetric): number => {
    if (!metric.maxValue) return 0;
    return (metric.value / metric.maxValue) * 100;
  };

  onRefresh(): void {
    this.refresh.emit();
  }

  onMetricClick(metric: SystemMetric): void {
    this.metricClick.emit(metric);
  }

  // Getters for template
  get systemStatusClasses(): string {
    return this.statusClass();
  }

  get hasMetrics(): boolean {
    return this.status.metrics.length > 0;
  }

  get criticalMetrics(): SystemMetric[] {
    return this.status.metrics.filter(m => m.status === 'critical');
  }

  get warningMetrics(): SystemMetric[] {
    return this.status.metrics.filter(m => m.status === 'warning');
  }

  get normalMetrics(): SystemMetric[] {
    return this.status.metrics.filter(m => m.status === 'normal');
  }

  get statusIcon(): string {
    switch (this.status.overall) {
      case 'online': return 'check_circle';
      case 'warning': return 'warning';
      case 'offline': return 'error';
      default: return 'info';
    }
  }

  get statusText(): string {
    return this.status.overall.charAt(0).toUpperCase() + this.status.overall.slice(1);
  }

  get lastUpdateText(): string {
    return this.status.lastUpdate.toLocaleTimeString();
  }
}
