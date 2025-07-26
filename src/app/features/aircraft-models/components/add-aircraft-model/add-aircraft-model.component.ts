import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { AddAircraftModelDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-add-aircraft-model',
    templateUrl: './add-aircraft-model.component.html',
    styleUrls: ['./add-aircraft-model.component.scss'],
    standalone: false
})
export class AddAircraftModelComponent implements OnInit {
  aircraftModelForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private aircraftModelService: AircraftModelService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.aircraftModelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      manufacturer: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.aircraftModelForm.valid) {
      this.loading = true;
      const aircraftModel: AddAircraftModelDto = this.aircraftModelForm.value;

      this.aircraftModelService.addAircraftModel(aircraftModel).subscribe({
        next: (result) => {
          this.loading = false;
          this.snackBar.open('Aircraft model added successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/manage/aircraft-models');
        },
        error: (error) => {
          this.loading = false;
          console.error('Error adding aircraft model:', error);
          this.snackBar.open('Error adding aircraft model', 'Close', {
            duration: 3000
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/manage/aircraft-models');
  }

  private markFormGroupTouched(): void {
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
