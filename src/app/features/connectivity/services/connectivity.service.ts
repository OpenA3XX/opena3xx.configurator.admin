import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { ConfigurationService } from '../../../core/services/configuration.service';

export interface ConnectionStatus {
  id: number;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSeen: Date;
  ipAddress: string;
  port: number;
  latency?: number;
  errorMessage?: string;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  connections: NetworkConnection[];
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'gateway';
  status: 'online' | 'offline' | 'error';
  position: { x: number; y: number };
  metadata?: Record<string, any>;
}

export interface NetworkConnection {
  id: string;
  source: string;
  target: string;
  type: 'ethernet' | 'wifi' | 'serial';
  status: 'active' | 'inactive' | 'error';
  bandwidth?: number;
  latency?: number;
}

export interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  lastUpdate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService extends BaseApiService<ConnectionStatus> {
  protected override endpoint = 'connectivity';

  constructor(
    protected override http: HttpClient,
    protected override configurationService: ConfigurationService
  ) {
    super(http, configurationService);
  }

  // Connection Status Operations
  getAllConnections(): Observable<ConnectionStatus[]> {
    return this.getAll();
  }

  getConnectionById(id: number): Observable<ConnectionStatus> {
    return this.getById(id);
  }

  testConnection(id: number): Observable<ConnectionStatus> {
    return this.customPost<ConnectionStatus>(`/${id}/test`, {});
  }

  reconnectConnection(id: number): Observable<ConnectionStatus> {
    return this.customPost<ConnectionStatus>(`/${id}/reconnect`, {});
  }

  disconnectConnection(id: number): Observable<void> {
    return this.customDelete(`/${id}/disconnect`);
  }

  // Network Topology Operations
  getNetworkTopology(): Observable<NetworkTopology> {
    return this.customGet<NetworkTopology>('/topology');
  }

  updateNetworkTopology(topology: NetworkTopology): Observable<NetworkTopology> {
    return this.customPut<NetworkTopology>('/topology', topology);
  }

  // Diagnostic Operations
  runDiagnostics(): Observable<DiagnosticResult[]> {
    return this.customPost<DiagnosticResult[]>('/diagnostics', {});
  }

  runSpecificDiagnostic(test: string): Observable<DiagnosticResult> {
    return this.customPost<DiagnosticResult>(`/diagnostics/${test}`, {});
  }

  getDiagnosticHistory(limit?: number): Observable<DiagnosticResult[]> {
    const params = limit ? { limit: limit.toString() } : {};
    return this.customGet<DiagnosticResult[]>('/diagnostics/history', params);
  }

  // System Health Operations
  getSystemHealth(): Observable<SystemHealth> {
    return this.customGet<SystemHealth>('/health');
  }

  getSystemHealthHistory(hours: number = 24): Observable<SystemHealth[]> {
    return this.customGet<SystemHealth[]>('/health/history', { hours: hours.toString() });
  }

  // Connection Logs
  getConnectionLogs(connectionId?: number, limit?: number): Observable<any[]> {
    const params: Record<string, string> = {};
    if (connectionId) params['connectionId'] = connectionId.toString();
    if (limit) params['limit'] = limit.toString();
    return this.customGet<any[]>('/logs', params);
  }

  // Real-time Operations
  getConnectionStatusStream(): Observable<ConnectionStatus[]> {
    return this.customGet<ConnectionStatus[]>('/status/stream');
  }

  // Configuration Operations
  updateConnectionConfig(id: number, config: Record<string, any>): Observable<ConnectionStatus> {
    return this.customPatch<ConnectionStatus>(`/${id}/config`, config);
  }

  getConnectionConfig(id: number): Observable<Record<string, any>> {
    return this.customGet<Record<string, any>>(`/${id}/config`);
  }

  // Hardware Panel Matrix Operations
  getHardwarePanelMatrix(): Observable<any> {
    return this.customGet<any>('/hardware-panel-matrix');
  }

  updateHardwarePanelMatrix(matrix: any): Observable<any> {
    return this.customPut<any>('/hardware-panel-matrix', matrix);
  }

  // Network Configuration
  getNetworkConfiguration(): Observable<any> {
    return this.customGet<any>('/network/config');
  }

  updateNetworkConfiguration(config: any): Observable<any> {
    return this.customPut<any>('/network/config', config);
  }

  // Validation Operations
  validateConfiguration(): Observable<any> {
    return this.customPost<any>('/validation', {});
  }

  getValidationResults(): Observable<any[]> {
    return this.customGet<any[]>('/validation/results');
  }
}
