import { Component, OnInit, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelDto, UpdateAircraftModelDto } from '../../../../shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';

export interface AircraftModel {
  id: number;
  name: string;
  manufacturer: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'opena3xx-edit-aircraft-model-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './edit-aircraft-model-dialog.component.html',
  styleUrls: ['./edit-aircraft-model-dialog.component.scss']
})
export class EditAircraftModelDialogComponent implements OnInit {
  // Form
  aircraftModelForm = this.fb.group({
    name: ['', Validators.required],
    manufacturer: ['', Validators.required],
    type: ['', Validators.required],
    description: [''],
    isActive: [true]
  });

  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAircraftModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aircraftModelService: AircraftModelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize form with existing data
    if (this.data?.aircraftModel) {
      this.aircraftModelForm.patchValue(this.data.aircraftModel);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.aircraftModelForm.valid) {
      this.loading.set(true);
      this.error.set(false);

      try {
        const formValue = this.aircraftModelForm.value;
        const aircraftModelData: UpdateAircraftModelDto = {
          id: this.data.aircraftModel.id,
          name: formValue.name!,
          manufacturer: formValue.manufacturer!,
          type: formValue.type!,
          description: formValue.description || '',
          isActive: formValue.isActive!
        };

        await this.aircraftModelService.updateAircraftModel(
          this.data.aircraftModel.id,
          aircraftModelData
        ).toPromise();

        this.snackBar.open('Aircraft model updated successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      } catch (err) {
        console.error('Error updating aircraft model:', err);
        this.error.set(true);
        this.snackBar.open('Error updating aircraft model', 'Close', { duration: 3000 });
      } finally {
        this.loading.set(false);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  loadAircraftModel(): void {
    // This method is called when retry is clicked
    // In a real implementation, you would reload the aircraft model data
    console.log('Reloading aircraft model data...');
  }
}
