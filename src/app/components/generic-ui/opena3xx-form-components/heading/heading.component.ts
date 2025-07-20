import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field.interface';

@Component({
  selector: 'opena3xx-heading',
  template: `
    <h5>{{ field.label }}</h5>
  `,
  styles: [`
    h5 {
      font-size: 20px;
      border-bottom: 1px dashed #d0d0d0;
      margin-top: 40px;
      margin-bottom: 20px;
    }
  `],
  standalone: true
})
export class HeadingComponent {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;
}
