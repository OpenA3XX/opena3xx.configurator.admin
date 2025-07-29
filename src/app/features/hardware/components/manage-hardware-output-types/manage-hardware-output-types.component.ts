import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { DataTableComponent, TableColumn, TableAction, TableConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { HardwareOutputTypeDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'opena3xx-manage-hardware-output-types',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DataTableComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './manage-hardware-output-types.component.html',
  styleUrls: ['./manage-hardware-output-types.component.scss']
})
export class ManageHardwareOutputTypesComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  outputTypes = signal<HardwareOutputTypeDto[]>([]);
  loading = signal(false);
  error = signal(false);
  selectedOutputType = signal<HardwareOutputTypeDto | null>(null);

  // Computed values
  isEmpty = computed(() => this.outputTypes().length === 0 && !this.loading() && !this.error());

  // Table configuration
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number', width: '80px', align: 'center' },
    { key: 'name', label: 'Name', type: 'text', sortable: true },
    { key: 'details', label: 'Details', type: 'text', sortable: true },
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
    searchPlaceholder: 'Search output types...',
    emptyMessage: 'No hardware output types found',
    loadingMessage: 'Loading hardware output types...'
  };

  pageActions: ActionButton[] = [
    {
      label: 'Add Output Type',
      icon: 'add',
      action: 'add',
      color: 'primary'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private hardwareService: HardwareService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOutputTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOutputTypes(): void {
    this.loading.set(true);
    this.error.set(false);

    this.hardwareService.getAllOutputTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (outputTypes) => {
        this.outputTypes.set(outputTypes);
        this.loading.set(false);
        this.snackBar.open('Hardware output types loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading hardware output types:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading hardware output types', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add':
        this.addHardwareOutputType();
        break;
    }
  }

  onTableAction(event: { action: string, row: HardwareOutputTypeDto }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.onViewOutputType(row.id);
        break;
      case 'edit':
        this.onEditOutputType(row.id);
        break;
      case 'delete':
        this.onDeleteOutputType(row.id);
        break;
    }
  }

  onRowClick(outputType: HardwareOutputTypeDto): void {
    this.selectedOutputType.set(outputType);
    this.onViewOutputType(outputType.id);
  }

  onRetry(): void {
    this.loadOutputTypes();
  }

  private addHardwareOutputType(): void {
    this.router.navigateByUrl('/add/hardware-output-type');
  }

  private onViewOutputType(id: number): void {
    // TODO: Implement view dialog or navigation
    console.log('View output type:', id);
  }

  private onEditOutputType(id: number): void {
    this.router.navigateByUrl(`/edit/hardware-output-type?id=${id}`);
  }

  private onDeleteOutputType(id: number): void {
    // TODO: Add confirmation dialog
    this.hardwareService.deleteOutputType(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Hardware output type deleted successfully', 'Close', {
          duration: 2000
        });
        this.loadOutputTypes();
      },
      error: (error) => {
        console.error('Error deleting hardware output type:', error);
        this.snackBar.open('Error deleting hardware output type', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
