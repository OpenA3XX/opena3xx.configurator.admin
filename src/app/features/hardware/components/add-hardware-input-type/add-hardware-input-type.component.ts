import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareInputTypeDto } from 'src/app/shared/models/models';

@Component({
    selector: 'opena3xx-add-hardware-input-type',
    templateUrl: './add-hardware-input-type.component.html',
    styleUrls: ['./add-hardware-input-type.component.scss'],
    standalone: false
})
export class AddHardwareInputTypeComponent {
  public hardwareInputTypeName: string = '';

  private hardwreInputTypeDto: HardwareInputTypeDto = { name: '' };
  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  addHardwareInputType() {
    if (this.hardwareInputTypeName !== '') {
      this.hardwreInputTypeDto.name = this.hardwareInputTypeName;

      this.dataService
        .addHardwareInputType(this.hardwreInputTypeDto)
        .toPromise()
        .then(() => {
          this._snackBar.open('Hardware Input Type Saved Successfully', 'Ok', {
            duration: 5000,
          });
        });
    }
  }

  goBack() {
    this.router.navigateByUrl(`/manage/hardware-input-types`);
  }
}
