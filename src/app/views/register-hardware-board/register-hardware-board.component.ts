import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';
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
  registerHardwareBoardForm: FormGroup;

  public totalDiscreteInputOutput: number;

  public boardNameFieldConfig: FieldConfig = {
    type: 'input',
    label: 'Name',
    name: 'name',
    inputType: 'text',
    hint: 'Enter the name of the new Hardware Board',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Board Name is Required',
      },
    ],
  };

  public totalExtendersFieldConfig: FieldConfig = {
    type: 'slider',
    label: 'Total I²C Extenders on board',
    name: 'hardwareBusExtendersCount',
    hint: 'Select Total Extenders (MCP23017)',
    minValue: '1',
    maxValue: '8',
    value: 1,
    stepValue: '1',
  };

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.registerHardwareBoardForm = formBuilder.group({
      name: [, { validators: [Validators.required], updateOn: 'change' }],
      hardwareBusExtendersCount: [, { validators: [Validators.required], updateOn: 'change' }],
    });
    //this.registerHardwareBoardForm.controls["totalExtenders"].setValue(1);
    this.totalDiscreteInputOutput = 16; //Default
  }

  ngOnInit() {}

  onSubmit(formData: any) {
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
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }
  goBack() {
    this.router.navigateByUrl('/manage/hardware-boards');
  }

  onSliderValueChange(slider: MatSlider) {
    if (slider.value != null) this.totalDiscreteInputOutput = slider.value * 16;
  }
}
