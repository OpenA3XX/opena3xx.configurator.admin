import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { AircraftModelDto, AddAircraftModelDto } from '../../../../shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Inject } from '@angular/core';

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
  selector: 'opena3xx-add-aircraft-model-dialog',
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
  templateUrl: './add-aircraft-model-dialog.component.html',
  styleUrls: ['./add-aircraft-model-dialog.component.scss']
})
export class AddAircraftModelDialogComponent implements OnInit {
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
    private dialogRef: MatDialogRef<AddAircraftModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aircraftModelService: AircraftModelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize form if editing
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
        const aircraftModelData: AddAircraftModelDto = {
          name: formValue.name!,
          manufacturer: formValue.manufacturer!,
          type: formValue.type!,
          description: formValue.description || '',
          isActive: formValue.isActive!
        };

        if (this.data?.aircraftModel) {
          // Update existing aircraft model
          await this.aircraftModelService.updateAircraftModel(
            this.data.aircraftModel.id,
            {
              id: this.data.aircraftModel.id,
              ...aircraftModelData
            }
          ).toPromise();
          this.snackBar.open('Aircraft model updated successfully', 'Close', { duration: 3000 });
        } else {
          // Create new aircraft model
          await this.aircraftModelService.addAircraftModel(aircraftModelData).toPromise();
          this.snackBar.open('Aircraft model created successfully', 'Close', { duration: 3000 });
        }

        this.dialogRef.close(true);
      } catch (err) {
        console.error('Error saving aircraft model:', err);
        this.error.set(true);
        this.snackBar.open('Error saving aircraft model', 'Close', { duration: 3000 });
      } finally {
        this.loading.set(false);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
