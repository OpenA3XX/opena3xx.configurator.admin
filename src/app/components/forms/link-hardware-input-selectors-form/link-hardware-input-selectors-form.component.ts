import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FieldConfig, OptionList } from 'src/app/models/field.interface';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HardwareInputDto, SimulatorEventItemDto } from 'src/app/models/models';

@Component({
  selector: 'opena3xx-link-hardware-input-selectors-form',
  templateUrl: './link-hardware-input-selectors-form.component.html',
  styleUrls: ['./link-hardware-input-selectors-form.component.scss'],
})
export class LinkHardwareInputSelectorsFormComponent {
  @Input() hardwareInputSelectorId!: number;

  linkHardwareInputSelectorsForm: FormGroup;

  public hardwareInputDto: HardwareInputDto;

  public simulatorEventTestInProgress: boolean = false;

  public simulatorEventsFieldConfig: FieldConfig = {
    type: 'autocomplete',
    label: 'Simulator Event',
    name: 'simulatorEvents',
    inputType: 'text',
    options: [],
    hint: 'Select event to trigger to the Simulator Software',
    // validations: [
    //   {
    //     name: 'required',
    //     validator: Validators.required,
    //     message: 'Simulator Event is Required',
    //   },
    // ],
  };

  public integrationTypeFieldConfig: FieldConfig = {
    type: 'select',
    label: 'Integration Type',
    name: 'integrationTypes',
    inputType: 'text',
    options: [],
    hint: 'Select type of integration to the Simulator Software',
    validations: [
      {
        name: 'required',
        validator: Validators.required,
        message: 'Integration Type is Required',
      },
    ],
  };

  public eventDetails: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HardwareInputDto,
    formBuilder: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar
  ) {
    this.hardwareInputDto = data;

    this.linkHardwareInputSelectorsForm = formBuilder.group({
      integrationTypes: [, { validators: [Validators.required], updateOn: 'change' }],
      simulatorEvents: [, { validators: [Validators.required], updateOn: 'change' }],
    });

    this.fetchData();
  }

  fetchData() {
    this.dataService
      .getAllIntegrationTypes()
      .toPromise()
      .then((integrationTypes: OptionList[]) => {
        this.integrationTypeFieldConfig.options = integrationTypes;
      })
      .then(() => {
        return this.dataService
          .getHardwareInputSelectorDetails(this.hardwareInputSelectorId)
          .toPromise();
      })
      .then((hardwareInputSelectorDetails: any) => {
        if (hardwareInputSelectorDetails.simulatorEventDto != undefined) {
          this.linkHardwareInputSelectorsForm.controls['integrationTypes'].setValue(
            hardwareInputSelectorDetails.simulatorEventDto.simulatorEventSdkType
          );
          return hardwareInputSelectorDetails;
        }
      })
      .then((hardwareInputSelectorDetails: any) => {
        if (hardwareInputSelectorDetails != undefined) {
          this.dataService
            .getAllSimulatorEventsByIntegrationType(
              hardwareInputSelectorDetails.simulatorEventDto.simulatorEventSdkType
            )
            .toPromise()
            .then((data: SimulatorEventItemDto[]) => {
              _.each(data, (entry) => {
                this.simulatorEventsFieldConfig.options.push({
                  key: entry.id.toString(),
                  value: `${entry.eventName} => ${entry.eventCode}`,
                });
              });
              this.linkHardwareInputSelectorsForm.controls['simulatorEvents'].setValue(
                //hardwareInputSelectorDetails.simulatorEventDto.id.toString()
                hardwareInputSelectorDetails.simulatorEventDto.eventCode
              );
            });
        }
      });
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }

  onSimulatorEventTest() {
    this.simulatorEventTestInProgress = true;
  }

  onSave() {
    this.simulatorEventTestInProgress = false;
  }

  onSubmit(formData: any) {
    //if (this.linkHardwareInputSelectorsForm.valid) {
    if (this.simulatorEventTestInProgress) {
      this.dataService
        .sendSimulatorTestEvent(this.linkHardwareInputSelectorsForm.value.simulatorEvents)
        .toPromise()
        .then(() => {
          this._snackBar.open('Simulator Test Event Sent Successfully', 'Ok', {
            duration: 1000,
          });
        });
    } else {
      console.log('huss', this.linkHardwareInputSelectorsForm.controls['simulatorEvents']);
      // this.dataService
      //   .linkSimulatorEventToHardwareInputSelector(
      //     this.hardwareInputSelectorId,
      //     this.linkHardwareInputSelectorsForm.value.simulatorEvents
      //   )
      //   .toPromise()
      //   .then(() => {
      //     this._snackBar.open('Linking Saved Successfully', 'Ok', {
      //       duration: 3000,
      //     });
      //   });
    }
    console.log(
      'hardwareInputDto',
      this.hardwareInputDto,
      'HardwareInputSelectorId',
      this.hardwareInputSelectorId,
      'FormData',
      this.linkHardwareInputSelectorsForm.value
    );
    //} else {
    // this.validateAllFormFields(this.linkHardwareInputSelectorsForm);
    //}
  }

  onIntegrationTypeChange(selectChangeEvent: any) {
    this.simulatorEventsFieldConfig.options = [];
    this.dataService
      .getAllSimulatorEventsByIntegrationType(selectChangeEvent.value)
      .toPromise()
      .then((data: SimulatorEventItemDto[]) => {
        _.each(data, (entry) => {
          this.simulatorEventsFieldConfig.options.push({
            key: entry.id.toString(),
            value: `${entry.eventName} => ${entry.eventCode}`,
          });
        });
        console.log(data);
      });
    this.linkHardwareInputSelectorsForm.controls['simulatorEvents'].reset();
  }
}
