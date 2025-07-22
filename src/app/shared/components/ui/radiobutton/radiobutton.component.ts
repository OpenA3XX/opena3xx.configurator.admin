import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
@Component({
  selector: "opena3xx-radiobutton",
  template: `
<div class="full-width margin-top" [formGroup]="group">
<label class="radio-label-padding">{{field.label}}:</label>
<mat-radio-group [formControlName]="field.name">
<mat-radio-button *ngFor="let item of field.options" [value]="item.key">{{item.value}}</mat-radio-button>
</mat-radio-group>
</div>
<mat-hint>{{field.hint}}</mat-hint>
`,
styles: ["mat-hint{ font-size:75%;}"]
})
export class RadiobuttonComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
