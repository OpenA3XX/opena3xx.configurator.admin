import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HardwareInputDto } from '../../../../shared/models/models';

@Component({
  selector: 'opena3xx-view-hardware-input-selectors-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './view-hardware-input-selectors-dialog.component.html',
  styleUrls: ['./view-hardware-input-selectors-dialog.component.scss']
})
export class ViewHardwareInputSelectorsDialogComponent {
  // Signals for reactive state management
  loading = signal(false);
  hardwareInputSelector = signal<HardwareInputDto | null>(null);

  // Dialog configuration
  dialogConfig = computed(() => ({
    title: 'View Hardware Input Selector',
    subtitle: `Details for: ${this.hardwareInputSelector()?.name || 'Unknown'}`
  }));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dialogRef: MatDialogRef<ViewHardwareInputSelectorsDialogComponent>
  ) {
    this.hardwareInputSelector.set(data.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Getters for template
  get selector(): HardwareInputDto | null {
    return this.hardwareInputSelector();
  }
}
