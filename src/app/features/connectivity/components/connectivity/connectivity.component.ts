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
  lastSeen?: Date;
  latency?: number;
  signalStrength?: number;
  ipAddress?: string;
  port?: number;
}

@Component({
  selector: 'opena3xx-connectivity',
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
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.scss']
})
export class ConnectivityComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  connections = signal<ConnectionStatus[]>([]);
  filters = signal({
    type: 'all',
    status: 'all',
    search: ''
  });

  // Computed properties
  filteredConnections = computed(() => {
    let filtered = this.connections();

    if (this.filters().type !== 'all') {
      filtered = filtered.filter(c => c.type === this.filters().type);
    }

    if (this.filters().status !== 'all') {
      filtered = filtered.filter(c => c.status === this.filters().status);
    }

    if (this.filters().search) {
      const search = this.filters().search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.ipAddress?.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  isEmpty = computed(() => this.filteredConnections().length === 0 && !this.loading() && !this.error());

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
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadConnections();
  }

  async loadConnections(): Promise<void> {
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
          lastSeen: new Date(),
          latency: 15,
          signalStrength: 85,
          ipAddress: '192.168.1.100',
          port: 8080
        },
        {
          id: '2',
          name: 'Network Device 1',
          type: 'network',
          status: 'connected',
          lastSeen: new Date(),
          latency: 25,
          signalStrength: 92,
          ipAddress: '192.168.1.101',
          port: 9090
        },
        {
          id: '3',
          name: 'Simulator Connection',
          type: 'simulator',
          status: 'connecting',
          lastSeen: new Date(Date.now() - 30000),
          latency: undefined,
          signalStrength: undefined,
          ipAddress: '192.168.1.102',
          port: 7070
        }
      ];
      this.connections.set(connections);
    } catch (err) {
      console.error('Error loading connections:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: any): void {
    this.filters.set(filters);
  }

  onConnectionAction(connection: ConnectionStatus, action: string): void {
    switch (action) {
      case 'connect':
        this.connectToDevice(connection.id);
        break;
      case 'disconnect':
        this.disconnectFromDevice(connection.id);
        break;
      case 'diagnose':
        this.diagnoseConnection(connection.id);
        break;
      default:
        console.log(`Unknown action: ${action} for connection: ${connection.id}`);
    }
  }

  connectToDevice(connectionId: string): void {
    console.log('Connecting to device:', connectionId);
    // Implement connection logic
  }

  disconnectFromDevice(connectionId: string): void {
    console.log('Disconnecting from device:', connectionId);
    // Implement disconnection logic
  }

  diagnoseConnection(connectionId: string): void {
    console.log('Running diagnostics for connection:', connectionId);
    // Implement diagnostics logic
  }

  runDiagnostics(): void {
    console.log('Running system-wide diagnostics...');
    // Implement system diagnostics
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadConnections();
        break;
      case 'diagnostics':
        this.runDiagnostics();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get connectionList(): ConnectionStatus[] {
    return this.filteredConnections();
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

  get connectedCount(): number {
    return this.connections().filter(c => c.status === 'connected').length;
  }

  get totalCount(): number {
    return this.connections().length;
  }

  get typeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'network', label: 'Network' },
      { value: 'simulator', label: 'Simulator' }
    ];
  }

  get statusOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Status' },
      { value: 'connected', label: 'Connected' },
      { value: 'disconnected', label: 'Disconnected' },
      { value: 'connecting', label: 'Connecting' },
      { value: 'error', label: 'Error' }
    ];
  }
}
