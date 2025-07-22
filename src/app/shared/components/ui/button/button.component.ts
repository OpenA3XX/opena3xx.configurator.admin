import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
@Component({
  selector: "opena3xx-button",
  template: `
<div class="full-width margin-top" [formGroup]="group">
<button type="submit" mat-flat-button color="primary">{{field.label}}</button>
</div>
`,
  styles: []
})
export class ButtonComponent {
  field!: FieldConfig;
  group!: FormGroup;
  constructor() {}
}
