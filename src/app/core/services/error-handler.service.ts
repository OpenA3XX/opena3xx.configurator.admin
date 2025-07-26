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

interface ErrorWithMessage {
  message: string;
  error?: {
    message: string;
  };
  stack?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private snackBar: MatSnackBar,
    private configService: ConfigurationService
  ) {}

  handleError(error: unknown): void {
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

  private createAppError(error: unknown): AppError {
    const errorWithStack = error as ErrorWithMessage;
    return {
      message: this.getErrorMessage(error),
      stack: errorWithStack?.stack,
      timestamp: new Date(),
      url: window.location.href
    };
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return `HTTP Error ${error.status}: ${error.message}`;
    }

    const errorWithMessage = error as ErrorWithMessage;
    if (errorWithMessage?.error?.message) {
      return errorWithMessage.error.message;
    }

    if (errorWithMessage?.message) {
      return errorWithMessage.message;
    }

    return 'An unexpected error occurred';
  }

  private showUserError(error: unknown): void {
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
