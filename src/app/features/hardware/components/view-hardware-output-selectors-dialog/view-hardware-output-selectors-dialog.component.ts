import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HardwareOutputDto } from 'src/app/shared/models/models';

interface DialogData {
  data: HardwareOutputDto;
}

@Component({
    selector: 'opena3xx-view-hardware-output-selectors-dialog',
    templateUrl: './view-hardware-output-selectors-dialog.component.html',
    styleUrls: ['./view-hardware-output-selectors-dialog.component.scss'],
    standalone: false
})
export class ViewHardwareOutputSelectorsDialogComponent {
  public displayedOutputColumns: string[] = ['id', 'name'];
  outputSelectorsDataSource = new MatTableDataSource<HardwareOutputDto>();

  public hardwareOutputSelector: DialogData;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.hardwareOutputSelector = data;
    console.log('Dialog Component', data);
    this.outputSelectorsDataSource = new MatTableDataSource<HardwareOutputDto>(
      (this.hardwareOutputSelector as any).hardwareOutputSelectors
    );
  }
}
