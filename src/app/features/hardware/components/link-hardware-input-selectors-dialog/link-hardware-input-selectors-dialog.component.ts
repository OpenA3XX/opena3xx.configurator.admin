import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardwareInputDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-link-hardware-input-selectors-dialog',
    templateUrl: './link-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./link-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class LinkHardwareInputSelectorsDialogComponent {
  public hardwareInputSelector: HardwareInputDto;

  constructor(@Inject(MAT_DIALOG_DATA) public data: HardwareInputDto) {
    this.hardwareInputSelector = data;
  }
}
