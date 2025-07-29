import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { HardwareOutputDto } from '../../../../shared/models/models';

@Component({
  selector: 'opena3xx-view-hardware-output-selectors-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './view-hardware-output-selectors-dialog.component.html',
  styleUrls: ['./view-hardware-output-selectors-dialog.component.scss']
})
export class ViewHardwareOutputSelectorsDialogComponent {
  // Signals for reactive state management
  loading = signal(false);
  hardwareOutputSelector = signal<HardwareOutputDto | null>(null);

  // Dialog configuration
  dialogConfig = computed(() => ({
    title: 'View Hardware Output Selector',
    subtitle: `Details for: ${this.hardwareOutputSelector()?.name || 'Unknown'}`
  }));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto },
    private dialogRef: MatDialogRef<ViewHardwareOutputSelectorsDialogComponent>
  ) {
    this.hardwareOutputSelector.set(data.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Getters for template
  get selector(): HardwareOutputDto | null {
    return this.hardwareOutputSelector();
  }
}
