import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogWrapperConfig } from 'src/app/shared/components/ui/dialog-wrapper/dialog-wrapper.component';

@Component({
    selector: 'opena3xx-exit-app-dialog',
    templateUrl: './exit-app-dialog.component.html',
    styleUrls: ['./exit-app-dialog.component.scss'],
    standalone: false
})
export class ExitAppDialogComponent {
  wrapperConfig: DialogWrapperConfig;

  constructor(private dialogRef: MatDialogRef<ExitAppDialogComponent>) {
    this.initializeWrapperConfig();
  }

  private initializeWrapperConfig(): void {
    this.wrapperConfig = {
      title: 'Exit OpenA3XX Flight Deck?',
      subtitle: 'If it\'s not what you want, click cancel.',
      icon: 'exit_to_app',
      size: 'small',
      showCloseButton: true,
      showFooter: true
    };
  }

  exit(): void {
    window.close();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
