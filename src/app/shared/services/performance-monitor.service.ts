import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, timer } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'memory' | 'cpu' | 'network' | 'ui' | 'api';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  timestamp: Date;
  resolved: boolean;
  threshold: number;
  currentValue: number;
}

export interface PerformanceConfig {
  enableMonitoring: boolean;
  samplingInterval: number; // milliseconds
  alertThresholds: {
    memoryUsage: number; // percentage
    cpuUsage: number; // percentage
    responseTime: number; // milliseconds
    errorRate: number; // percentage
  };
  retentionPeriod: number; // days
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metrics = new BehaviorSubject<PerformanceMetric[]>([]);
  private alerts = new BehaviorSubject<PerformanceAlert[]>([]);
  private config: PerformanceConfig = {
    enableMonitoring: true,
    samplingInterval: 5000, // 5 seconds
    alertThresholds: {
      memoryUsage: 80,
      cpuUsage: 70,
      responseTime: 2000,
      errorRate: 5
    },
    retentionPeriod: 7
  };

  private monitoringInterval: any;
  private destroy$ = new BehaviorSubject<void>(undefined);

  constructor() {
    this.initializeMonitoring();
  }

  // Public API
  getMetrics(): Observable<PerformanceMetric[]> {
    return this.metrics.asObservable();
  }

  getAlerts(): Observable<PerformanceAlert[]> {
    return this.alerts.asObservable();
  }

  getActiveAlerts(): Observable<PerformanceAlert[]> {
    return this.alerts.pipe(
      map(alerts => alerts.filter(alert => !alert.resolved))
    );
  }

  getMetricsByCategory(category: PerformanceMetric['category']): Observable<PerformanceMetric[]> {
    return this.metrics.pipe(
      map(metrics => metrics.filter(metric => metric.category === category))
    );
  }

  getLatestMetric(name: string): Observable<PerformanceMetric | null> {
    return this.metrics.pipe(
      map(metrics => {
        const filtered = metrics.filter(m => m.name === name);
        return filtered.length > 0 ? filtered[filtered.length - 1] : null;
      })
    );
  }

