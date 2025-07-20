
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { FieldConfig } from "../../../../models/field.interface";

@Component({
  exportAs: "dynamicForm",
  selector: 'opena3xx-dynamic-form',
  template: `
    <form class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
      <ng-container *ngFor="let field of fields;" opena3xxDynamicField [field]="field" [group]="form">
      </ng-container>
    </form>
  `,
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() identifier!: number;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;

  get value() {
    return this.form.value;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.form = this.createControl();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      if (this.identifier !== undefined) {
        this.form.value.identifier = this.identifier;
      }
      this.submit.emit(this.form.value);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button" || field.type === "heading") return;

      // Handle boolean values
      if (field.value === "true") {
        field.value = true;
      } else if (field.value === "false") {
        field.value = false;
      }

      // ✅ Correct way to create FormControl with validators
      const validators = this.bindValidations(field.validations || []);
      const control = this.fb.control(field.value || '', validators);

      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any[]) {
    if (validations && validations.length > 0) {
      const validList: any[] = [];
      validations.forEach(valid => {
        if (valid.name === "required") {
          validList.push(Validators.required);
        } else if (valid.name === "pattern") {
          validList.push(Validators.pattern(valid.pattern));
        } else if (valid.validator) {
          validList.push(valid.validator);
        }
      });
      return validList.length > 0 ? validList : null;
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
