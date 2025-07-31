import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AircraftModelDto } from 'src/app/shared/models/models';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-delete-aircraft-model-dialog',
    templateUrl: './delete-aircraft-model-dialog.component.html',
    styleUrls: ['./delete-aircraft-model-dialog.component.scss'],
    standalone: false
})
export class DeleteAircraftModelDialogComponent implements OnInit {
  disabled: boolean = true;
  aircraftModelName: string = '';
  wrapperConfig: DialogWrapperConfig;

  @Input() aircraftModel: AircraftModelDto;

  constructor(private dialogRef: MatDialogRef<DeleteAircraftModelDialogComponent>) {
    this.initializeWrapperConfig();
  }

  ngOnInit() {
    this.aircraftModelName = this.aircraftModel.name;
    this.updateWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Delete Aircraft Model',
      subtitle: 'Confirm deletion of aircraft model',
      icon: 'delete',
      size: 'medium',
      showCloseButton: true,
      showFooter: true
    };
  }

  private updateWrapperConfig(): void {
    if (this.aircraftModelName) {
      this.wrapperConfig = {
        ...this.wrapperConfig,
        title: `Delete ${this.aircraftModelName}`,
        subtitle: 'This action cannot be undone'
      };
    }
  }

  onInputChange(target: HTMLInputElement) {
    this.disabled = target.value !== this.aircraftModelName;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
