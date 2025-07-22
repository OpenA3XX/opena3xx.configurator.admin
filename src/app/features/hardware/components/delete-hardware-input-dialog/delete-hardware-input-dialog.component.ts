import { Component, Input, OnInit } from '@angular/core';
import { HardwareInputDto } from 'src/app/shared/models/models';

@Component({
  selector: 'opena3xx-delete-hardware-input-dialog-confirm',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>
      Are you sure you want to delete {{ hardwareInputName }} Hardware Input?
    </div>
    <div mat-dialog-content>
      Enter the word <b>{{ hardwareInputName }}</b> to confirm. This will <u>permanently</u> delete
      the entity.
    </div>
    <form autocomplete="off">
      <mat-form-field class="example-full-width">
        <input (input)="onInputChange($event.target)" matInput value="" />
      </mat-form-field>
    </form>
    <div mat-dialog-actions>
      <button mat-button [disabled]="disabled">Yes</button>
      <button mat-button mat-flat-button color="primary" mat-dialog-close>No</button>
    </div>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin-top: 15px;
      }
      b {
        font-weight: bold;
      }
      .mat-dialog-content {
        margin-bottom: 10px;
        text-align: center;
      }
    `,
  ],
})
export class DeleteHardwareInputDialogComponent implements OnInit {
  disabled: boolean = true;
  hardwareInputName: string = '';

  @Input() hardwareInput: HardwareInputDto;

  ngOnInit() {
    this.hardwareInputName = this.hardwareInput.name;
  }
  onInputChange(target) {
    target.value === this.hardwareInputName ? (this.disabled = false) : (this.disabled = true);
  }
}
