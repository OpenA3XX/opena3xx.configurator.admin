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
import { HardwareOutputTypeDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';

@Component({
  selector: 'opena3xx-edit-hardware-output-type',
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
  templateUrl: './edit-hardware-output-type.component.html',
  styleUrls: ['./edit-hardware-output-type.component.scss']
})
export class EditHardwareOutputTypeComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  submitting = signal(false);
  hardwareOutputType = signal<HardwareOutputTypeDto | null>(null);
  isEmpty = computed(() => !this.hardwareOutputType() && !this.loading() && !this.error());

  // Form configuration
  formConfig = computed((): DynamicFormConfig => ({
    title: 'Edit Hardware Output Type',
    subtitle: 'Update hardware output type configuration',
    loading: this.submitting(),
    fields: [
      {
        key: 'name',
        label: 'Hardware Output Type Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100,
        placeholder: 'Enter hardware output type name',
        hint: 'Enter a descriptive name for the hardware output type',
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
        hint: 'Optional description of the hardware output type',
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
          { value: 'led', label: 'LED' },
          { value: 'display', label: 'Display' },
          { value: 'motor', label: 'Motor' },
          { value: 'relay', label: 'Relay' },
          { value: 'other', label: 'Other' }
        ],
        placeholder: 'Select category',
        hint: 'Select the category for this output type'
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'toggle',
        required: false,
        hint: 'Enable this output type for use'
      }
    ],
    layout: 'single',
    submitText: 'Update Output Type',
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
    this.loadHardwareOutputType();
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

    const outputType: HardwareOutputTypeDto = {
      id: this.hardwareOutputType()?.id,
      name: formData.name
    };

    this.hardwareService.updateOutputType(outputType).subscribe({
      next: () => {
        this.snackBar.open('Hardware output type updated successfully', 'Close', { duration: 2000 });
        this.submitting.set(false);
        this.back();
      },
      error: (error) => {
        console.error('Error updating hardware output type:', error);
        this.snackBar.open('Error updating hardware output type', 'Close', { duration: 3000 });
        this.submitting.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.back();
  }

  private loadHardwareOutputType(): void {
    this.loading.set(true);

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.hardwareService.getOutputTypeById(id).subscribe({
          next: (data) => {
            this.hardwareOutputType.set(data);
            this.loading.set(false);
          },
          error: (error) => {
            console.error('Error loading hardware output type:', error);
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
    this.router.navigateByUrl('/manage/hardware-output-types');
  }

  // Getters for template
  get initialData(): any {
    const outputType = this.hardwareOutputType();
    if (!outputType) return {};

    return {
      name: outputType.name,
      description: (outputType as any).description || '',
      category: (outputType as any).category || 'other',
      isActive: (outputType as any).isActive !== undefined ? (outputType as any).isActive : true
    };
  }
}