  // Configuration
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.restartMonitoring();
  }

  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  // Manual metric recording
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date()
    };

    const currentMetrics = this.metrics.value;
    const updatedMetrics = [...currentMetrics, fullMetric];

    // Keep only metrics within retention period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionPeriod);

    const filteredMetrics = updatedMetrics.filter(
      metric => metric.timestamp > cutoffDate
    );

    this.metrics.next(filteredMetrics);
    this.checkAlerts(fullMetric);
  }

  // API performance tracking
  trackApiCall(url: string, method: string, startTime: number): (endTime: number, success: boolean) => void {
    return (endTime: number, success: boolean) => {
      const duration = endTime - startTime;

      this.recordMetric({
        name: 'api_response_time',
        value: duration,
        unit: 'ms',
        category: 'api',
        severity: duration > this.config.alertThresholds.responseTime ? 'high' : 'low'
      });

      if (!success) {
        this.recordMetric({
          name: 'api_error_rate',
          value: 1,
          unit: 'count',
          category: 'api',
          severity: 'medium'
        });
      }
    };
  }

  // UI performance tracking
  trackComponentRender(componentName: string, renderTime: number): void {
    this.recordMetric({
      name: `${componentName}_render_time`,
      value: renderTime,
      unit: 'ms',
      category: 'ui',
      severity: renderTime > 100 ? 'medium' : 'low'
    });
  }

  trackUserInteraction(action: string, duration: number): void {
    this.recordMetric({
      name: `user_interaction_${action}`,
      value: duration,
      unit: 'ms',
      category: 'ui',
      severity: duration > 500 ? 'medium' : 'low'
    });
  }

  // Memory tracking
  trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      this.recordMetric({
        name: 'memory_usage',
        value: usagePercentage,
        unit: '%',
        category: 'memory',
        severity: usagePercentage > this.config.alertThresholds.memoryUsage ? 'high' : 'low'
      });
    }
  }

  // Network tracking
  trackNetworkActivity(url: string, size: number, duration: number): void {
    this.recordMetric({
      name: 'network_transfer',
      value: size,
      unit: 'bytes',
      category: 'network',
      severity: duration > 5000 ? 'medium' : 'low'
    });
  }

  // Alert management
  resolveAlert(alertId: string): void {
    const currentAlerts = this.alerts.value;
    const updatedAlerts = currentAlerts.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    );
    this.alerts.next(updatedAlerts);
  }

  clearResolvedAlerts(): void {
    const currentAlerts = this.alerts.value;
    const activeAlerts = currentAlerts.filter(alert => !alert.resolved);
    this.alerts.next(activeAlerts);
  }

  // Performance analysis
  getPerformanceSummary(): Observable<{
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: number;
    activeAlerts: number;
  }> {
    return this.metrics.pipe(
      map(metrics => {
        const apiMetrics = metrics.filter(m => m.name === 'api_response_time');
        const errorMetrics = metrics.filter(m => m.name === 'api_error_rate');
        const memoryMetrics = metrics.filter(m => m.name === 'memory_usage');

        const averageResponseTime = apiMetrics.length > 0
          ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
          : 0;

        const errorRate = errorMetrics.length > 0
          ? (errorMetrics.length / apiMetrics.length) * 100
          : 0;

        const memoryUsage = memoryMetrics.length > 0
          ? memoryMetrics[memoryMetrics.length - 1].value
          : 0;

        return {
          averageResponseTime,
          errorRate,
          memoryUsage,
          activeAlerts: this.alerts.value.filter(a => !a.resolved).length
        };
      })
    );
  }

  // Private methods
  private initializeMonitoring(): void {
    if (this.config.enableMonitoring) {
      this.startMonitoring();
    }
  }

  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, this.config.samplingInterval);
  }

  private restartMonitoring(): void {
    this.startMonitoring();
  }

  private collectSystemMetrics(): void {
    // Memory usage
    this.trackMemoryUsage();

    // CPU usage (simplified - in real app you'd use more sophisticated methods)
    this.recordMetric({
      name: 'cpu_usage',
      value: Math.random() * 100, // Placeholder
      unit: '%',
      category: 'cpu',
      severity: 'low'
    });

    // Network activity
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.recordMetric({
          name: 'network_speed',
          value: connection.downlink || 0,
          unit: 'Mbps',
          category: 'network',
          severity: 'low'
        });
      }
    }
  }

  private checkAlerts(metric: PerformanceMetric): void {
    const thresholds = this.config.alertThresholds;
    let shouldAlert = false;
    let severity: 'warning' | 'error' | 'critical' = 'warning';
    let message = '';

    switch (metric.name) {
      case 'memory_usage':
        if (metric.value > thresholds.memoryUsage) {
          shouldAlert = true;
          severity = metric.value > 90 ? 'critical' : 'error';
          message = `High memory usage: ${metric.value.toFixed(1)}%`;
        }
        break;

      case 'api_response_time':
        if (metric.value > thresholds.responseTime) {
          shouldAlert = true;
          severity = metric.value > 5000 ? 'critical' : 'error';
          message = `Slow API response: ${metric.value}ms`;
        }
        break;

      case 'api_error_rate':
        if (metric.value > 0) {
          shouldAlert = true;
          severity = 'error';
          message = 'API error detected';
        }
        break;
    }

    if (shouldAlert) {
      this.createAlert(metric.name, message, severity, metric.value);
    }
  }

  private createAlert(
    metric: string,
    message: string,
    severity: 'warning' | 'error' | 'critical',
    currentValue: number
  ): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random()}`,
      metric,
      message,
      severity,
      timestamp: new Date(),
      resolved: false,
      threshold: this.config.alertThresholds[metric as keyof typeof this.config.alertThresholds] || 0,
      currentValue
    };

    const currentAlerts = this.alerts.value;
    this.alerts.next([...currentAlerts, alert]);
  }

  // Cleanup
  ngOnDestroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
