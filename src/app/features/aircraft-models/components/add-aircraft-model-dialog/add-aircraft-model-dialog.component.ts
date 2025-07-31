import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { AddAircraftModelDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
  selector: 'opena3xx-add-aircraft-model-dialog',
  templateUrl: './add-aircraft-model-dialog.component.html',
  styleUrls: ['./add-aircraft-model-dialog.component.scss'],
  standalone: false
})
export class AddAircraftModelDialogComponent implements OnInit {
  aircraftModelForm: FormGroup;
  loading = false;
  error = false;
  wrapperConfig: DialogWrapperConfig;

  constructor(
    private aircraftModelService: AircraftModelService,
    private dialogRef: MatDialogRef<AddAircraftModelDialogComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.aircraftModelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      manufacturer: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Add Aircraft Model',
      subtitle: 'Create a new aircraft model configuration',
      icon: 'flight',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.loading) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: 'Adding Aircraft Model...',
        subtitle: 'Please wait while we create the aircraft model'
      };
    } else if (this.error) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: 'Error Adding Aircraft Model',
        subtitle: 'There was an error creating the aircraft model'
      };
    } else {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: 'Add Aircraft Model',
        subtitle: 'Create a new aircraft model configuration'
      };
    }
  }

  onSubmit(): void {
    if (this.aircraftModelForm.valid) {
      this.loading = true;
      this.error = false;
      this.updateWrapperConfig();
      const aircraftModel: AddAircraftModelDto = this.aircraftModelForm.value;

      this.aircraftModelService.addAircraftModel(aircraftModel).subscribe({
        next: (result) => {
          this.loading = false;
          this.error = false;
          this.updateWrapperConfig();
          this.snackBar.open('Aircraft model added successfully', 'Close', {
            duration: 3000
          });
          this.dialogRef.close({ action: 'added', aircraftModel: result });
        },
        error: (error) => {
          this.loading = false;
          this.error = true;
          this.updateWrapperConfig();
          console.error('Error adding aircraft model:', error);
          this.snackBar.open('Error adding aircraft model', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.validateAllFormFields();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private validateAllFormFields(): void {
    Object.keys(this.aircraftModelForm.controls).forEach(key => {
      const control = this.aircraftModelForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.aircraftModelForm.get(controlName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(controlName)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldDisplayName(controlName)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldDisplayName(controlName)} must be no more than ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      manufacturer: 'Manufacturer',
      type: 'Type',
      description: 'Description'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.aircraftModelForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
