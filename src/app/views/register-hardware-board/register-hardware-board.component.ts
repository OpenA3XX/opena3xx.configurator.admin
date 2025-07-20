
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FieldConfig } from 'src/app/models/field.interface';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './register-hardware-board.component.html',
  styleUrls: ['./register-hardware-board.component.scss'],
  selector: 'opena3xx-register-hardware-board',
})
export class RegisterHardwareBoardComponent implements OnInit {
  public registerHardwareBoardForm: FormGroup;

  public totalDiscreteInputOutput: number;

  public boardNameFieldConfig: FieldConfig = {
    hint: 'Enter the name of the new Hardware Board',
    inputType: 'text',
    label: 'Name',
    name: 'name',
    type: 'input',
    validations: [
      {
        message: 'Hardware Board Name is Required',
        name: 'required',
        validator: Validators.required,
      },
    ],
  };

  public totalExtendersFieldConfig: FieldConfig = {
    hint: 'Select Total Extenders (MCP23017)',
    label: 'Total I²C Extenders on board',
    maxValue: '8',
    minValue: '1',
    name: 'hardwareBusExtendersCount',
    stepValue: '1',
    type: 'slider',
    value: 1,
  };

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
  ) {
    this.registerHardwareBoardForm = formBuilder.group({
      name: [, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtendersCount: [, { validators: [Validators.required], updateOn: 'change' }],
    });
    this.totalDiscreteInputOutput = 16; //Default
  }

  ngOnInit() {}

  onSubmit = (formData: any) => {
    if (this.registerHardwareBoardForm.valid) {
      this.dataService
        .addHardwareBoards(this.registerHardwareBoardForm.value)
        .toPromise()
        .then(() => {
          this._snackBar.open('Hardware Board Registed Successfully', 'Ok', {
            duration: 5000,
          });
        });
    } else {
      this.validateAllFormFields(this.registerHardwareBoardForm);
    }
  };

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  goBack() {
    this.router.navigateByUrl('/manage/hardware-boards');
  }

  onSliderValueChange(event: any) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.totalDiscreteInputOutput = value * 16;
  }
}
