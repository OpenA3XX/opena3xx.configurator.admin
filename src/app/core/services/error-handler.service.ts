import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from './configuration.service';

export interface AppError {
  message: string;
  stack?: string;
  timestamp: Date;
  url?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private snackBar: MatSnackBar,
    private configService: ConfigurationService
  ) {}

  handleError(error: any): void {
    const appError = this.createAppError(error);

    // Log error based on configuration
    if (this.configService.isConsoleLoggingEnabled()) {
      console.error('Global Error:', appError);
    }

    // Show user-friendly message
    this.showUserError(error);

    // Send to logging service in production
    if (!this.configService.isDebugModeEnabled()) {
      this.sendToLoggingService(appError);
    }
  }

  private createAppError(error: any): AppError {
    return {
      message: this.getErrorMessage(error),
      stack: error?.stack,
      timestamp: new Date(),
      url: window.location.href
    };
  }

  private getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      return `HTTP Error ${error.status}: ${error.message}`;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  private showUserError(error: any): void {
    let message = 'An error occurred. Please try again.';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          message = 'Network error. Please check your connection.';
          break;
        case 401:
          message = 'Authentication required.';
          break;
        case 403:
          message = 'Access denied.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private sendToLoggingService(error: AppError): void {
    // Implement logging service integration
    // This could send to Sentry, LogRocket, or custom logging endpoint
    console.log('Would send to logging service:', error);
  }
}
