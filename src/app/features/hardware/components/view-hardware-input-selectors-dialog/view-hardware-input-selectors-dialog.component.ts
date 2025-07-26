import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HardwareInputDto } from 'src/app/shared/models/models';

interface DialogData {
  data: HardwareInputDto;
}

@Component({
    selector: 'opena3xx-view-hardware-input-selectors-dialog',
    templateUrl: './view-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./view-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class ViewHardwareInputSelectorsDialogComponent {
  public displayedInputColumns: string[] = ['id', 'name'];
  inputSelectorsDataSource = new MatTableDataSource<HardwareInputDto>();

  public hardwareInputSelector: DialogData;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.hardwareInputSelector = data;
    console.log('Dialog Component', data);
    this.inputSelectorsDataSource = new MatTableDataSource<HardwareInputDto>(
      (this.hardwareInputSelector as any).hardwareInputSelectors
    );
  }
}
