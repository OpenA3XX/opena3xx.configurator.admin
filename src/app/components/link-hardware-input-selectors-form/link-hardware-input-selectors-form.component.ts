import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardwareInputDto } from "src/app/models/hardware.panel.dto";

import { FieldConfig } from "src/app/models/field.interface";
import * as _ from "lodash";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";

@Component({
  selector: 'opena3xx-link-hardware-input-selectors-form',
  templateUrl: './link-hardware-input-selectors-form.component.html',
  styleUrls: ['./link-hardware-input-selectors-form.component.scss']
})
export class LinkHardwareInputSelectorsFormComponent implements OnInit{

  @Input() hardwareInputSelectorId!: number;

  public hardwareInputSelector : any;
  linkHardwareInputSelectorsForm: FormGroup;

  public simulatorEventsFieldConfig : FieldConfig = {
      type: "select",
      label: "Simulator Event",
      name: "simulatorEvents",
      inputType: "text",
      options: [
        {
          key: "1",
          value: "Pilot.Barometer.QFE - XMLVAR_Baro1_Mode_QFE#0 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "2",
          value: "Pilot.Barometer.QNH - XMLVAR_Baro1_Mode_QNH#1 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "3",
          value: "Pilot.Barometer.STD - XMLVAR_Baro1_Mode_STD#2 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "4",
          value: "Pilot.MFD.CSTR - A320_Neo_MFD_BTN_CSTR_1#(>H:A320_Neo_MFD_BTN_CSTR_1)"
        }
    ],
    hint: "Select event to trigger to the Simulator Software",
    validations: [{
        name: "required",
        validator: Validators.required,
        message: "Simulator Event is Required"        
    }]
  }

  public integrationTypeFieldConfig : FieldConfig = {
    type: "select",
    label: "Integration Type",
    name: "integrationTypes",
    inputType: "text",
    options: [
      {
        "key": "1",
        "value": "SimConnect: Direct"
      },
      {
        "key": "2",
        "value": "SimConnect: OpenA3XX WASM Gauge"
      },
      {
        "key": "3",
        "value": "FSUIPC"
      },
      {
        "key": "4",
        "value": "Websockets"
      }
    ],
    hint: "Select type of integration to the Simulator Software",
    validations: [{
        name: "required",
        validator: Validators.required,
        message: "Integration Type is Required"        
    }]
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {data: HardwareInputDto},
    formBuilder: FormBuilder
    ) { 
      this.hardwareInputSelector = data;

      this.linkHardwareInputSelectorsForm = formBuilder.group({
        integrationTypes: [, { validators: [Validators.required], updateOn: "change" }],
        simulatorEvents: [, { validators: [Validators.required], updateOn: "change" }],
      });
  }

  ngOnInit(): void {
    //To Preset value
    //this.linkHardwareInputSelectorsForm.controls["integrationTypes"].setValue("2");
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control!.markAsTouched({ onlySelf: true });
    });
  }
  onSubmit(formData: any) {
    
    if(this.linkHardwareInputSelectorsForm.valid){
      console.log("HardwareInputSelectorId", this.hardwareInputSelectorId, "FormData", this.linkHardwareInputSelectorsForm.value)
    }
    else{
      this.validateAllFormFields(this.linkHardwareInputSelectorsForm);
    }
  }

  onIntegrationTypeChange(selectChangeEvent: any){
    //Dummy WIP
    if(selectChangeEvent.value == "1"){
      this.simulatorEventsFieldConfig.options = [
        {
          key: "1",
          value: "1 Pilot.Barometer.QFE - XMLVAR_Baro1_Mode_QFE#0 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "2",
          value: "2 Pilot.Barometer.QNH - XMLVAR_Baro1_Mode_QNH#1 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "3",
          value: "3 Pilot.Barometer.STD - XMLVAR_Baro1_Mode_STD#2 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "4",
          value: "4 Pilot.MFD.CSTR - A320_Neo_MFD_BTN_CSTR_1#(>H:A320_Neo_MFD_BTN_CSTR_1)"
        }
    ];
    }else{
      this.simulatorEventsFieldConfig.options = [
        {
          key: "5",
          value: "5 Pilot.Barometer.QFE - XMLVAR_Baro1_Mode_QFE#0 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "6",
          value: "6 Pilot.Barometer.QNH - XMLVAR_Baro1_Mode_QNH#1 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "7",
          value: "7 Pilot.Barometer.STD - XMLVAR_Baro1_Mode_STD#2 (>L:XMLVAR_Baro1_Mode)"
        },
        {
          key: "8",
          value: "8 Pilot.MFD.CSTR - A320_Neo_MFD_BTN_CSTR_1#(>H:A320_Neo_MFD_BTN_CSTR_1)"
        }]
    }

    this.linkHardwareInputSelectorsForm.controls["simulatorEvents"].reset();
  }

}




