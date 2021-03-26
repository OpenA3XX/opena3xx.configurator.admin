import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardwareOutputDto } from '../../models/models';

@Component({
  selector: 'opena3xx-map-hardware-output-selectors-dialog',
  templateUrl: './map-hardware-output-selectors-dialog.component.html',
  styleUrls: ['./map-hardware-output-selectors-dialog.component.scss'],
})
export class MapHardwareOutputSelectorsDialogComponent {
  public hardwareOutputSelector: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto }) {
    this.hardwareOutputSelector = data;
    console.log('Dialog Component', data);
  }
}
