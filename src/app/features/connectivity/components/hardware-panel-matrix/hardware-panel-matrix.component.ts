import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';

export interface HardwarePanel {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  inputs: number;
  outputs: number;
  lastActivity: Date;
  uptime: string;
  health: number;
  location?: string;
  ipAddress?: string;
}

export interface PanelMatrix {
  rows: number;
  columns: number;
  panels: HardwarePanel[];
  layout: 'grid' | 'list' | 'table';
}

@Component({
  selector: 'opena3xx-hardware-panel-matrix',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './hardware-panel-matrix.component.html',
  styleUrls: ['./hardware-panel-matrix.component.scss']
})
export class HardwarePanelMatrixComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  matrix = signal<PanelMatrix | null>(null);
  selectedPanels = signal<string[]>([]);
  filters = signal({
    status: 'all',
    type: 'all',
    search: ''
  });

  // Computed properties
  filteredPanels = computed(() => {
    if (!this.matrix()) return [];

    let filtered = this.matrix()!.panels;

    if (this.filters().status !== 'all') {
      filtered = filtered.filter(p => p.status === this.filters().status);
    }

    if (this.filters().type !== 'all') {
      filtered = filtered.filter(p => p.type === this.filters().type);
    }

    if (this.filters().search) {
      const search = this.filters().search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.location?.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  isEmpty = computed(() => this.filteredPanels().length === 0 && !this.loading() && !this.error());

  // Page actions
  pageActions = signal<ActionButton[]>([
    {
      label: 'Add Panel',
      icon: 'add',
      action: 'add-panel',
      color: 'primary'
    },
    {
      label: 'Bulk Actions',
      icon: 'more_vert',
      action: 'bulk-actions',
      color: 'accent'
    },
    {
      label: 'Export Matrix',
      icon: 'download',
      action: 'export-matrix',
      color: 'accent'
    }
  ]);

  // Table columns
  displayedColumns = signal(['select', 'name', 'type', 'status', 'inputs', 'outputs', 'health', 'lastActivity', 'actions']);

  constructor() {}

  ngOnInit(): void {
    this.loadHardwarePanelMatrix();
  }

  async loadHardwarePanelMatrix(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const panels: HardwarePanel[] = [
        {
          id: '1',
          name: 'Main Control Panel',
          type: 'control',
          status: 'active',
          inputs: 24,
          outputs: 16,
          lastActivity: new Date(),
          uptime: '48h 15m',
          health: 95,
          location: 'Cockpit',
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          name: 'Auxiliary Panel A',
          type: 'auxiliary',
          status: 'active',
          inputs: 12,
          outputs: 8,
          lastActivity: new Date(Date.now() - 300000),
          uptime: '24h 30m',
          health: 87,
          location: 'Cabin',
          ipAddress: '192.168.1.101'
        },
        {
          id: '3',
          name: 'Emergency Panel',
          type: 'emergency',
          status: 'inactive',
          inputs: 6,
          outputs: 4,
          lastActivity: new Date(Date.now() - 3600000),
          uptime: '0h 0m',
          health: 100,
          location: 'Emergency Bay',
          ipAddress: '192.168.1.102'
        },
        {
          id: '4',
          name: 'Navigation Panel',
          type: 'navigation',
          status: 'error',
          inputs: 18,
          outputs: 12,
          lastActivity: new Date(Date.now() - 1800000),
          uptime: '12h 45m',
          health: 45,
          location: 'Navigation Bay',
          ipAddress: '192.168.1.103'
        }
      ];

      const matrix: PanelMatrix = {
        rows: 2,
        columns: 2,
        panels,
        layout: 'grid'
      };

      this.matrix.set(matrix);
    } catch (err) {
      console.error('Error loading hardware panel matrix:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  onFiltersChange(filters: any): void {
    this.filters.set(filters);
  }

  onPanelSelectionChange(selectedIds: string[]): void {
    this.selectedPanels.set(selectedIds);
  }

  addPanel(): void {
    console.log('Opening add panel dialog...');
    // Open add panel dialog
  }

  editPanel(panel: HardwarePanel): void {
    console.log('Opening edit panel dialog for:', panel.id);
    // Open edit panel dialog
  }

  deletePanel(panel: HardwarePanel): void {
    console.log('Opening delete confirmation for:', panel.id);
    // Open delete confirmation dialog
  }

  togglePanelStatus(panel: HardwarePanel): void {
    const newStatus = panel.status === 'active' ? 'inactive' : 'active';
    console.log(`Toggling panel ${panel.id} status to: ${newStatus}`);
    // Implement status toggle logic
  }

  showBulkActions(): void {
    console.log('Showing bulk actions for:', this.selectedPanels().length, 'panels');
    // Show bulk actions menu
  }

  exportMatrix(): void {
    console.log('Exporting hardware panel matrix...');
    // Implement export functionality
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add-panel':
        this.addPanel();
        break;
      case 'bulk-actions':
        this.showBulkActions();
        break;
      case 'export-matrix':
        this.exportMatrix();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }

  // Getters for template
  get panelList(): HardwarePanel[] {
    return this.filteredPanels();
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

  get selectedPanelCount(): number {
    return this.selectedPanels().length;
  }

  get hasSelectedPanels(): boolean {
    return this.selectedPanels().length > 0;
  }

  get statusOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'error', label: 'Error' },
      { value: 'maintenance', label: 'Maintenance' }
    ];
  }

  get typeOptions(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'control', label: 'Control' },
      { value: 'auxiliary', label: 'Auxiliary' },
      { value: 'emergency', label: 'Emergency' },
      { value: 'navigation', label: 'Navigation' }
    ];
  }

  get statusIcon(): (status: string) => string {
    return (status: string) => {
      switch (status) {
        case 'active': return 'check_circle';
        case 'inactive': return 'cancel';
        case 'error': return 'error';
        case 'maintenance': return 'build';
        default: return 'help';
      }
    };
  }

  get healthColor(): (health: number) => string {
    return (health: number) => {
      if (health >= 80) return 'primary';
      if (health >= 50) return 'accent';
      return 'warn';
    };
  }
}
