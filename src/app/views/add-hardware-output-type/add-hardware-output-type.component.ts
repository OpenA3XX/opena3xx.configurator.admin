import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareOutputTypeDto } from 'src/app/models/models';

@Component({
  selector: 'opena3xx-add-hardware-output-type',
  templateUrl: './add-hardware-output-type.component.html',
  styleUrls: ['./add-hardware-output-type.component.scss'],
})
export class AddHardwareOutputTypeComponent {
  public hardwareOutputTypeName: string = '';

  private hardwreOutputTypeDto: HardwareOutputTypeDto = { name: '' };

  constructor(
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  addHardwareOutputType(f: NgForm) {
    if (this.hardwareOutputTypeName !== '') {
      this.hardwreOutputTypeDto.name = this.hardwareOutputTypeName;

      this.dataService
        .addHardwareOutputType(this.hardwreOutputTypeDto)
        .toPromise()
        .then(() => {
          this._snackBar.open('Hardware Output Type Saved Successfully', 'Ok', {
            duration: 5000,
          });
        });
    }
  }

  goBack() {
    this.router.navigateByUrl(`/manage/hardware-output-types`);
  }
}
