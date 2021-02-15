import { Component } from "@angular/core";

@Component({
    selector: 'opena3xx-save-success',
    template: `
    <h1 mat-dialog-title>Save Success</h1>
    <div mat-dialog-content>Operation has been completed successfully</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
    `,
  })
  export class SaveSuccessDialog {}