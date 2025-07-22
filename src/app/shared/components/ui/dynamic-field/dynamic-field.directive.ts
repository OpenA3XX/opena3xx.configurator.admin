
import {
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,
  Type
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "src/app/shared/models/field.interface";
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";
import { SelectComponent } from "../select/select.component";
import { DateComponent } from "../date/date.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { HeadingComponent } from "../heading/heading.component";
import { SlideToggleComponent } from "../slide-toggle/slide-toggle.component";
import { SliderComponent } from "../slider/slider.component";

const componentMapper: { [key: string]: Type<unknown> } = {
  input: InputComponent,
  button: ButtonComponent,
  select: SelectComponent,
  date: DateComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  heading: HeadingComponent,
  slidertoggle: SlideToggleComponent,
  slider: SliderComponent
};

@Directive({
  selector: '[opena3xxDynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() field!: FieldConfig;
  @Input() group!: FormGroup;
  componentRef: ComponentRef<any> | null = null;

  constructor(private container: ViewContainerRef) {}

  ngOnInit() {
    const componentType = componentMapper[this.field.type];
    if (!componentType) {
      console.error(`Component type "${this.field.type}" not found in componentMapper`);
      return;
    }

    // Modern way to create components (Angular 13+)
    this.componentRef = this.container.createComponent(componentType);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }
}
