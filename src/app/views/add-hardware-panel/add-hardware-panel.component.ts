
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../services/data.service'; // Adjust path as needed
import { FieldConfig } from '../../models/field.interface'; // Adjust path as needed

@Component({
  selector: 'opena3xx-add-hardware-panel',
  templateUrl: './add-hardware-panel.component.html',
  styleUrls: ['./add-hardware-panel.component.scss'],
})
export class AddHardwarePanelComponent {
  addHardwarePanelForm: FormGroup;

  // Your field configs remain the same
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
        message: 'Aircraft Model is Required',
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
        message: 'Cockpit Area is Required',
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
        message: 'Hardware Panel Owner is Required',
      },
    ],
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {
    // ✅ Correct way to define FormControls in Angular 17
    this.addHardwarePanelForm = this.formBuilder.group({
      hardwarePanelName: ['', [Validators.required]],
      aircraftModel: ['', [Validators.required]],
      cockpitArea: ['', [Validators.required]],
      hardwarePanelOwner: ['', [Validators.required]],
    });

    // Alternative syntax if you need updateOn strategy:
    // this.addHardwarePanelForm = this.formBuilder.group({
    //   hardwarePanelName: this.formBuilder.control('', {
    //     validators: [Validators.required],
    //     updateOn: 'change'
    //   }),
    //   aircraftModel: this.formBuilder.control('', {
    //     validators: [Validators.required],
    //     updateOn: 'change'
    //   }),
    //   cockpitArea: this.formBuilder.control('', {
    //     validators: [Validators.required],
    //     updateOn: 'change'
    //   }),
    //   hardwarePanelOwner: this.formBuilder.control('', {
    //     validators: [Validators.required],
    //     updateOn: 'change'
    //   }),
    // });
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
        .then(() => {
          this.snackBar.open('Hardware Panel Added Successfully', 'Ok', {
            duration: 3000,
          });
          // Navigate back after successful save
          this.back();
        })
        .catch((error) => {
          console.error('Error adding hardware panel:', error);
          this.snackBar.open('Error has occurred when adding Hardware Panel', 'Ok', {
            duration: 3000,
          });
        });
    } else {
      this.validateAllFormFields(this.addHardwarePanelForm);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
