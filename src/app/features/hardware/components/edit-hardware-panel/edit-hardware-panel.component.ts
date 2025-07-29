import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/forms/dynamic-form.component';
import { FormFieldConfig } from '../../../../shared/components/forms/form-field.component';
import { HardwarePanelDto } from '../../../../shared/models/models';
import { HardwareService } from '../../services/hardware.service';

@Component({
  selector: 'opena3xx-edit-hardware-panel',
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
    LoadingWrapperComponent,
    DynamicFormComponent
  ],
  templateUrl: './edit-hardware-panel.component.html',
  styleUrls: ['./edit-hardware-panel.component.scss']
})
export class EditHardwarePanelComponent implements OnInit {
  // Signals for reactive state management
  loading = signal(false);
  error = signal(false);
  submitting = signal(false);
  hardwarePanel = signal<HardwarePanelDto | null>(null);

  // Computed values
  isEmpty = computed(() => !this.hardwarePanel() && !this.loading() && !this.error());

  // Form configuration
  formConfig = computed((): DynamicFormConfig => ({
    title: 'Edit Hardware Panel',
    subtitle: 'Update hardware panel configuration',
    loading: this.submitting(),
    fields: [
      {
        key: 'name',
        label: 'Hardware Panel Name',
        type: 'text',
        required: true,
        minLength: 3,
        maxLength: 100,
        placeholder: 'Enter hardware panel name',
        hint: 'Enter a descriptive name for the hardware panel',
        validation: {
          required: true,
          minLength: 3,
          maxLength: 100
        }
      },
      {
        key: 'aircraftModel',
        label: 'Aircraft Model',
        type: 'select',
        required: true,
        disabled: true,
        options: [
          { value: '1', label: 'A320-NEO' },
          { value: '2', label: 'A321-NEO' },
          { value: '3', label: 'A350-900' },
          { value: '4', label: 'A380-800' }
        ],
        hint: 'Select the aircraft model for this panel',
        validation: {
          required: true
        }
      },
      {
        key: 'cockpitArea',
        label: 'Cockpit Area',
        type: 'select',
        required: true,
        options: [
          { value: '0', label: 'Glareshield' },
          { value: '1', label: 'Pedestal' },
          { value: '2', label: 'Overhead' }
        ],
        hint: 'Select the cockpit area for this panel',
        validation: {
          required: true
        }
      },
      {
        key: 'owner',
        label: 'Hardware Panel Owner',
        type: 'select',
        required: true,
        options: [
          { value: '0', label: 'Pilot' },
          { value: '1', label: 'Co-Pilot' },
          { value: '2', label: 'Shared' }
        ],
        hint: 'Select the owner of this panel',
        validation: {
          required: true
        }
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        maxLength: 500,
        rows: 3,
        placeholder: 'Enter panel description',
        hint: 'Optional description of the hardware panel',
        validation: {
          maxLength: 500
        }
      }
    ],
    layout: 'single',
    submitText: 'Update Panel',
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
    this.loadHardwarePanel();
  }

  private loadHardwarePanel(): void {
    this.loading.set(true);
    this.error.set(false);

    const panelId = this.route.snapshot.queryParams['id'];
    if (!panelId) {
      this.error.set(true);
      this.loading.set(false);
      this.snackBar.open('No hardware panel ID provided', 'Close', { duration: 3000 });
      return;
    }

    this.hardwareService.getPanelById(parseInt(panelId)).subscribe({
      next: (panel) => {
        this.hardwarePanel.set(panel);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading hardware panel:', error);
        this.error.set(true);
        this.loading.set(false);
        this.snackBar.open('Error loading hardware panel', 'Close', { duration: 3000 });
      }
    });
  }

  onPageAction(action: string): void {
    switch (action) {
      case 'back':
        this.back();
        break;
    }
  }

  onRetry(): void {
    this.loadHardwarePanel();
  }

  onFormSubmit(formData: any): void {
    this.submitting.set(true);

    const panel = this.hardwarePanel();
    if (!panel) {
      this.snackBar.open('No hardware panel data available', 'Close', { duration: 3000 });
      this.submitting.set(false);
      return;
    }

    const updatedPanel = {
      ...panel,
      ...formData
    };

    this.hardwareService.updatePanel(panel.id, updatedPanel).subscribe({
      next: () => {
        this.snackBar.open('Hardware panel updated successfully', 'Close', { duration: 2000 });
        this.submitting.set(false);
        this.back();
      },
      error: (error) => {
        console.error('Error updating hardware panel:', error);
        this.snackBar.open('Error updating hardware panel', 'Close', { duration: 3000 });
        this.submitting.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.back();
  }

  private back(): void {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  // Getters for template
  get initialData(): any {
    const panel = this.hardwarePanel();
    if (!panel) return {};

    return {
      name: panel.name,
      aircraftModel: panel.aircraftModel?.toString() || '1',
      cockpitArea: panel.cockpitArea?.toString() || '0',
      owner: panel.owner?.toString() || '0',
      description: (panel as any).description || ''
    };
  }

  get isSubmitting(): boolean {
    return this.submitting();
  }
}
