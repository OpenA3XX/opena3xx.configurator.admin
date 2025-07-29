import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { DataTableComponent, TableColumn, TableAction, TableConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { HardwareBoardDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'opena3xx-manage-hardware-boards',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DataTableComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './manage-hardware-board.component.html',
  styleUrls: ['./manage-hardware-board.component.scss']
})
export class ManageHardwareBoardsComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  boards = signal<HardwareBoardDto[]>([]);
  loading = signal(false);
  error = signal(false);
  selectedBoard = signal<HardwareBoardDto | null>(null);

  // Computed values
  isEmpty = computed(() => this.boards().length === 0 && !this.loading() && !this.error());

  // Table configuration
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number', width: '80px', align: 'center' },
    { key: 'name', label: 'Name', type: 'text', sortable: true },
    { key: 'hardwareBusExtendersCount', label: 'Bus Extenders', type: 'number', sortable: true, align: 'center' },
    { key: 'totalInputOutputs', label: 'Total I/O', type: 'number', sortable: true, align: 'center' },
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
    searchPlaceholder: 'Search hardware boards...',
    emptyMessage: 'No hardware boards found',
    loadingMessage: 'Loading hardware boards...'
  };

  pageActions: ActionButton[] = [
    {
      label: 'Register Board',
      icon: 'add',
      action: 'register',
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
    this.loadBoards();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoards(): void {
    this.loading.set(true);
    this.error.set(false);

    this.hardwareService.getAllBoards().pipe(takeUntil(this.destroy$)).subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.loading.set(false);
        this.snackBar.open('Hardware boards loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading hardware boards:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading hardware boards', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'register':
        this.registerHardwareBoard();
        break;
    }
  }

  onTableAction(event: { action: string, row: HardwareBoardDto }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.onViewBoard(row.id);
        break;
      case 'edit':
        this.onEditBoard(row.id);
        break;
      case 'delete':
        this.onDeleteBoard(row.id);
        break;
    }
  }

  onRowClick(board: HardwareBoardDto): void {
    this.selectedBoard.set(board);
    this.onViewBoard(board.id);
  }

  onRetry(): void {
    this.loadBoards();
  }

  private registerHardwareBoard(): void {
    this.router.navigateByUrl('/register/hardware-board');
  }

  private onViewBoard(id: number): void {
    // TODO: Implement view dialog or navigation
    console.log('View board:', id);
  }

  private onEditBoard(id: number): void {
    // TODO: Implement edit functionality
    console.log('Edit board:', id);
  }

  private onDeleteBoard(id: number): void {
    // TODO: Add confirmation dialog
    this.hardwareService.deleteBoard(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Hardware board deleted successfully', 'Close', {
          duration: 2000
        });
        this.loadBoards();
      },
      error: (error) => {
        console.error('Error deleting hardware board:', error);
        this.snackBar.open('Error deleting hardware board', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
