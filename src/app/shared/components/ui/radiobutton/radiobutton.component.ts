import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
@Component({
  selector: "opena3xx-radiobutton",
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss']
})
export class RadiobuttonComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
