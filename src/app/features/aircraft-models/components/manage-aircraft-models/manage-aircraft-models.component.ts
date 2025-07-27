import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AircraftModelDto } from 'src/app/shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { ViewAircraftModelDialogComponent } from '../view-aircraft-model-dialog/view-aircraft-model-dialog.component';
import { EditAircraftModelDialogComponent } from '../edit-aircraft-model-dialog/edit-aircraft-model-dialog.component';
import { AddAircraftModelDialogComponent } from '../add-aircraft-model-dialog/add-aircraft-model-dialog.component';

@Component({
    selector: 'opena3xx-manage-aircraft-models',
    templateUrl: './manage-aircraft-models.component.html',
    styleUrls: ['./manage-aircraft-models.component.scss'],
    standalone: false
})
export class ManageAircraftModelsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'manufacturer',
    'type',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<AircraftModelDto>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private aircraftModelService: AircraftModelService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAircraftModels();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  loadAircraftModels(): void {
    this.loading = true;
    this.aircraftModelService.getAllAircraftModels().subscribe({
      next: (aircraftModels) => {
        this.dataSource.data = aircraftModels;
        this.loading = false;
        this.snackBar.open('Aircraft models loaded successfully', 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error loading aircraft models:', error);
        this.loading = false;
        this.snackBar.open('Error loading aircraft models', 'Close', {
          duration: 3000
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAddAircraftModel(): void {
    try {
      console.log('Opening add aircraft model dialog');
      const dialogRef = this.dialog.open(AddAircraftModelDialogComponent, {
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
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

  onEditAircraftModel(id: number): void {
    try {
      console.log('Opening edit dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(EditAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
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

  onViewAircraftModel(id: number): void {
    try {
      console.log('Opening view dialog for aircraft model ID:', id);
      const dialogRef = this.dialog.open(ViewAircraftModelDialogComponent, {
        data: { id: id },
        width: '600px',
        maxHeight: '80vh',
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result) => {
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

  onDeleteAircraftModel(id: number): void {
    // TODO: Add confirmation dialog
    this.aircraftModelService.deleteAircraftModel(id).subscribe({
      next: () => {
        this.snackBar.open('Aircraft model deleted successfully', 'Close', {
          duration: 2000
        });
        this.loadAircraftModels(); // Reload the data
      },
      error: (error) => {
        console.error('Error deleting aircraft model:', error);
        this.snackBar.open('Error deleting aircraft model', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'success' : 'warn';
  }
}
