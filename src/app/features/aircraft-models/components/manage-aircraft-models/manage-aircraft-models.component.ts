import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { DataTableComponent, TableColumn, TableAction, TableConfig } from '../../../../shared/components/ui/data-table/data-table.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { AircraftModelDto } from '../../../../shared/models/models';
import { AircraftService } from '../../services/aircraft.service';
import { ViewAircraftModelDialogComponent } from '../view-aircraft-model-dialog/view-aircraft-model-dialog.component';
import { EditAircraftModelDialogComponent } from '../edit-aircraft-model-dialog/edit-aircraft-model-dialog.component';
import { AddAircraftModelDialogComponent } from '../add-aircraft-model-dialog/add-aircraft-model-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'opena3xx-manage-aircraft-models',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    DataTableComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './manage-aircraft-models.component.html',
  styleUrls: ['./manage-aircraft-models.component.scss']
})
export class ManageAircraftModelsComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  aircraftModels = signal<AircraftModelDto[]>([]);
  loading = signal(false);
  error = signal(false);
  selectedAircraftModel = signal<AircraftModelDto | null>(null);

  // Computed values
  isEmpty = computed(() => this.aircraftModels().length === 0 && !this.loading() && !this.error());

  // Table configuration
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'number', width: '80px', align: 'center' },
    { key: 'name', label: 'Name', type: 'text', sortable: true },
    { key: 'manufacturer', label: 'Manufacturer', type: 'text', sortable: true },
    { key: 'type', label: 'Type', type: 'text', sortable: true },
    {
      key: 'isActive',
      label: 'Status',
      type: 'boolean',
      width: '100px',
      align: 'center',
      formatter: (value: boolean) => value ? 'Active' : 'Inactive'
    },
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
    searchPlaceholder: 'Search aircraft models...',
    emptyMessage: 'No aircraft models found',
    loadingMessage: 'Loading aircraft models...'
  };

  pageActions: ActionButton[] = [
    {
      label: 'Add Aircraft Model',
      icon: 'add',
      action: 'add',
      color: 'primary'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private aircraftService: AircraftService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAircraftModels();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAircraftModels(): void {
    this.loading.set(true);
    this.error.set(false);

    this.aircraftService.getAllAircraftModels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (aircraftModels) => {
        console.log('Aircraft models received:', aircraftModels);
        console.log('Type of response:', typeof aircraftModels);
        console.log('Is array:', Array.isArray(aircraftModels));
        this.aircraftModels.set(aircraftModels);
        this.loading.set(false);
        this.snackBar.open('Aircraft models loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading aircraft models:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading aircraft models', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'add':
        this.onAddAircraftModel();
        break;
    }
  }

  onTableAction(event: { action: string, row: AircraftModelDto }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.onViewAircraftModel(row.id);
        break;
      case 'edit':
        this.onEditAircraftModel(row.id);
        break;
      case 'delete':
        this.onDeleteAircraftModel(row.id);
        break;
    }
  }

  onRowClick(aircraftModel: AircraftModelDto): void {
    this.selectedAircraftModel.set(aircraftModel);
    this.onViewAircraftModel(aircraftModel.id);
  }

  onRetry(): void {
    this.loadAircraftModels();
  }

  private onAddAircraftModel(): void {
    try {
      console.log('Opening add aircraft model dialog');
      const dialogRef = this.dialog.open(AddAircraftModelDialogComponent, {
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result && result.action === 'added') {
          this.loadAircraftModels();
          this.snackBar.open('Aircraft model added successfully', 'Close', {
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error opening add aircraft model dialog:', error);
      this.snackBar.open('Error opening aircraft model form', 'Close', {
        duration: 3000
      });
    }
  }

  private onEditAircraftModel(id: number): void {
    try {
      console.log('Opening edit dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(EditAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result && result.action === 'updated') {
          this.loadAircraftModels();
          this.snackBar.open('Aircraft model updated successfully', 'Close', {
            duration: 2000
          });
        }
      });
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      this.snackBar.open('Error opening aircraft model editor', 'Close', {
        duration: 3000
      });
    }
  }

  private onViewAircraftModel(id: number): void {
    try {
      console.log('Opening view dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(ViewAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result) {
          if (result.action === 'edit') {
            this.onEditAircraftModel(result.id);
          } else if (result.action === 'delete') {
            this.onDeleteAircraftModel(result.id);
          }
        }
      });
    } catch (error) {
      console.error('Error opening view dialog:', error);
      this.snackBar.open('Error opening aircraft model details', 'Close', {
        duration: 3000
      });
    }
  }

  private onDeleteAircraftModel(id: number): void {
    // TODO: Add confirmation dialog
    this.aircraftService.deleteAircraftModel(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.snackBar.open('Aircraft model deleted successfully', 'Close', {
          duration: 2000
        });
        this.loadAircraftModels();
      },
      error: (error) => {
        console.error('Error deleting aircraft model:', error);
        this.snackBar.open('Error deleting aircraft model', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
