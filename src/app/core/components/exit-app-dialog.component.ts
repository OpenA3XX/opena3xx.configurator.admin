import { Component } from '@angular/core';

@Component({
  selector: 'opena3xx-exit-app-dialog',
  templateUrl: './exit-app-dialog.component.html',
  styleUrls: ['./exit-app-dialog.component.scss']
})
export class ExitAppDialogComponent {
  exit() {
    window.close();
  }
}
