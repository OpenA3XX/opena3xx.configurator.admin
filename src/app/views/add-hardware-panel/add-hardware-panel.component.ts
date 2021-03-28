import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldConfig } from 'src/app/models/field.interface';
import { AddHardwarePanelDto } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

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
        key: '0',
        value: 'Glareshield',
      },
      {
        key: '1',
        value: 'Pedestal',
      },
      {
        key: '2',
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

  public hardwarePanelOwnerFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Hardware Panel Owner',
    name: 'hardwarePanelOwner',
    inputType: 'text',
    options: [
      {
        key: '0',
        value: 'Pilot',
      },
      {
        key: '1',
        value: 'Co-Pilot',
      },
      {
        key: '2',
        value: 'Shared',
      },
    ],
    hint: 'Select Hardware Panel Owner for the panel to be assigned to',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Hardware Panel Owner is is Required',
      },
    ],
  };

  constructor(private router: Router, formBuilder: FormBuilder, private dataService: DataService) {
    this.addHardwarePanelForm = formBuilder.group({
      hardwarePanelName: [, { validators: [Validators.required], updateOn: 'change' }],
      aircraftModel: [, { validators: [Validators.required], updateOn: 'change' }],
      cockpitArea: [, { validators: [Validators.required], updateOn: 'change' }],
      hardwarePanelOwner: [, { validators: [Validators.required], updateOn: 'change' }],
    });
  }
  back() {
    this.router.navigateByUrl('/manage/hardware-panels');
  }

  onSave() {}

  onSubmit(hardwarePanelDto: any) {
    if (this.addHardwarePanelForm.valid) {
      this.dataService
        .addHardwarePanel(this.addHardwarePanelForm.value)
        .toPromise()
        .then((data) => {
          console.log(data);
        });
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
