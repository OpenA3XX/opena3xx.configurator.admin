import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface NetworkNode {
  id: string;
  name: string;
  type: 'hardware' | 'network' | 'simulator' | 'gateway';
  status: 'online' | 'offline' | 'warning' | 'error';
  position: { x: number; y: number };
  ipAddress: string;
  macAddress: string;
  connections: string[];
  properties?: { [key: string]: any };
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  type: 'ethernet' | 'wifi' | 'serial' | 'usb';
  status: 'active' | 'inactive' | 'error';
  bandwidth: number;
  latency: number;
}

export interface TopologyMap {
  nodes: NetworkNode[];
  links: NetworkLink[];
  scale: number;
  center: { x: number; y: number };
}

@Component({
  selector: 'opena3xx-network-topology-map',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatSliderModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './network-topology-map.component.html',
  styleUrls: ['./network-topology-map.component.scss']
})
export class NetworkTopologyMapComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  topology = signal<TopologyMap | null>(null);
  selectedNode = signal<string | null>(null);
  zoom = signal(1);
  showLabels = signal(true);

  // Computed properties
  onlineNodes = computed(() =>
    this.topology()?.nodes.filter(n => n.status === 'online') || []
  );

  offlineNodes = computed(() =>
    this.topology()?.nodes.filter(n => n.status === 'offline') || []
  );

  activeLinks = computed(() =>
    this.topology()?.links.filter(l => l.status === 'active') || []
  );

  isEmpty = computed(() => !this.topology() && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Refresh',
      icon: 'refresh',
      action: 'refresh',
      color: 'primary'
    },
    {
      label: 'Auto Layout',
      icon: 'auto_fix_high',
      action: 'auto-layout',
      color: 'accent'
    },
    {
      label: 'Export Map',
      icon: 'download',
      action: 'export-map',
      color: 'accent'
    }
  ]);

  constructor() {}

  ngOnInit(): void {
    this.loadNetworkTopology();
  }

  async loadNetworkTopology(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const nodes: NetworkNode[] = [
        {
          id: '1',
          name: 'Main Gateway',
          type: 'gateway',
          status: 'online',
          position: { x: 100, y: 100 },
          ipAddress: '192.168.1.1',
          macAddress: '00:11:22:33:44:55',
          connections: ['2', '3']
        },
        {
          id: '2',
          name: 'Hardware Panel 1',
          type: 'hardware',
          status: 'online',
          position: { x: 200, y: 150 },
          ipAddress: '192.168.1.100',
          macAddress: '00:11:22:33:44:56',
          connections: ['1', '4']
        },
        {
          id: '3',
          name: 'Network Switch',
          type: 'network',
          status: 'online',
          position: { x: 300, y: 100 },
          ipAddress: '192.168.1.10',
          macAddress: '00:11:22:33:44:57',
          connections: ['1', '5']
        },
        {
          id: '4',
          name: 'Simulator',
          type: 'simulator',
          status: 'warning',
          position: { x: 200, y: 250 },
          ipAddress: '192.168.1.200',
          macAddress: '00:11:22:33:44:58',
          connections: ['2']
        },
        {
          id: '5',
          name: 'Hardware Panel 2',
          type: 'hardware',
          status: 'offline',
          position: { x: 400, y: 150 },
          ipAddress: '192.168.1.101',
          macAddress: '00:11:22:33:44:59',
          connections: ['3']
        }
      ];

      const links: NetworkLink[] = [
        {
          id: '1',
          source: '1',
          target: '2',
          type: 'ethernet',
          status: 'active',
          bandwidth: 1000,
          latency: 5
        },
        {
          id: '2',
          source: '1',
          target: '3',
          type: 'ethernet',
          status: 'active',
          bandwidth: 1000,
          latency: 3
        },
        {
          id: '3',
          source: '2',
          target: '4',
          type: 'serial',
          status: 'active',
          bandwidth: 115200,
          latency: 50
        },
        {
          id: '4',
          source: '3',
          target: '5',
          type: 'ethernet',
          status: 'inactive',
          bandwidth: 1000,
          latency: 0
        }
      ];

      const topology: TopologyMap = {
        nodes,
        links,
        scale: 1,
        center: { x: 250, y: 175 }
      };

      this.topology.set(topology);
    } catch (err) {
      console.error('Error loading network topology:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onNodeClick(nodeId: string): void {
    this.selectedNode.set(this.selectedNode() === nodeId ? null : nodeId);
  }

  onZoomChange(value: number): void {
    this.zoom.set(value);
  }

  toggleLabels(): void {
    this.showLabels.update(show => !show);
  }

  autoLayout(): void {
    console.log('Applying auto layout...');
    // Implement auto layout algorithm
  }

  exportMap(): void {
    console.log('Exporting network topology map...');
    // Implement export functionality
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'refresh':
        this.loadNetworkTopology();
        break;
      case 'auto-layout':
        this.autoLayout();
        break;
      case 'export-map':
        this.exportMap();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get topologyMap(): TopologyMap | null {
    return this.topology();
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

  get currentZoom(): number {
    return this.zoom();
  }

  get showNodeLabels(): boolean {
    return this.showLabels();
  }

  get selectedNodeId(): string | null {
    return this.selectedNode();
  }

  get nodeIcon(): (type: string) => string {
    return (type: string) => {
      switch (type) {
        case 'gateway': return 'router';
        case 'hardware': return 'memory';
        case 'network': return 'hub';
        case 'simulator': return 'flight';
        default: return 'device_unknown';
      }
    };
  }

  get statusIcon(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'online': return 'check_circle';
        case 'offline': return 'cancel';
        case 'warning': return 'warning';
        case 'error': return 'error';
        default: return 'help';
      }
    };
  }

  get statusColor(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'online': return 'primary';
        case 'offline': return 'default';
        case 'warning': return 'accent';
        case 'error': return 'warn';
        default: return 'default';
      }
    };
  }
}
