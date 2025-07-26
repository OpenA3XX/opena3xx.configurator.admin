import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { DataService } from 'src/app/core/services/data.service';
import { HardwareInputDto } from 'src/app/shared/models/models';


@Component({
    selector: 'opena3xx-map-hardware-input-selectors-dialog',
    templateUrl: './map-hardware-input-selectors-dialog.component.html',
    styleUrls: ['./map-hardware-input-selectors-dialog.component.scss'],
    standalone: false
})
export class MapHardwareInputSelectorsDialogComponent {
  public hardwareInputSelector: any;
  public hardwareBoardSelectorFields: FieldConfig[] = [];
  dataLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { data: HardwareInputDto },
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.hardwareInputSelector = data;
  }

  submit(formData: any) {
    const index = _.find(this.hardwareInputSelector.hardwareInputSelectors, (o) => {
      return o.id === formData.identifier;
    });
    this._snackBar.open(
      `Mapping for ${this.hardwareInputSelector.name} => State ${index.name} saved successfully`,
      'Ok',
      {
        duration: 5000,
      }
    );
  }
}
