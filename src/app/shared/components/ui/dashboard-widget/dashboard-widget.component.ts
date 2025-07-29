import { Component, Input, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';

export interface WidgetData {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info';
  trend?: number[];
  maxValue?: number;
  minValue?: number;
  target?: number;
  description?: string;
  icon?: string;
  color?: string;
}

export interface WidgetConfig {
  type: 'metric' | 'chart' | 'status' | 'list' | 'progress';
  size: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number; // milliseconds
  showActions?: boolean;
  collapsible?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

export interface WidgetAction {
  label: string;
  icon: string;
  action: string;
  color?: string;
  disabled?: boolean;
}

@Component({
  selector: 'opena3xx-dashboard-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="dashboard-widget"
              [class]="'widget-size-' + config.size + ' widget-type-' + config.type"
              [class.collapsed]="isCollapsed()"
              [class.dragging]="isDragging()"
              [class.resizing]="isResizing()">

      <!-- Widget Header -->
      <div class="widget-header">
        <div class="widget-title">
          <mat-icon *ngIf="data.icon" class="widget-icon">{{ data.icon }}</mat-icon>
          <h3>{{ data.title }}</h3>
          <mat-chip *ngIf="data.status"
                    [class]="'status-' + data.status"
                    class="status-chip">
            {{ data.status }}
          </mat-chip>
        </div>

        <div class="widget-actions">
          <button mat-icon-button
                  *ngIf="config.collapsible"
                  (click)="toggleCollapse()"
                  [matTooltip]="isCollapsed() ? 'Expand' : 'Collapse'">
            <mat-icon>{{ isCollapsed() ? 'expand_less' : 'expand_more' }}</mat-icon>
          </button>

          <button mat-icon-button
                  *ngIf="config.showActions"
                  [matMenuTriggerFor]="actionMenu"
                  [matTooltip]="'Actions'">
            <mat-icon>more_vert</mat-icon>
          </button>

          <mat-menu #actionMenu="matMenu">
            <button mat-menu-item *ngFor="let action of actions"
                    (click)="onActionClick(action.action)"
                    [disabled]="action.disabled">
              <mat-icon>{{ action.icon }}</mat-icon>
              <span>{{ action.label }}</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <!-- Widget Content -->
      <div class="widget-content" *ngIf="!isCollapsed()">

        <!-- Metric Widget -->
        <div *ngIf="config.type === 'metric'" class="metric-widget">
          <div class="metric-value">
            <span class="value">{{ formatValue(data.value) }}</span>
            <span *ngIf="data.unit" class="unit">{{ data.unit }}</span>
          </div>

          <div *ngIf="data.change !== undefined" class="metric-change">
            <mat-icon [class]="'change-' + (data.changeType || 'neutral')">
              {{ getChangeIcon(data.changeType) }}
            </mat-icon>
            <span [class]="'change-' + (data.changeType || 'neutral')">
              {{ formatChange(data.change) }}
            </span>
          </div>

          <div *ngIf="data.description" class="metric-description">
            {{ data.description }}
          </div>
        </div>

        <!-- Progress Widget -->
        <div *ngIf="config.type === 'progress'" class="progress-widget">
          <div class="progress-header">
            <span class="progress-label">{{ data.title }}</span>
            <span class="progress-value">{{ formatValue(data.value) }}{{ data.unit }}</span>
          </div>

          <mat-progress-bar
            *ngIf="data.maxValue"
            [value]="getProgressPercentage()"
            [color]="getProgressColor()">
          </mat-progress-bar>

          <div class="progress-details">
            <span *ngIf="data.target" class="target">
              Target: {{ formatValue(data.target) }}{{ data.unit }}
            </span>
            <span *ngIf="data.maxValue" class="max">
              Max: {{ formatValue(data.maxValue) }}{{ data.unit }}
            </span>
          </div>
        </div>

        <!-- Status Widget -->
        <div *ngIf="config.type === 'status'" class="status-widget">
          <div class="status-indicator" [class]="'status-' + data.status">
            <mat-icon>{{ getStatusIcon(data.status) }}</mat-icon>
            <span class="status-text">{{ data.value }}</span>
          </div>

          <div *ngIf="data.description" class="status-description">
            {{ data.description }}
          </div>
        </div>

        <!-- List Widget -->
        <div *ngIf="config.type === 'list'" class="list-widget">
          <div class="list-item" *ngFor="let item of getListItems()">
            <div class="item-content">
              <mat-icon *ngIf="item.icon" class="item-icon">{{ item.icon }}</mat-icon>
              <span class="item-text">{{ item.text }}</span>
              <span *ngIf="item.value" class="item-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Chart Widget -->
        <div *ngIf="config.type === 'chart'" class="chart-widget">
          <div class="chart-placeholder">
            <mat-icon>show_chart</mat-icon>
            <span>Chart visualization</span>
          </div>
          <!-- Chart implementation would go here -->
        </div>
      </div>

      <!-- Widget Footer -->
      <div class="widget-footer" *ngIf="!isCollapsed() && showFooter()">
        <div class="footer-content">
          <span *ngIf="lastUpdated()" class="last-updated">
            Updated: {{ formatTime(lastUpdated()) }}
          </span>
          <span *ngIf="isLoading()" class="loading-indicator">
            <mat-icon class="spinning">refresh</mat-icon>
            Loading...
          </span>
        </div>
      </div>
    </mat-card>
  `,
  styleUrls: ['./dashboard-widget.component.scss']
})
export class DashboardWidgetComponent implements OnInit, OnDestroy {
  @Input() data!: WidgetData;
  @Input() config!: WidgetConfig;
  @Input() actions: WidgetAction[] = [];
  @Input() onAction?: (action: string) => void;

  // Signals for reactive state
  isCollapsed = signal(false);
  isDragging = signal(false);
  isResizing = signal(false);
  isLoading = signal(false);
  lastUpdated = signal<Date | null>(null);

  // Computed values
  showFooter = computed(() => this.lastUpdated() !== null || this.isLoading());

  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.setupRefreshInterval();
    this.updateLastUpdated();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Public methods
  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  onActionClick(action: string): void {
    if (this.onAction) {
      this.onAction(action);
    }
  }

  // Private methods
  private setupRefreshInterval(): void {
    if (this.config.refreshInterval && this.config.refreshInterval > 0) {
      // In a real implementation, you'd set up an interval to refresh data
      // For now, we'll just update the last updated time
      setInterval(() => {
        this.updateLastUpdated();
      }, this.config.refreshInterval);
    }
  }

  private updateLastUpdated(): void {
    this.lastUpdated.set(new Date());
  }

  private formatValue(value: number | string): string {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  }

  private formatChange(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  private getChangeIcon(changeType?: 'increase' | 'decrease' | 'neutral'): string {
    switch (changeType) {
      case 'increase':
        return 'trending_up';
      case 'decrease':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  }

  private getStatusIcon(status?: string): string {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }

  private getProgressPercentage(): number {
    if (!this.data.maxValue || typeof this.data.value !== 'number') {
      return 0;
    }
    return (this.data.value / this.data.maxValue) * 100;
  }

  private getProgressColor(): string {
    const percentage = this.getProgressPercentage();
    if (percentage >= 80) return 'warn';
    if (percentage >= 60) return 'accent';
    return 'primary';
  }

  private getListItems(): any[] {
    // This would be implemented based on the actual data structure
    return [];
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }
}
