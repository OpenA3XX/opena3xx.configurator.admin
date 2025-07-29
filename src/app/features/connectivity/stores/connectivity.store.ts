import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, switchMap, catchError, of } from 'rxjs';
import { ConnectionStatus, NetworkTopology, DiagnosticResult, SystemHealth } from '../services/connectivity.service';
import { ConnectivityService } from '../services/connectivity.service';

export interface ConnectivityState {
  connections: ConnectionStatus[];
  topology: NetworkTopology | null;
  diagnostics: DiagnosticResult[];
  systemHealth: SystemHealth | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isConnected: boolean;
}

export interface ConnectivityFilters {
  searchTerm: string;
  status: string | null;
  connectionType: string | null;
  timeRange: { start: Date; end: Date } | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectivityStore {
  // State signals
  private _state = signal<ConnectivityState>({
    connections: [],
    topology: null,
    diagnostics: [],
    systemHealth: null,
    loading: false,
    error: null,
    lastUpdated: null,
    isConnected: false
  });

  private _filters = signal<ConnectivityFilters>({
    searchTerm: '',
    status: null,
    connectionType: null,
    timeRange: null
  });

  // Public state signals
  readonly state = this._state.asReadonly();
  readonly filters = this._filters.asReadonly();

  // Computed selectors
  readonly connections = computed(() => this.state().connections);
  readonly topology = computed(() => this.state().topology);
  readonly diagnostics = computed(() => this.state().diagnostics);
  readonly systemHealth = computed(() => this.state().systemHealth);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly lastUpdated = computed(() => this.state().lastUpdated);
  readonly isConnected = computed(() => this.state().isConnected);

  // Filtered data
  readonly filteredConnections = computed(() => {
    const connections = this.connections();
    const filters = this.filters();

    return connections.filter(connection => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!connection.name.toLowerCase().includes(searchLower) &&
            !connection.ipAddress.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.status && connection.status !== filters.status) {
        return false;
      }

      if (filters.timeRange) {
        const connectionTime = new Date(connection.lastSeen);
        if (connectionTime < filters.timeRange.start || connectionTime > filters.timeRange.end) {
          return false;
        }
      }

      return true;
    });
  });

  readonly filteredDiagnostics = computed(() => {
    const diagnostics = this.diagnostics();
    const filters = this.filters();

    return diagnostics.filter(diagnostic => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!diagnostic.test.toLowerCase().includes(searchLower) &&
            !diagnostic.message.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.status && diagnostic.status !== filters.status) {
        return false;
      }

      if (filters.timeRange) {
        const diagnosticTime = new Date(diagnostic.timestamp);
        if (diagnosticTime < filters.timeRange.start || diagnosticTime > filters.timeRange.end) {
          return false;
        }
      }

      return true;
    });
  });

  // Grouped data
  readonly connectionsByStatus = computed(() => {
    const connections = this.connections();
    const grouped = new Map<string, ConnectionStatus[]>();

    connections.forEach(connection => {
      const status = connection.status;
      if (!grouped.has(status)) {
        grouped.set(status, []);
      }
      grouped.get(status)!.push(connection);
    });

    return grouped;
  });

  readonly diagnosticsByStatus = computed(() => {
    const diagnostics = this.diagnostics();
    const grouped = new Map<string, DiagnosticResult[]>();

    diagnostics.forEach(diagnostic => {
      const status = diagnostic.status;
      if (!grouped.has(status)) {
        grouped.set(status, []);
      }
      grouped.get(status)!.push(diagnostic);
    });

    return grouped;
  });

  // Statistics
  readonly stats = computed(() => {
    const connections = this.connections();
    const diagnostics = this.diagnostics();
    const systemHealth = this.systemHealth();

    return {
      totalConnections: connections.length,
      connectedConnections: connections.filter(c => c.status === 'connected').length,
      disconnectedConnections: connections.filter(c => c.status === 'disconnected').length,
      errorConnections: connections.filter(c => c.status === 'error').length,
      totalDiagnostics: diagnostics.length,
      passedDiagnostics: diagnostics.filter(d => d.status === 'pass').length,
      failedDiagnostics: diagnostics.filter(d => d.status === 'fail').length,
      warningDiagnostics: diagnostics.filter(d => d.status === 'warning').length,
      systemHealth: systemHealth ? {
        cpu: systemHealth.cpu,
        memory: systemHealth.memory,
        disk: systemHealth.disk,
        network: systemHealth.network,
        uptime: systemHealth.uptime
      } : null,
      averageLatency: connections.length > 0
        ? connections.reduce((sum, c) => sum + (c.latency || 0), 0) / connections.length
        : 0
    };
  });

  constructor(private connectivityService: ConnectivityService) {
    // Set up effects for automatic data refresh and real-time updates
    this.setupEffects();
  }

  // Actions
  setLoading(loading: boolean): void {
    this._state.update(state => ({ ...state, loading, error: null }));
  }

  setError(error: string): void {
    this._state.update(state => ({ ...state, error, loading: false }));
  }

  setConnectionStatus(isConnected: boolean): void {
    this._state.update(state => ({ ...state, isConnected }));
  }

  setFilters(filters: Partial<ConnectivityFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({
      searchTerm: '',
      status: null,
      connectionType: null,
      timeRange: null
    });
  }

  // Data loading actions
  loadConnections(): void {
    this.setLoading(true);

    this.connectivityService.getAllConnections().subscribe({
      next: (connections) => {
        this._state.update(state => ({
          ...state,
          connections,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load connections');
      }
    });
  }

  loadTopology(): void {
    this.setLoading(true);

    this.connectivityService.getNetworkTopology().subscribe({
      next: (topology) => {
        this._state.update(state => ({
          ...state,
          topology,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load network topology');
      }
    });
  }

  loadDiagnostics(): void {
    this.setLoading(true);

    this.connectivityService.runDiagnostics().subscribe({
      next: (diagnostics) => {
        this._state.update(state => ({
          ...state,
          diagnostics,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to run diagnostics');
      }
    });
  }

  loadSystemHealth(): void {
    this.setLoading(true);

    this.connectivityService.getSystemHealth().subscribe({
      next: (systemHealth) => {
        this._state.update(state => ({
          ...state,
          systemHealth,
          loading: false,
          error: null,
          lastUpdated: new Date()
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load system health');
      }
    });
  }

  // Real-time operations
  startConnectionStatusStream(): void {
    this.connectivityService.getConnectionStatusStream().subscribe({
      next: (connections) => {
        this._state.update(state => ({
          ...state,
          connections,
          lastUpdated: new Date(),
          isConnected: true
        }));
      },
      error: (error) => {
        this.setConnectionStatus(false);
        this.setError(error.message || 'Connection status stream disconnected');
      }
    });
  }

  // CRUD operations
  testConnection(id: number): Observable<ConnectionStatus> {
    return this.connectivityService.testConnection(id).pipe(
      switchMap((connection) => {
        this.loadConnections();
        return of(connection);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to test connection');
        throw error;
      })
    );
  }

  reconnectConnection(id: number): Observable<ConnectionStatus> {
    return this.connectivityService.reconnectConnection(id).pipe(
      switchMap((connection) => {
        this.loadConnections();
        return of(connection);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to reconnect');
        throw error;
      })
    );
  }

  disconnectConnection(id: number): Observable<void> {
    return this.connectivityService.disconnectConnection(id).pipe(
      switchMap(() => {
        this.loadConnections();
        return of(void 0);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to disconnect');
        throw error;
      })
    );
  }

  updateConnectionConfig(id: number, config: Record<string, any>): Observable<ConnectionStatus> {
    return this.connectivityService.updateConnectionConfig(id, config).pipe(
      switchMap((connection) => {
        this.loadConnections();
        return of(connection);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update connection config');
        throw error;
      })
    );
  }

  updateNetworkTopology(topology: NetworkTopology): Observable<NetworkTopology> {
    return this.connectivityService.updateNetworkTopology(topology).pipe(
      switchMap((updatedTopology) => {
        this._state.update(state => ({
          ...state,
          topology: updatedTopology,
          lastUpdated: new Date()
        }));
        return of(updatedTopology);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to update network topology');
        throw error;
      })
    );
  }

  // Diagnostic operations
  runSpecificDiagnostic(test: string): Observable<DiagnosticResult> {
    return this.connectivityService.runSpecificDiagnostic(test).pipe(
      switchMap((diagnostic) => {
        this.loadDiagnostics();
        return of(diagnostic);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to run specific diagnostic');
        throw error;
      })
    );
  }

  getDiagnosticHistory(limit?: number): Observable<DiagnosticResult[]> {
    return this.connectivityService.getDiagnosticHistory(limit);
  }

  // System operations
  getSystemHealthHistory(hours: number = 24): Observable<SystemHealth[]> {
    return this.connectivityService.getSystemHealthHistory(hours);
  }

  // Validation operations
  validateConfiguration(): Observable<any> {
    return this.connectivityService.validateConfiguration().pipe(
      switchMap((validation) => {
        // Update state with validation results
        return of(validation);
      }),
      catchError((error) => {
        this.setError(error.message || 'Failed to validate configuration');
        throw error;
      })
    );
  }

  getValidationResults(): Observable<any[]> {
    return this.connectivityService.getValidationResults();
  }

  // Cache management
  clearCache(): void {
    this._state.update(state => ({
      ...state,
      connections: [],
      topology: null,
      diagnostics: [],
      systemHealth: null,
      lastUpdated: null
    }));
  }

  refreshData(): void {
    this.loadConnections();
    this.loadTopology();
    this.loadDiagnostics();
    this.loadSystemHealth();
  }

  // Private methods
  private setupEffects(): void {
    // Auto-refresh data every 60 seconds if connected
    effect(() => {
      const isConnected = this.isConnected();
      const lastUpdated = this.lastUpdated();

      if (isConnected && lastUpdated) {
        const timeSinceUpdate = Date.now() - lastUpdated.getTime();
        const sixtySeconds = 60 * 1000;

        if (timeSinceUpdate > sixtySeconds) {
          this.refreshData();
        }
      }
    });

    // Start real-time streams when component initializes
    effect(() => {
      const isConnected = this.isConnected();
      if (isConnected) {
        this.startConnectionStatusStream();
      }
    });
  }
}
