import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export interface LoadingConfig {
  message?: string;
  showSpinner?: boolean;
  showRetry?: boolean;
  retryMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  showEmpty?: boolean;
}

@Component({
  selector: 'opena3xx-loading-wrapper',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="loading-wrapper">
      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner *ngIf="config.showSpinner !== false" diameter="40"></mat-spinner>
        <p class="loading-message">{{config.message || 'Loading...'}}</p>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error && !loading">
        <mat-icon class="error-icon">error</mat-icon>
        <p class="error-message">{{config.errorMessage || 'An error occurred'}}</p>
        <button
          *ngIf="config.showRetry !== false"
          mat-raised-button
          color="primary"
          (click)="onRetry()"
          class="retry-button">
          <mat-icon>refresh</mat-icon>
          {{config.retryMessage || 'Retry'}}
        </button>
      </div>

      <!-- Empty State -->
      <div class="empty-container" *ngIf="isEmpty && !loading && !error && config.showEmpty !== false">
        <mat-icon class="empty-icon">inbox</mat-icon>
        <p class="empty-message">{{config.emptyMessage || 'No data available'}}</p>
      </div>

      <!-- Content -->
      <div class="content-container" *ngIf="!loading && !error && !isEmpty">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./loading-wrapper.component.scss']
})
export class LoadingWrapperComponent {
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() isEmpty: boolean = false;
  @Input() config: LoadingConfig = {};

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
