import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { catchError, switchMap, share } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

export interface BackendDependencyInfo {
  isRunning: boolean;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface BackendDependencyResponse {
  isHealthy: boolean;
  dependencies: {
    MSFS: BackendDependencyInfo;
    RabbitMQ: BackendDependencyInfo;
    SEQ: BackendDependencyInfo;
  };
  checkedAt: string;
}

export interface DependencyStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'unknown';
  message: string;
  lastChecked: Date;
  responseTime?: number;
  version?: string;
  details?: Record<string, unknown>;
}

export interface DependencyStatusResponse {
  dependencies: {
    msfs?: DependencyStatus;
    rabbitmq?: DependencyStatus;
    seq?: DependencyStatus;
  };
  overall: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class DependencyStatusService {
  private statusSubject = new BehaviorSubject<DependencyStatusResponse | null>(null);
  public status$ = this.statusSubject.asObservable();

  private pollingInterval = 10000; // 10 seconds
  private polling$ = timer(0, this.pollingInterval).pipe(
    switchMap(() => this.checkAllDependencies()),
    share()
  );

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Skip-Loading': 'true' // Skip loading indicator for status checks
    })
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {
  }

  private get BASE_URL(): string {
    return this.configurationService.getApiBaseUrl();
  }

  /**
   * Start polling for dependency status updates
   */
  startPolling(): void {
    this.polling$.subscribe(
      (status) => this.statusSubject.next(status),
      (error) => console.error('Dependency status polling error:', error)
    );
  }

  /**
   * Stop polling (if needed)
   */
  stopPolling(): void {
    // Polling will naturally stop when component is destroyed
  }

  /**
   * Get all dependency status
   */
  checkAllDependencies(): Observable<DependencyStatusResponse> {
    return this.http.get<BackendDependencyResponse>(
      `${this.BASE_URL}/dependency-status`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError<BackendDependencyResponse>('checkAllDependencies')),
      switchMap((backendResponse: BackendDependencyResponse) => {
        const transformedResponse = this.transformBackendResponse(backendResponse);
        return of(transformedResponse);
      })
    );
  }

  /**
   * Get MSFS status only
   */
  checkMSFSStatus(): Observable<DependencyStatus> {
    return this.http.get<DependencyStatus>(
      `${this.BASE_URL}/dependency-status/msfs`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError<DependencyStatus>('checkMSFSStatus'))
    );
  }

  /**
   * Get RabbitMQ status only
   */
  checkRabbitMQStatus(): Observable<DependencyStatus> {
    return this.http.get<DependencyStatus>(
      `${this.BASE_URL}/dependency-status/rabbitmq`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError<DependencyStatus>('checkRabbitMQStatus'))
    );
  }

  /**
   * Get SEQ status only
   */
  checkSEQStatus(): Observable<DependencyStatus> {
    return this.http.get<DependencyStatus>(
      `${this.BASE_URL}/dependency-status/seq`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError<DependencyStatus>('checkSEQStatus'))
    );
  }

  /**
   * Simple health check
   */
  healthCheck(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(
      `${this.BASE_URL}/dependency-status/health`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError<{ status: string }>('healthCheck'))
    );
  }

  /**
   * Get current status (latest from cache)
   */
  getCurrentStatus(): DependencyStatusResponse | null {
    return this.statusSubject.value;
  }

  /**
   * Transform backend response to frontend format
   */
  private transformBackendResponse(backendResponse: BackendDependencyResponse): DependencyStatusResponse {
    const transformedResponse: DependencyStatusResponse = {
      dependencies: {
        msfs: this.transformDependency('MSFS 2020/2024', backendResponse.dependencies.MSFS, backendResponse.checkedAt),
        rabbitmq: this.transformDependency('RabbitMQ', backendResponse.dependencies.RabbitMQ, backendResponse.checkedAt),
        seq: this.transformDependency('SEQ', backendResponse.dependencies.SEQ, backendResponse.checkedAt)
      },
      overall: this.determineOverallStatus(backendResponse.isHealthy, backendResponse.dependencies),
      timestamp: backendResponse.checkedAt
    };

    return transformedResponse;
  }

  /**
   * Transform individual dependency from backend format
   */
  private transformDependency(name: string, backendDep: BackendDependencyInfo, checkedAt: string): DependencyStatus {
    const status = this.mapBackendStatusToFrontend(backendDep.status, backendDep.isRunning);
    const message = this.generateStatusMessage(backendDep);

    return {
      name,
      status,
      message,
      lastChecked: new Date(checkedAt),
      details: backendDep.metadata
    };
  }

  /**
   * Map backend status values to frontend status values
   */
  private mapBackendStatusToFrontend(backendStatus: string, isRunning: boolean): 'online' | 'offline' | 'warning' | 'unknown' {
    if (!isRunning) {
      return 'offline';
    }

    switch (backendStatus.toLowerCase()) {
      case 'ok':
      case 'healthy':
      case 'up':
        return 'online';
      case 'down':
      case 'error':
      case 'failed':
        return 'offline';
      case 'warning':
      case 'degraded':
        return 'warning';
      default:
        return 'unknown';
    }
  }

  /**
   * Generate status message from backend data
   */
  private generateStatusMessage(backendDep: BackendDependencyInfo): string {
    if (!backendDep.isRunning) {
      const error = backendDep.metadata?.['error'];
      if (error && typeof error === 'string') {
        return error;
      }
      return 'Service is not running';
    }

    if (backendDep.status === 'ok') {
      return 'Service is running normally';
    }

    const error = backendDep.metadata?.['error'];
    if (error && typeof error === 'string') {
      return error;
    }

    const reasonPhrase = backendDep.metadata?.['reasonPhrase'];
    if (reasonPhrase && typeof reasonPhrase === 'string') {
      return `${backendDep.status}: ${reasonPhrase}`;
    }

    return `Status: ${backendDep.status}`;
  }

  /**
   * Determine overall system status
   */
  private determineOverallStatus(isHealthy: boolean, dependencies: Record<string, BackendDependencyInfo>): 'healthy' | 'degraded' | 'critical' {
    if (isHealthy) {
      return 'healthy';
    }

    // Count offline services
    const services = Object.values(dependencies) as BackendDependencyInfo[];
    const offlineCount = services.filter(service => !service.isRunning).length;
    const totalCount = services.length;

    if (offlineCount === totalCount) {
      return 'critical';
    } else if (offlineCount > 0) {
      return 'degraded';
    }

    return 'degraded'; // Not healthy but not completely offline
  }

      /**
   * Handle HTTP errors
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Return a fallback result
      if (result !== undefined) {
        return of(result);
      }

            // For dependency status response, return fallback backend format
      if (operation === 'checkAllDependencies') {
        const fallbackBackendResponse: BackendDependencyResponse = {
          isHealthy: false,
          dependencies: {
            MSFS: {
              isRunning: false,
              status: 'unknown',
              metadata: { error: 'Unable to check status' }
            },
            RabbitMQ: {
              isRunning: false,
              status: 'unknown',
              metadata: { error: 'Unable to check status' }
            },
            SEQ: {
              isRunning: false,
              status: 'unknown',
              metadata: { error: 'Unable to check status' }
            }
          },
          checkedAt: new Date().toISOString()
        };

        return of(fallbackBackendResponse as T);
      }

      // For individual dependency checks
      const fallbackDependency: DependencyStatus = {
        name: 'Unknown Service',
        status: 'unknown',
        message: 'Unable to check status',
        lastChecked: new Date()
      };

      return of(fallbackDependency as T);
    };
  }

    /**
   * Get status icon based on dependency name (service-specific icons)
   */
  getStatusIcon(dependencyName: string): string {
    const name = dependencyName?.toLowerCase() || '';

    if (name.includes('msfs') || name.includes('flight simulator')) {
      return 'flight'; // Airplane for flight simulator
    }

    if (name.includes('rabbitmq')) {
      return 'compare_arrows'; // Message flow arrows for message broker
    }

    if (name.includes('seq')) {
      return 'list_alt'; // List icon for logs/events
    }

    // Fallback for unknown services
    return 'help';
  }

  /**
   * Get generic status icon based on status only (for fallback)
   */
  getGenericStatusIcon(status: string): string {
    switch (status) {
      case 'online':
        return 'check_circle';
      case 'offline':
        return 'error';
      case 'warning':
        return 'warning';
      case 'unknown':
      default:
        return 'help';
    }
  }

  /**
   * Get status class for styling
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'online':
        return 'ok';
      case 'offline':
        return 'error';
      case 'warning':
        return 'warning';
      case 'unknown':
      default:
        return 'info';
    }
  }
}
