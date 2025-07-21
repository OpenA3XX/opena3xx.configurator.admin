import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";
@Component({
  selector: "opena3xx-checkbox",
  template: `
<div class="full-width margin-top" [formGroup]="group" >
<mat-checkbox [formControlName]="field.name">{{field.label}}</mat-checkbox>
</div>
<mat-hint>{{field.hint}}</mat-hint>
`,
  styles: ["mat-hint{ font-size:75%;}"]
})
export class CheckboxComponent {
  field!: FieldConfig;
  group!: FormGroup;
  constructor() {}
}
