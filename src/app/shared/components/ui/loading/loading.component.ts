import { Component } from '@angular/core';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'opena3xx-loading',
  template: `
    <div class="loading-overlay" *ngIf="loadingService.loading$ | async">
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-container {
      background: white;
      padding: 24px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .loading-text {
      margin: 0;
      color: #333;
      font-size: 16px;
    }
  `]
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
