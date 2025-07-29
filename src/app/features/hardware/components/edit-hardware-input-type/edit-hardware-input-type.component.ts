import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageLayoutComponent, ActionButton } from '../../../../shared/components/layout/page-layout.component';
import { LoadingWrapperComponent } from '../../../../shared/components/ui/loading-wrapper/loading-wrapper.component';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/forms/dynamic-form.component';
import { HardwareInputTypeDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';

@Component({
  selector: 'opena3xx-edit-hardware-input-type',
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
    PageLayoutComponent,
    LoadingWrapperComponent,
    DynamicFormComponent
  ],
  templateUrl: './edit-hardware-input-type.component.html',
  styleUrls: ['./edit-hardware-input-type.component.scss']
})
export class EditHardwareInputTypeComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  submitting = signal(false);
  hardwareInputType = signal<HardwareInputTypeDto | null>(null);
  isEmpty = computed(() => !this.hardwareInputType() && !this.loading() && !this.error());

  // Form configuration
  formConfig = computed((): DynamicFormConfig => ({
    title: 'Edit Hardware Input Type',
    subtitle: 'Update hardware input type configuration',
    loading: this.submitting(),
    fields: [
      {
        key: 'name',
        label: 'Hardware Input Type Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: 'Enter hardware input type name',
        hint: 'Enter a descriptive name for the hardware input type',
        validation: {
          required: true,
          minLength: 2,
          maxLength: 100
        }
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        maxLength: 500,
        rows: 3,
        placeholder: 'Enter description (optional)',
        hint: 'Optional description of the hardware input type',
        validation: {
          maxLength: 500
        }
      },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        required: false,
        options: [
          { value: 'switch', label: 'Switch' },
          { value: 'button', label: 'Button' },
          { value: 'knob', label: 'Knob' },
          { value: 'lever', label: 'Lever' },
          { value: 'other', label: 'Other' }
        ],
        placeholder: 'Select category',
        hint: 'Select the category for this input type'
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'toggle',
        required: false,
        hint: 'Enable this input type for use'
      }
    ],
    layout: 'single',
    submitText: 'Update Input Type',
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
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private hardwareService: HardwareService
  ) {}

  ngOnInit(): void {
    this.loadHardwareInputType();
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

    const inputType: HardwareInputTypeDto = {
      id: this.hardwareInputType()?.id,
      name: formData.name
    };

    this.hardwareService.updateInputType(inputType).subscribe({
      next: () => {
        this.snackBar.open('Hardware input type updated successfully', 'Close', { duration: 2000 });
        this.submitting.set(false);
        this.back();
      },
      error: (error) => {
        console.error('Error updating hardware input type:', error);
        this.snackBar.open('Error updating hardware input type', 'Close', { duration: 3000 });
        this.submitting.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.back();
  }

  private loadHardwareInputType(): void {
    this.loading.set(true);

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.hardwareService.getInputTypeById(id).subscribe({
          next: (data) => {
            this.hardwareInputType.set(data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading hardware input type:', error);
            this.error.set(true);
            this.loading.set(false);
          }
        });
      } else {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  private back(): void {
    this.router.navigateByUrl('/manage/hardware-input-types');
  }

  // Getters for template
  get initialData(): any {
    const inputType = this.hardwareInputType();
    if (!inputType) return {};

    return {
      name: inputType.name,
      description: (inputType as any).description || '',
      category: (inputType as any).category || 'other',
      isActive: (inputType as any).isActive !== undefined ? (inputType as any).isActive : true
    };
  }
}
