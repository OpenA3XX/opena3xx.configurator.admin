import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Inject } from '@angular/core';
import { AircraftModelService } from '../../services/aircraft-model.service';
import { AircraftModelDto } from '../../../../shared/models/models';
import { Subject, takeUntil } from 'rxjs';

export interface ViewAircraftModelDialogData {
  id: number;
}

@Component({
  selector: 'opena3xx-view-aircraft-model-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-aircraft-model-dialog.component.html',
  styleUrls: ['./view-aircraft-model-dialog.component.scss']
})
export class ViewAircraftModelDialogComponent implements OnInit, OnDestroy {
  // Signals for reactive state management
  aircraftModel = signal<AircraftModelDto | null>(null);
  loading = signal(false);
  error = signal(false);

  private destroy$ = new Subject<void>();

  // Computed properties
  statusClass = computed(() => {
    const classes = ['opena3xx-view-aircraft-model-dialog__status'];
    if (this.aircraftModel()?.isActive) {
      classes.push('opena3xx-view-aircraft-model-dialog__status--active');
    } else {
      classes.push('opena3xx-view-aircraft-model-dialog__status--inactive');
    }
    return classes.join(' ');
  });

  statusIcon = computed(() => {
    return this.aircraftModel()?.isActive ? 'check_circle' : 'cancel';
  });

  statusText = computed(() => {
    return this.aircraftModel()?.isActive ? 'Active' : 'Inactive';
  });

  constructor(
    public dialogRef: MatDialogRef<ViewAircraftModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ViewAircraftModelDialogData,
    private aircraftModelService: AircraftModelService
  ) {
    this.loadAircraftModel(this.data.id);
  }

  ngOnInit(): void {
    // Component is ready
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAircraftModel(id: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.aircraftModelService.getAircraftModelById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (model: AircraftModelDto) => {
        console.log('Aircraft model loaded:', model);
        this.aircraftModel.set(model);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading aircraft model:', error);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', id: this.aircraftModel()?.id });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', id: this.aircraftModel()?.id });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // Getters for template
  get model(): AircraftModelDto | null {
    return this.aircraftModel();
  }

  get statusClasses(): string {
    return this.statusClass();
  }

  get statusIconName(): string {
    return this.statusIcon();
  }

  get statusDisplayText(): string {
    return this.statusText();
  }

  get hasDescription(): boolean {
    return !!(this.aircraftModel()?.description);
  }
}
