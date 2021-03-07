import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";
@Component({
  selector: "app-checkbox",
  template: `
<div class="full-width margin-top" [formGroup]="group" >
<mat-checkbox [formControlName]="field.name">{{field.label}}</mat-checkbox>
</div>
<mat-hint>{{field.hint}}</mat-hint>
`,
  styles: ["mat-hint{ font-size:75%;}"]
})
export class CheckboxComponent implements OnInit {
  field!: FieldConfig;
  group!: FormGroup;
  constructor() {}
  ngOnInit() {}
}
