import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/forms/dynamic-form.component';
import { HardwareBoardDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';

@Component({
  selector: 'opena3xx-register-hardware-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatSliderModule,
    PageLayoutComponent,
    LoadingWrapperComponent,
    DynamicFormComponent
  ],
  templateUrl: './register-hardware-board.component.html',
  styleUrls: ['./register-hardware-board.component.scss']
})
export class RegisterHardwareBoardComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  submitting = signal(false);
  totalDiscreteInputOutput = signal(16);

  // Form configuration
  formConfig = computed((): DynamicFormConfig => ({
    title: 'Register Hardware Board',
    subtitle: 'Register a new hardware board',
    loading: this.submitting(),
    fields: [
      {
        key: 'name',
        label: 'Board Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: 'Enter hardware board name',
        hint: 'Enter the name of the new Hardware Board',
        validation: {
          required: true,
          minLength: 2,
          maxLength: 100
        }
      },
      {
        key: 'hardwareBusExtendersCount',
        label: 'Total I²C Extenders',
        type: 'number',
        required: true,
        min: 1,
        max: 8,
        step: 1,
        placeholder: 'Select number of extenders',
        hint: `Total discrete I/O: ${this.totalDiscreteInputOutput()} (${this.totalDiscreteInputOutput() / 16} × 16)`,
        validation: {
          required: true,
          min: 1,
          max: 8
        }
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        maxLength: 500,
        rows: 3,
        placeholder: 'Enter board description (optional)',
        hint: 'Optional description of the hardware board',
        validation: {
          maxLength: 500
        }
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'toggle',
        required: false,
        hint: 'Enable this board for use'
      }
    ],
    layout: 'single',
    submitText: 'Register Board',
    cancelText: 'Cancel',
    showCancel: true
  }));

  // Page actions
  pageActions: ActionButton[] = [
    {
      label: 'Back',
      icon: 'arrow_back',
      action: 'back',
      color: 'accent'
    }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private hardwareService: HardwareService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'back':
        this.back();
        break;
    }
  }

  onFormSubmit(formData: any): void {
    this.submitting.set(true);

    const board: any = {
      name: formData.name,
      hardwareBusExtendersCount: formData.hardwareBusExtendersCount
    };

    this.hardwareService.addBoard(board).subscribe({
      next: () => {
        this.snackBar.open('Hardware board registered successfully', 'Close', { duration: 2000 });
        this.submitting.set(false);
        this.back();
      },
      error: (error) => {
        console.error('Error registering hardware board:', error);
        this.snackBar.open('Error registering hardware board', 'Close', { duration: 3000 });
        this.submitting.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.back();
  }

  onFormChange(formData: any): void {
    // Update total discrete I/O when extender count changes
    if (formData.hardwareBusExtendersCount) {
      this.totalDiscreteInputOutput.set(formData.hardwareBusExtendersCount * 16);
    }
  }

  private back(): void {
    this.router.navigateByUrl('/manage/hardware-boards');
  }

  // Getters for template
  get isSubmitting(): boolean {
    return this.submitting();
  }
}
