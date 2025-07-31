import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelDto, UpdateAircraftModelDto } from 'src/app/shared/models/models';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-edit-aircraft-model-dialog',
  templateUrl: './edit-aircraft-model-dialog.component.html',
  styleUrls: ['./edit-aircraft-model-dialog.component.scss'],
  standalone: false
})
export class EditAircraftModelDialogComponent implements OnInit {
  aircraftModel: AircraftModelDto | null = null;
  aircraftModelForm: FormGroup;
  loading = false;
  error = false;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private aircraftModelService: AircraftModelService,
    private dialogRef: MatDialogRef<EditAircraftModelDialogComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    if (!data || !data.id) {
      console.error('Invalid dialog data provided');
      this.dialogRef.close();
    }
    this.initializeWrapperConfig();
    this.aircraftModelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      manufacturer: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    try {
      this.loadAircraftModel();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.error = true;
    }
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Edit Aircraft Model',
      subtitle: 'Update aircraft model information',
      icon: 'edit',
      size: 'large',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.aircraftModel) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Edit Aircraft Model - ${this.aircraftModel.name}`
      };
    }
  }

  loadAircraftModel(): void {
    this.loading = true;
    this.error = false;

    this.aircraftModelService.getAircraftModelById(this.data.id).subscribe({
      next: (aircraftModel) => {
        this.aircraftModel = aircraftModel;
        this.aircraftModelForm.patchValue({
          name: aircraftModel.name,
          manufacturer: aircraftModel.manufacturer,
          type: aircraftModel.type,
          description: aircraftModel.description || '',
          isActive: aircraftModel.isActive
        });
        this.updateWrapperConfig();
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

  onSubmit(): void {
    if (this.aircraftModelForm.valid) {
      this.loading = true;
      const updatedAircraftModel: UpdateAircraftModelDto = {
        id: this.data.id,
        ...this.aircraftModelForm.value
      };

      this.aircraftModelService.updateAircraftModel(this.data.id, updatedAircraftModel).subscribe({
        next: (updatedModel) => {
          this.loading = false;
          this.snackBar.open('Aircraft model updated successfully', 'Close', {
            duration: 3000
          });
          this.dialogRef.close({ action: 'updated', aircraftModel: updatedModel });
        },
        error: (error) => {
          console.error('Error updating aircraft model:', error);
          this.loading = false;
          this.snackBar.open('Error updating aircraft model', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.validateAllFormFields(this.aircraftModelForm);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.aircraftModelForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.aircraftModelForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least ${field.getError('minlength').requiredLength} characters`;
    }
    if (field.hasError('maxlength')) {
      return `${this.getFieldLabel(fieldName)} must be no more than ${field.getError('maxlength').requiredLength} characters`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      manufacturer: 'Manufacturer',
      type: 'Type',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
