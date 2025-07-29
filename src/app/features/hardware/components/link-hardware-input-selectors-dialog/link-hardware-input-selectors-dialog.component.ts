import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { HardwareInputDto } from '../../../../shared/models/models';

@Component({
  selector: 'opena3xx-link-hardware-input-selectors-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './link-hardware-input-selectors-dialog.component.html',
  styleUrls: ['./link-hardware-input-selectors-dialog.component.scss']
})
export class LinkHardwareInputSelectorsDialogComponent {
  // Signals for reactive state management
  loading = signal(false);
  submitting = signal(false);
  hardwareInputSelector = signal<HardwareInputDto | null>(null);

  // Form data
  formData = signal({
    selectorId: '',
    linkType: 'direct',
    isActive: true,
    description: ''
  });

  // Dialog configuration
  dialogConfig = computed(() => ({
    title: 'Link Hardware Input Selector',
    subtitle: `Link selector for: ${this.hardwareInputSelector()?.name || 'Unknown'}`,
    loading: this.submitting()
  }));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dialogRef: MatDialogRef<LinkHardwareInputSelectorsDialogComponent>
  ) {
    this.hardwareInputSelector.set(data.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitting.set(true);

    // Implementation for linking hardware input selector
    console.log('Linking hardware input selector:', this.formData());

    // Simulate API call
    setTimeout(() => {
      this.submitting.set(false);
      this.dialogRef.close(this.formData());
    }, 1000);
  }

  onFormChange(field: string, value: any): void {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  // Getters for template
  get isSubmitting(): boolean {
    return this.submitting();
  }

  get selector(): HardwareInputDto | null {
    return this.hardwareInputSelector();
  }
}
