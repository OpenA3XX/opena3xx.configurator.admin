import { Component, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSlider } from "@angular/material/slider";
import { Router } from "@angular/router";
import { FieldConfig } from "src/app/models/field.interface";


@Component({
    templateUrl: "./register-hardware-board.component.html",
    styleUrls: ["./register-hardware-board.component.scss"],
    selector:"opena3xx-register-hardware-board"
})
export class RegisterHardwareBoardComponent implements OnInit{
    
    registerHardwareBoardForm: FormGroup;

    public totalDiscreteInputOutput: number;

    public boardNameFieldConfig : FieldConfig = {
        type: "input",
        label: "Name",
        name: "name",
        inputType: "text",
        hint: "Enter the name of the new Hardware Board",
        validations: [{
            name: "required",
            validator: Validators.required,
            message: "Hardware Board Name is Required"        
        }]
      }

      public totalExtendersFieldConfig : FieldConfig = {
        type: "slider",
        label: "Total Extenders",
        name: "totalExtenders",
        hint: "Select Total Extenders",
        minValue: "1",
        maxValue: "8",
        value:1,
        stepValue: "1"
      }

      constructor(formBuilder: FormBuilder,
        private router: Router)
      {
        
        this.registerHardwareBoardForm = formBuilder.group({
            name : [, { validators: [Validators.required], updateOn: "change" }],
            totalExtenders : [, { validators: [Validators.required], updateOn: "change" }]
          });
        //this.registerHardwareBoardForm.controls["totalExtenders"].setValue(1);
        this.totalDiscreteInputOutput = 16; //Default
      }

      ngOnInit(){
        
      }

      onSubmit(formData: any) {
        if(this.registerHardwareBoardForm.valid){
            console.log(this.registerHardwareBoardForm.value)
        }else{
            this.validateAllFormFields(this.registerHardwareBoardForm);
        }
      }

      validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
          const control = formGroup.get(field);
          control!.markAsTouched({ onlySelf: true });
        });
      }
      goBack(){
        this.router.navigateByUrl("/manage/hardware-boards")
      }

      onSliderValueChange(slider: MatSlider){
        this.totalDiscreteInputOutput = slider.value * 16;
      }

}