import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field.interface";
@Component({
  selector: "app-heading",
  template: `
  <h5>
  {{field.label}}
  </h5>`,
  styles: ["h5 { font-size:20px; margin-top:20px; }"]
})
export class HeadingComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
  ngOnInit() {}
}
