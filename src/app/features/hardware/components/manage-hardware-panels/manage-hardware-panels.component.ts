import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { DataTableComponent, TableColumn, TableAction, TableConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { HardwarePanelOverviewDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'opena3xx-manage-hardware-panels',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DataTableComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './manage-hardware-panels.component.html',
  styleUrls: ['./manage-hardware-panels.component.scss']
})
export class ManageHardwarePanelsComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  panels = signal<HardwarePanelOverviewDto[]>([]);
  loading = signal(false);
  error = signal(false);
  selectedPanel = signal<HardwarePanelOverviewDto | null>(null);

  // Computed values
  isEmpty = computed(() => this.panels().length === 0 && !this.loading() && !this.error());

  // Table configuration
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number', width: '80px', align: 'center' },
    { key: 'name', label: 'Name', type: 'text', sortable: true },
    { key: 'cockpitArea', label: 'Cockpit Area', type: 'text', sortable: true },
    { key: 'aircraftModel', label: 'Aircraft Model', type: 'text' },
    { key: 'manufacturer', label: 'Manufacturer', type: 'text' },
    { key: 'owner', label: 'Cockpit Owner', type: 'text', sortable: true },
    { key: 'actions', label: 'Actions', type: 'action', width: '120px', align: 'center' }
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'visibility',
      action: 'view',
      color: 'primary'
    },
    {
      label: 'Edit',
      icon: 'edit',
      action: 'edit',
      color: 'accent'
    },
    {
      label: 'Delete',
      icon: 'delete',
      action: 'delete',
      color: 'warn'
    }
  ];

  tableConfig: TableConfig = {
    showSearch: true,
    showPagination: true,
    showSorting: true,
    showActions: true,
    pageSizeOptions: [5, 10, 25, 50, 100],
    defaultPageSize: 10,
    searchPlaceholder: 'Search hardware panels...',
    emptyMessage: 'No hardware panels found',
    loadingMessage: 'Loading hardware panels...'
  };

  pageActions: ActionButton[] = [
    {
      label: 'Add Hardware Panel',
      icon: 'add',
      action: 'add',
      color: 'primary'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private hardwareService: HardwareService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPanels();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPanels(): void {
    this.loading.set(true);
    this.error.set(false);

    this.hardwareService.getAllPanels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (panels) => {
        this.panels.set(panels);
        this.loading.set(false);
        this.snackBar.open('Hardware panels loaded successfully', 'OK', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error loading hardware panels:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading hardware panels', 'OK', { duration: 3000 });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add':
        this.addHardwarePanel();
        break;
    }
  }

  onTableAction(event: { action: string, row: HardwarePanelOverviewDto }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.viewPanelDetails(row.id);
        break;
      case 'edit':
        this.editPanel(row.id);
        break;
      case 'delete':
        this.deletePanel(row.id);
        break;
    }
  }

  onRowClick(panel: HardwarePanelOverviewDto): void {
    this.selectedPanel.set(panel);
    this.viewPanelDetails(panel.id);
  }

  onRetry(): void {
    this.loadPanels();
  }

  private addHardwarePanel(): void {
    this.router.navigateByUrl('/add/hardware-panel');
  }

  private viewPanelDetails(id: number): void {
    this.router.navigateByUrl(`/view/hardware-panel-details?id=${id}`);
  }

  private editPanel(id: number): void {
    this.router.navigateByUrl(`/edit/hardware-panel?id=${id}`);
  }

  private deletePanel(id: number): void {
    // TODO: Implement delete confirmation dialog
    this.snackBar.open('Delete functionality not yet implemented', 'OK', { duration: 2000 });
  }
}
