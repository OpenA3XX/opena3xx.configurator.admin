import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Inject } from '@angular/core';

export interface ExitAppDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showWarning?: boolean;
}

@Component({
  selector: 'opena3xx-exit-app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './exit-app-dialog.component.html',
  styleUrls: ['./exit-app-dialog.component.scss']
})
export class ExitAppDialogComponent {
  // Dialog data
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  showWarning: boolean;

  // Computed properties
  dialogClass = computed(() => {
    const classes = ['opena3xx-exit-app-dialog'];
    if (this.showWarning) classes.push('opena3xx-exit-app-dialog--warning');
    return classes.join(' ');
  });

  constructor(
    public dialogRef: MatDialogRef<ExitAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExitAppDialogData
  ) {
    this.title = data.title || 'Exit Application';
    this.message = data.message || 'Are you sure you want to exit the application?';
    this.confirmText = data.confirmText || 'Exit';
    this.cancelText = data.cancelText || 'Cancel';
    this.showWarning = data.showWarning || false;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Getters for template
  get dialogClasses(): string {
    return this.dialogClass();
  }

  get hasWarning(): boolean {
    return this.showWarning;
  }

  get hasTitle(): boolean {
    return !!this.title;
  }

  get hasMessage(): boolean {
    return !!this.message;
  }
}
