import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteHardwareInputDialogComponent, DeleteHardwareInputDialogData } from '../../features/hardware/components/delete-hardware-input-dialog/delete-hardware-input-dialog.component';

export interface ConfirmationDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  inputValidation?: (value: string) => string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Show a simple confirmation dialog
   */
  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: data.title || 'Confirm Action',
        message: data.message,
        confirmText: data.confirmText || 'Confirm',
        cancelText: data.cancelText || 'Cancel'
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a delete confirmation dialog with input validation
   */
  confirmDelete(itemName: string, itemType: string = 'item'): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: `Delete ${itemType}`,
        message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        hardwareInput: { name: itemName } as any // Temporary workaround
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a warning confirmation dialog
   */
  confirmWarning(data: ConfirmationDialogData): Observable<boolean> {
    return this.confirm({
      ...data,
      type: 'warning',
      title: data.title || 'Warning',
      confirmText: data.confirmText || 'Proceed',
      cancelText: data.cancelText || 'Cancel'
    });
  }

  /**
   * Show an error confirmation dialog
   */
  confirmError(data: ConfirmationDialogData): Observable<boolean> {
    return this.confirm({
      ...data,
      type: 'error',
      title: data.title || 'Error',
      confirmText: data.confirmText || 'OK',
      cancelText: data.cancelText || 'Cancel'
    });
  }

  /**
   * Show an info confirmation dialog
   */
  confirmInfo(data: ConfirmationDialogData): Observable<boolean> {
    return this.confirm({
      ...data,
      type: 'info',
      title: data.title || 'Information',
      confirmText: data.confirmText || 'OK',
      cancelText: data.cancelText || 'Cancel'
    });
  }

  /**
   * Show a success confirmation dialog
   */
  confirmSuccess(data: ConfirmationDialogData): Observable<boolean> {
    return this.confirm({
      ...data,
      type: 'success',
      title: data.title || 'Success',
      confirmText: data.confirmText || 'OK',
      cancelText: data.cancelText || 'Cancel'
    });
  }

  /**
   * Show a custom confirmation dialog with input validation
   */
  confirmWithInput(data: ConfirmationDialogData & { inputValue: string }): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: data.title || 'Confirm Action',
        message: data.message,
        confirmText: data.confirmText || 'Confirm',
        cancelText: data.cancelText || 'Cancel',
        hardwareInput: { name: data.inputValue } as any // Temporary workaround
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a confirmation dialog for hardware input deletion
   */
  confirmHardwareInputDeletion(hardwareInput: any): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: 'Delete Hardware Input',
        message: `Are you sure you want to delete the hardware input "${hardwareInput.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        hardwareInput
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a confirmation dialog for hardware output deletion
   */
  confirmHardwareOutputDeletion(hardwareOutput: any): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: 'Delete Hardware Output',
        message: `Are you sure you want to delete the hardware output "${hardwareOutput.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        hardwareInput: { name: hardwareOutput.name } as any // Temporary workaround
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a confirmation dialog for hardware panel deletion
   */
  confirmHardwarePanelDeletion(hardwarePanel: any): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: 'Delete Hardware Panel',
        message: `Are you sure you want to delete the hardware panel "${hardwarePanel.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        hardwareInput: { name: hardwarePanel.name } as any // Temporary workaround
      }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Show a confirmation dialog for aircraft model deletion
   */
  confirmAircraftModelDeletion(aircraftModel: any): Observable<boolean> {
    const dialogRef = this.dialog.open(DeleteHardwareInputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        title: 'Delete Aircraft Model',
        message: `Are you sure you want to delete the aircraft model "${aircraftModel.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        hardwareInput: { name: aircraftModel.name } as any // Temporary workaround
      }
    });

    return dialogRef.afterClosed();
  }
}
