import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HardwareOutputDto } from 'src/app/shared/models/models';

interface DialogData {
  data: HardwareOutputDto;
}

@Component({
    selector: 'opena3xx-map-hardware-output-selectors-dialog',
    templateUrl: './map-hardware-output-selectors-dialog.component.html',
    styleUrls: ['./map-hardware-output-selectors-dialog.component.scss'],
    standalone: false
})
export class MapHardwareOutputSelectorsDialogComponent {
  public hardwareOutputSelector: DialogData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.hardwareOutputSelector = data;
    console.log('Dialog Component', data);
  }
}
