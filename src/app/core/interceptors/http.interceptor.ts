import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { ConfigurationService } from '../services/configuration.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private configService: ConfigurationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading indicator
    this.loadingService.show();

    // Add common headers
    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    // Log request in debug mode
    if (this.configService.isDebugModeEnabled()) {
      console.log('HTTP Request:', modifiedRequest);
    }

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log error in debug mode
        if (this.configService.isDebugModeEnabled()) {
          console.error('HTTP Error:', error);
        }

        // Handle specific HTTP errors
        if (error.status === 401) {
          // Handle unauthorized - redirect to login or refresh token
          console.warn('Unauthorized request detected');
        }

        if (error.status === 0) {
          // Network error - API might be down
          console.error('Network error - API unreachable');
        }

        return throwError(() => error);
      }),
      finalize(() => {
        // Hide loading indicator
        this.loadingService.hide();
      })
    );
  }
}
