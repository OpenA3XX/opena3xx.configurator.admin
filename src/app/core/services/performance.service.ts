import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  url: string;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory: MemoryInfo;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private metrics: PerformanceMetric[] = [];

  constructor(private configService: ConfigurationService) {
    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver(): void {
    if ('PerformanceObserver' in window && this.configService.isDebugModeEnabled()) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('navigation', entry.duration, entry.name);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Only log slow resources
            this.recordMetric('resource', entry.duration, entry.name);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('lcp', entry.startTime, 'largest-contentful-paint');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe cumulative layout shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as LayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            this.recordMetric('cls', layoutShiftEntry.value, 'cumulative-layout-shift');
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private recordMetric(name: string, value: number, url: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      url
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    if (this.configService.isConsoleLoggingEnabled()) {
      console.log(`Performance: ${name} - ${value.toFixed(2)}ms - ${url}`);
    }
  }

  /**
   * Measure function execution time
   */
  measure<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();

    this.recordMetric(`function-${name}`, endTime - startTime, window.location.href);

    return result;
  }

  /**
   * Measure async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();

    this.recordMetric(`async-${name}`, endTime - startTime, window.location.href);

    return result;
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by type
   */
  getMetricsByType(type: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === type);
  }

  /**
   * Get average metric value by type
   */
  getAverageMetric(type: string): number {
    const typeMetrics = this.getMetricsByType(type);
    if (typeMetrics.length === 0) return 0;

    const sum = typeMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / typeMetrics.length;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): MemoryInfo | null {
    if ('memory' in performance) {
      const perfWithMemory = performance as PerformanceWithMemory;
      return {
        usedJSHeapSize: perfWithMemory.memory.usedJSHeapSize,
        totalJSHeapSize: perfWithMemory.memory.totalJSHeapSize,
        jsHeapSizeLimit: perfWithMemory.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}
