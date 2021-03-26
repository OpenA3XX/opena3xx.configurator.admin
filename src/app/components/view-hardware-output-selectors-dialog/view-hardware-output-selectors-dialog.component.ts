import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HardwareOutputDto } from 'src/app/models/models';

@Component({
  selector: 'opena3xx-view-hardware-output-selectors-dialog',
  templateUrl: './view-hardware-output-selectors-dialog.component.html',
  styleUrls: ['./view-hardware-output-selectors-dialog.component.scss'],
})
export class ViewHardwareOutputSelectorsDialogComponent {
  public displayedOutputColumns: string[] = ['id', 'name'];
  outputSelectorsDataSource = new MatTableDataSource<HardwareOutputDto>();

  public hardwareOutputSelector: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: HardwareOutputDto }) {
    this.hardwareOutputSelector = data;
    console.log('Dialog Component', data);
    this.outputSelectorsDataSource = new MatTableDataSource<HardwareOutputDto>(
      this.hardwareOutputSelector.hardwareOutputSelectors
    );
  }
}
