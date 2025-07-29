
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { AddHardwarePanelDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';

@Component({
  selector: 'opena3xx-add-hardware-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    PageLayoutComponent,
    LoadingWrapperComponent
  ],
  templateUrl: './add-hardware-panel.component.html',
  styleUrls: ['./add-hardware-panel.component.scss']
})
export class AddHardwarePanelComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  submitting = signal(false);

  // Form
  addHardwarePanelForm: FormGroup;

  // Page actions
  pageActions: ActionButton[] = [
    {
      label: 'Back',
      icon: 'arrow_back',
      action: 'back',
      color: 'accent'
    },
    {
      label: 'Save',
      icon: 'save',
      action: 'save',
      color: 'primary'
    }
  ];

  // Aircraft model options (this would come from a service in a real app)
  aircraftModelOptions = [
    { key: '1', value: 'A320-NEO' },
    { key: '2', value: 'A321-NEO' },
    { key: '3', value: 'A350-900' },
    { key: '4', value: 'A380-800' }
  ];

  // Cockpit area options
  cockpitAreaOptions = [
    { key: '0', value: 'Glareshield' },
    { key: '1', value: 'Pedestal' },
    { key: '2', value: 'Overhead' }
  ];

  // Owner options
  ownerOptions = [
    { key: '0', value: 'Pilot' },
    { key: '1', value: 'Co-Pilot' },
    { key: '2', value: 'Shared' }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private hardwareService: HardwareService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private initializeForm(): void {
    this.addHardwarePanelForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      aircraftModel: ['', [Validators.required]],
      cockpitArea: ['', [Validators.required]],
      owner: ['', [Validators.required]]
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'back':
        this.back();
        break;
      case 'save':
        this.onSubmit();
        break;
    }
  }

  onRetry(): void {
    this.error.set(false);
    this.loading.set(false);
  }

  private back(): void {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  onSubmit(): void {
    if (this.addHardwarePanelForm.valid) {
      this.submitting.set(true);
      this.error.set(false);

      const panelData: AddHardwarePanelDto = {
        name: this.addHardwarePanelForm.get('name')?.value,
        aircraftModel: parseInt(this.addHardwarePanelForm.get('aircraftModel')?.value),
        cockpitArea: parseInt(this.addHardwarePanelForm.get('cockpitArea')?.value),
        owner: parseInt(this.addHardwarePanelForm.get('owner')?.value)
      };

      this.hardwareService.addPanel(panelData).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Hardware Panel Added Successfully', 'OK', {
            duration: 3000,
          });
          this.back();
        },
        error: (error) => {
          console.error('Error adding hardware panel:', error);
          this.submitting.set(false);
          this.error.set(true);
          this.snackBar.open('Error occurred when adding Hardware Panel', 'OK', {
            duration: 3000,
          });
        }
      });
    } else {
      this.validateAllFormFields(this.addHardwarePanelForm);
    }
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addHardwarePanelForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.addHardwarePanelForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Panel Name',
      aircraftModel: 'Aircraft Model',
      cockpitArea: 'Cockpit Area',
      owner: 'Owner'
    };
    return labels[fieldName] || fieldName;
  }
}
