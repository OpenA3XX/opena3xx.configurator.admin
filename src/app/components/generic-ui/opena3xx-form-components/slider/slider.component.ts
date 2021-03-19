import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";
@Component({
  selector: "opena3xx-slider",
  template: `<div class="full-width margin-top" [formGroup]="group">
                <label class="radio-label-padding">{{field.label}}: {{slider.displayValue}}</label>
                <mat-slider #slider
                  [formControlName]="field.name"
                  [step]="field.stepValue"
                  [min]="field.minValue"
                  [max]="field.maxValue"
                  (input)="onSliderValuetChange($event)"
                  [value]="field.value"
                  >
                </mat-slider>
            </div>
            <mat-hint>{{field.hint}}</mat-hint>
            `,
  styles: ["mat-hint{ font-size:75%;} .mat-slider-horizontal {width: 100%;}"]
})
export class SliderComponent implements OnInit {

  @Output() onSliderValueChange: EventEmitter<any> = new EventEmitter<any>();

  
  @Input() field!: FieldConfig;

  @Input() group!: FormGroup;
  constructor() {}
  ngOnInit() {}

  onSliderValuetChange(event: any){
    this.onSliderValueChange.emit(event);
    console.log("Event OnSliderValueChange Change Emmited");
  }

}
