import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelDto } from 'src/app/shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';

@Component({
  selector: 'opena3xx-view-aircraft-model-dialog',
  templateUrl: './view-aircraft-model-dialog.component.html',
  styleUrls: ['./view-aircraft-model-dialog.component.scss'],
  standalone: false
})
export class ViewAircraftModelDialogComponent implements OnInit {
  aircraftModel: AircraftModelDto | null = null;
  loading = false;
  error = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private aircraftModelService: AircraftModelService,
    private dialogRef: MatDialogRef<ViewAircraftModelDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    if (!data || !data.id) {
      console.error('Invalid dialog data provided');
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    try {
      this.loadAircraftModel();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.error = true;
    }
  }

  loadAircraftModel(): void {
    this.loading = true;
    this.error = false;

    this.aircraftModelService.getAircraftModelById(this.data.id).subscribe({
      next: (aircraftModel) => {
        this.aircraftModel = aircraftModel;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading aircraft model:', error);
        this.loading = false;
        this.error = true;
        this.snackBar.open('Error loading aircraft model details', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', id: this.data.id });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', id: this.data.id });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}
