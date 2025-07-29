import { Component, Input, OnInit, signal, computed, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HardwareInputDto } from '../../../../shared/models/models';

export interface DeleteHardwareInputDialogData {
  hardwareInput: HardwareInputDto;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'opena3xx-delete-hardware-input-dialog-confirm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './delete-hardware-input-dialog.component.html',
  styleUrls: ['./delete-hardware-input-dialog.component.scss']
})
export class DeleteHardwareInputDialogComponent implements OnInit {
  // Signals for reactive state management
  isConfirmDisabled = signal(true);
  confirmText = signal('');

  // Computed values
  canConfirm = computed(() => this.confirmText() === this.data.hardwareInput.name);

  // Form control
  confirmControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<DeleteHardwareInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteHardwareInputDialogData
  ) {}

  ngOnInit(): void {
    this.setupFormListeners();
  }

  private setupFormListeners(): void {
    this.confirmControl.valueChanges.subscribe(value => {
      this.confirmText.set(value || '');
      this.isConfirmDisabled.set(!this.canConfirm());
    });
  }

  onConfirm(): void {
    if (this.canConfirm()) {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.confirmText.set(target.value);
    this.isConfirmDisabled.set(target.value !== this.data.hardwareInput.name);
  }

  // Getters for template
  get title(): string {
    return this.data.title || 'Delete Hardware Input';
  }

  get message(): string {
    return this.data.message || `Are you sure you want to delete the hardware input "${this.data.hardwareInput.name}"? This action cannot be undone.`;
  }

  get confirmButtonText(): string {
    return this.data.confirmText || 'Delete';
  }

  get cancelButtonText(): string {
    return this.data.cancelText || 'Cancel';
  }

  get hardwareInputName(): string {
    return this.data.hardwareInput.name;
  }
}
