import { Component } from '@angular/core';

@Component({
  selector: 'opena3xx-exit-app-dialog',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>Are you sure you want to exit OpenA3XX Configurator App?</div>
    <div mat-dialog-actions>
      <button mat-button (click)="exit()">Yes</button>
      <button mat-button mat-flat-button color="primary" mat-dialog-close>No</button>
    </div>
  `,
})
export class ExitAppDialog {
  exit() {
    window.close();
  }
}
