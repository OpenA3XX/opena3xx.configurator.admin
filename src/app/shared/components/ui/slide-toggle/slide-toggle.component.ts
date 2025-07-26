import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
@Component({
    selector: "opena3xx-slide-toggle",
    templateUrl: './slide-toggle.component.html',
    styleUrls: ['./slide-toggle.component.scss'],
    standalone: false
})
export class SlideToggleComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
