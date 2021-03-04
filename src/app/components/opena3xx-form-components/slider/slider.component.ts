import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field.interface";
@Component({
  selector: "app-slider",
  template: `<div class="full-width margin-top" [formGroup]="group">
                <label class="radio-label-padding">{{field.label}}:</label>
                <mat-slider 
                  [formControlName]="field.name"
                  [step]="field.stepValue"
                  [min]="field.minValue"
                  [max]="field.maxValue">
                </mat-slider>
            </div>
            <mat-hint>{{field.hint}}</mat-hint>
            `,
  styles: ["mat-hint{ font-size:75%;}"]
})
export class SliderComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
