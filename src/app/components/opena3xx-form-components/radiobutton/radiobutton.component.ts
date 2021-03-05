import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field.interface";
@Component({
  selector: "app-radiobutton",
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
export class RadiobuttonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
