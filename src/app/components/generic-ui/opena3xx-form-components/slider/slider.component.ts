
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";

@Component({
  selector: 'opena3xx-slider',
  styles: [
    `
      mat-hint {
        font-size: 75%;
      }

      mat-slider {
        width: 100%;
      }
    `,
  ],
  template: `
    <div class="full-width margin-top" [formGroup]="group">
      <label class="radio-label-padding">{{ field.label }}: {{ value }}</label>
      <mat-slider [min]="field.minValue" [max]="field.maxValue" [step]="field.stepValue">
        <input
          matSliderThumb
          [formControlName]="field.name"
          (input)="onSliderValuetChange($event)"
          [value]="field.value"
        />
      </mat-slider>
    </div>
    <mat-hint>{{ field.hint }}</mat-hint>
  `,
})
export class SliderComponent implements OnInit {
  @Output() onSliderValueChange = new EventEmitter<any>();
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;
  value: number = 0;

  constructor() {}

  ngOnInit() {
    this.value = this.field.value;
    if (this.group.get(this.field.name)) {
      this.group.get(this.field.name)?.valueChanges.subscribe((value) => {
        this.value = value;
      });
    }
  }

  onSliderValuetChange(event: any) {
    this.value = event.target.value;
    this.onSliderValueChange.emit(event);
  }
}
