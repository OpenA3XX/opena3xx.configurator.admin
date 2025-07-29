import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { DataTableComponent, TableColumn, TableAction, TableConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { HardwareInputTypeDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'opena3xx-manage-hardware-input-types',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DataTableComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './manage-hardware-input-types.component.html',
  styleUrls: ['./manage-hardware-input-types.component.scss']
})
export class ManageHardwareInputTypesComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  inputTypes = signal<HardwareInputTypeDto[]>([]);
  loading = signal(false);
  error = signal(false);
  selectedInputType = signal<HardwareInputTypeDto | null>(null);

  // Computed values
  isEmpty = computed(() => this.inputTypes().length === 0 && !this.loading() && !this.error());

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
    searchPlaceholder: 'Search input types...',
    emptyMessage: 'No hardware input types found',
    loadingMessage: 'Loading hardware input types...'
  };

  pageActions: ActionButton[] = [
    {
      label: 'Add Input Type',
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
    this.loadInputTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInputTypes(): void {
    this.loading.set(true);
    this.error.set(false);

    this.hardwareService.getAllInputTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (inputTypes) => {
        this.inputTypes.set(inputTypes);
        this.loading.set(false);
        this.snackBar.open('Hardware input types loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading hardware input types:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading hardware input types', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add':
        this.addHardwareInputType();
        break;
    }
  }

  onTableAction(event: { action: string, row: HardwareInputTypeDto }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.onViewInputType(row.id);
        break;
      case 'edit':
        this.onEditInputType(row.id);
        break;
      case 'delete':
        this.onDeleteInputType(row.id);
        break;
    }
  }

  onRowClick(inputType: HardwareInputTypeDto): void {
    this.selectedInputType.set(inputType);
    this.onViewInputType(inputType.id);
  }

  onRetry(): void {
    this.loadInputTypes();
  }

  private addHardwareInputType(): void {
    this.router.navigateByUrl('/add/hardware-input-type');
  }

  private onViewInputType(id: number): void {
    // TODO: Implement view dialog or navigation
    console.log('View input type:', id);
  }

  private onEditInputType(id: number): void {
    this.router.navigateByUrl(`/edit/hardware-input-type?id=${id}`);
  }

  private onDeleteInputType(id: number): void {
    // TODO: Add confirmation dialog
    this.hardwareService.deleteInputType(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Hardware input type deleted successfully', 'Close', {
          duration: 2000
        });
        this.loadInputTypes();
      },
      error: (error) => {
        console.error('Error deleting hardware input type:', error);
        this.snackBar.open('Error deleting hardware input type', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
