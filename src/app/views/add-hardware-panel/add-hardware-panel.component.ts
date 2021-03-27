import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldConfig } from 'src/app/models/field.interface';

@Component({
  selector: 'opena3xx-add-hardware-panel',
  templateUrl: './add-hardware-panel.component.html',
  styleUrls: ['./add-hardware-panel.component.scss'],
})
export class AddHardwarePanelComponent {
  addHardwarePanelForm: FormGroup;

  public hardwarePanelNameFieldConfig: FieldConfig = {
    type: 'input',
    label: 'Hardware Panel Name',
    name: 'hardwarePanelName',
    inputType: 'text',
    hint: 'Enter the Hardware Panel Name',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Panel Name is Required',
      },
    ],
  };

  public aircraftManufacturerFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Aircraft Manufacturer',
    name: 'aircraftManufacturer',
    inputType: 'text',
    options: [
      {
        key: 'airbus',
        value: 'Airbus',
      },
    ],
    hint: 'Select Manufacturer for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Aircraft Manufacturer is Required',
      },
    ],
  };

  public aircraftModelFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Aircraft Model',
    name: 'aircraftModel',
    inputType: 'text',
    options: [
      {
        key: '1',
        value: 'A320-NEO',
      },
    ],
    hint: 'Select Aircraft Model for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Aircraft Model is  Required',
      },
    ],
  };

  public cockpitAreaFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Cockpit Area',
    name: 'cockpitArea',
    inputType: 'text',
    options: [
      {
        key: 'pedestal',
        value: 'Pedestal',
      },
      {
        key: 'overhead',
        value: 'Overhead',
      },
    ],
    hint: 'Select Cockpit Area for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Cockpit Area is  Required',
      },
    ],
  };

  public cockpitOwnerFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Cockpit Owner',
    name: 'cockpitOwner',
    inputType: 'text',
    options: [
      {
        key: 'pilot',
        value: 'Pilot',
      },
      {
        key: 'co-pilot',
        value: 'Co-Pilot',
      },
      {
        key: 'shared',
        value: 'Shared',
      },
    ],
    hint: 'Select Cockpit Owner for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Cockpit Owner is is Required',
      },
    ],
  };

  constructor(private router: Router, formBuilder: FormBuilder) {
    this.addHardwarePanelForm = formBuilder.group({
      hardwarePanelName: [, { validators: [Validators.required], updateOn: 'change' }],
      aircraftModel: [, { validators: [Validators.required], updateOn: 'change' }],
      aircraftManufacturer: [, { validators: [Validators.required], updateOn: 'change' }],
      cockpitArea: [, { validators: [Validators.required], updateOn: 'change' }],
      cockpitOwner: [, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  back() {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  onSave() {}

  onSubmit(data) {
    if (this.addHardwarePanelForm.valid) {
    } else {
      this.validateAllFormFields(this.addHardwarePanelForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }
}
