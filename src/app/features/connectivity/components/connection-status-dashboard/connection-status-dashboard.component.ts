import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface ConnectionStatus {
  id: string;
  name: string;
  type: 'hardware' | 'network' | 'simulator';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  health: number; // 0-100
  latency: number;
  throughput: number;
  lastSeen: Date;
  uptime: string;
  alerts: number;
}

export interface SystemMetrics {
  totalConnections: number;
  activeConnections: number;
  averageLatency: number;
  totalThroughput: number;
  systemHealth: number;
  alerts: number;
}

@Component({
  selector: 'opena3xx-connection-status-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatMenuModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './connection-status-dashboard.component.html',
  styleUrls: ['./connection-status-dashboard.component.scss']
})
export class ConnectionStatusDashboardComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  connections = signal<ConnectionStatus[]>([]);
  metrics = signal<SystemMetrics | null>(null);

  // Computed properties
  healthyConnections = computed(() =>
    this.connections().filter(c => c.health >= 80)
  );

  warningConnections = computed(() =>
    this.connections().filter(c => c.health >= 50 && c.health < 80)
  );

  criticalConnections = computed(() =>
    this.connections().filter(c => c.health < 50)
  );

  isEmpty = computed(() => this.connections().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Diagnostics',
      icon: 'build',
      action: 'diagnostics',
      color: 'accent'
    },
    {
      label: 'Export Report',
      icon: 'download',
      action: 'export-report',
      color: 'accent'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadConnectionStatus();
  }

  async loadConnectionStatus(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const connections: ConnectionStatus[] = [
        {
          id: '1',
          name: 'Hardware Panel 1',
          type: 'hardware',
          status: 'connected',
          health: 95,
          latency: 15,
          throughput: 1024,
          lastSeen: new Date(),
          uptime: '24h 30m',
          alerts: 0
        },
        {
          id: '2',
          name: 'Network Device 1',
          type: 'network',
          status: 'connected',
          health: 87,
          latency: 25,
          throughput: 2048,
          lastSeen: new Date(),
          uptime: '12h 45m',
          alerts: 1
        },
        {
          id: '3',
          name: 'Simulator Connection',
          type: 'simulator',
          status: 'connecting',
          health: 45,
          latency: 150,
          throughput: 512,
          lastSeen: new Date(Date.now() - 30000),
          uptime: '2h 15m',
          alerts: 3
        },
        {
          id: '4',
          name: 'Hardware Panel 2',
          type: 'hardware',
          status: 'error',
          health: 20,
          latency: 0,
          throughput: 0,
          lastSeen: new Date(Date.now() - 600000),
          uptime: '0h 0m',
          alerts: 5
        }
      ];

      const metrics: SystemMetrics = {
        totalConnections: connections.length,
        activeConnections: connections.filter(c => c.status === 'connected').length,
        averageLatency: Math.round(connections.reduce((sum, c) => sum + c.latency, 0) / connections.length),
        totalThroughput: connections.reduce((sum, c) => sum + c.throughput, 0),
        systemHealth: Math.round(connections.reduce((sum, c) => sum + c.health, 0) / connections.length),
        alerts: connections.reduce((sum, c) => sum + c.alerts, 0)
      };

      this.connections.set(connections);
      this.metrics.set(metrics);
    } catch (err) {
      console.error('Error loading connection status:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onConnectionAction(connection: ConnectionStatus, action: string): void {
    switch (action) {
      case 'reconnect':
        this.reconnectConnection(connection.id);
        break;
      case 'diagnose':
        this.diagnoseConnection(connection.id);
        break;
      case 'details':
        this.viewConnectionDetails(connection.id);
        break;
      default:
        console.log(`Unknown action: ${action} for connection: ${connection.id}`);
    }
  }

  reconnectConnection(connectionId: string): void {
    console.log('Reconnecting to:', connectionId);
    // Implement reconnection logic
  }

  diagnoseConnection(connectionId: string): void {
    console.log('Running diagnostics for:', connectionId);
    // Implement diagnostics logic
  }

  viewConnectionDetails(connectionId: string): void {
    console.log('Viewing details for:', connectionId);
    // Open connection details dialog
  }

  runDiagnostics(): void {
    console.log('Running system diagnostics...');
    // Implement system diagnostics
  }

  exportReport(): void {
    console.log('Exporting connection status report...');
    // Implement export functionality
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadConnectionStatus();
        break;
      case 'diagnostics':
        this.runDiagnostics();
        break;
      case 'export-report':
        this.exportReport();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get connectionList(): ConnectionStatus[] {
    return this.connections();
  }

  get systemMetrics(): SystemMetrics | null {
    return this.metrics();
  }

  get pageActionButtons(): ActionButton[] {
    return this.pageActions();
  }

  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return this.error();
  }

  get isEmptyState(): boolean {
    return this.isEmpty();
  }

  get healthyConnectionCount(): number {
    return this.healthyConnections().length;
  }

  get warningConnectionCount(): number {
    return this.warningConnections().length;
  }

  get criticalConnectionCount(): number {
    return this.criticalConnections().length;
  }

  get healthColor(): (health: number) => string {
    return (health: number) => {
      if (health >= 80) return 'primary';
      if (health >= 50) return 'accent';
      return 'warn';
    };
  }

  get statusIcon(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'connected': return 'check_circle';
        case 'connecting': return 'sync';
        case 'disconnected': return 'cancel';
        case 'error': return 'error';
        default: return 'help';
      }
    };
  }
}
