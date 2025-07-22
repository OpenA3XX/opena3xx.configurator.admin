import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
@Component({
  selector: "opena3xx-slide-toggle",
  template: `<div class="full-width margin-top" [formGroup]="group">
                <mat-slide-toggle [formControlName]="field.name">
                  {{field.label}}
                </mat-slide-toggle>
            </div>
            <mat-hint>{{field.hint}}</mat-hint>
            `,
  styles: ["mat-hint{ font-size:75%;}"]
})
export class SlideToggleComponent {
  field: FieldConfig;
  group: FormGroup;
  constructor() {}
}
