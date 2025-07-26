import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { AircraftModelDto, UpdateAircraftModelDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-edit-aircraft-model',
    templateUrl: './edit-aircraft-model.component.html',
    styleUrls: ['./edit-aircraft-model.component.scss'],
    standalone: false
})
export class EditAircraftModelComponent implements OnInit {
  aircraftModelForm: FormGroup;
  loading = false;
  aircraftModelId: number = 0;
  aircraftModel: AircraftModelDto | null = null;

  constructor(
    private fb: FormBuilder,
    private aircraftModelService: AircraftModelService,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.aircraftModelId = Number(params['id']);
      if (this.aircraftModelId) {
        this.loadAircraftModel();
      } else {
        this.snackBar.open('Invalid aircraft model ID', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/manage/aircraft-models');
      }
    });
  }

  loadAircraftModel(): void {
    this.loading = true;
    this.aircraftModelService.getAircraftModelById(this.aircraftModelId).subscribe({
      next: (aircraftModel) => {
        this.aircraftModel = aircraftModel;
        this.aircraftModelForm.patchValue({
          name: aircraftModel.name,
          manufacturer: aircraftModel.manufacturer,
          type: aircraftModel.type,
          description: aircraftModel.description || '',
          isActive: aircraftModel.isActive
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading aircraft model:', error);
        this.loading = false;
        this.snackBar.open('Error loading aircraft model', 'Close', { duration: 3000 });
        this.router.navigateByUrl('/manage/aircraft-models');
      }
    });
  }

  onSubmit(): void {
    if (this.aircraftModelForm.valid && this.aircraftModel) {
      this.loading = true;
      const updateData: UpdateAircraftModelDto = {
        id: this.aircraftModelId,
        ...this.aircraftModelForm.value
      };

      this.aircraftModelService.updateAircraftModel(this.aircraftModelId, updateData).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Aircraft model updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/manage/aircraft-models');
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating aircraft model:', error);
          this.snackBar.open('Error updating aircraft model', 'Close', {
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
