import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FieldConfig } from 'src/app/shared/models/field.interface';
import { DataService } from 'src/app/core/services/data.service';

@Component({
    templateUrl: './register-hardware-board.component.html',
    styleUrls: ['./register-hardware-board.component.scss'],
    selector: 'opena3xx-register-hardware-board',
    standalone: false
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
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
  ) {
    // ✅ Fixed FormControl syntax
    this.registerHardwareBoardForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      hardwareBusExtendersCount: [1, [Validators.required]],
    });
    this.totalDiscreteInputOutput = 16; // Default
  }

  ngOnInit() {
    // Initialize component
  }

  onSubmit = (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    if (this.registerHardwareBoardForm.valid) {
      this.dataService
        .addHardwareBoards(this.registerHardwareBoardForm.value)
        .toPromise()
        .then(() => {
          this._snackBar.open('Hardware Board Registered Successfully', 'Ok', {
            duration: 5000,
          });
          this.goBack();
        })
        .catch((error) => {
          console.error('Error registering hardware board:', error);
          this._snackBar.open('Error occurred while registering Hardware Board', 'Ok', {
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
      control?.markAsTouched({ onlySelf: true });
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
