import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';

@Component({
  selector: 'opena3xx-slider',
  template: `
    <div class="slider-container" [formGroup]="group" *ngIf="field">
      <mat-label>{{field.label}}</mat-label>
      <mat-slider
        [min]="field.minValue || 0"
        [max]="field.maxValue || 100"
        [step]="field.stepValue || 1"
        [value]="field.value || 0"
        (input)="onSliderChange($event)"
        class="full-width">
        <input matSliderThumb [formControlName]="field.name">
      </mat-slider>
      <mat-hint *ngIf="field.hint">{{field.hint}}</mat-hint>
    </div>
  `,
  styles: [`
    .slider-container {
      width: 100%;
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class SliderComponent implements OnInit {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;
  @Output() sliderValueChange = new EventEmitter<number>();

  ngOnInit() {
    if (!this.field) {
      console.error('SliderComponent: field input is required');
    }
    if (!this.group) {
      console.error('SliderComponent: group input is required');
    }
  }

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    this.sliderValueChange.emit(value);
  }
}
