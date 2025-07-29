
import { Directive, Input, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { SliderComponent } from '../slider/slider.component';
import { DateComponent } from '../date/date.component';
import { SlideToggleComponent } from '../slide-toggle/slide-toggle.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { RadioButtonComponent } from '../radiobutton/radiobutton.component';

export interface FieldConfig {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  options?: any[];
  validations?: any[];
}

@Directive({
  selector: '[opena3xxDynamicField]'
})
export class DynamicFieldDirective {
  @Input() field!: FieldConfig;

  private componentMap: { [key: string]: Type<any> } = {
    'text': InputComponent,
    'select': SelectComponent,
    'checkbox': CheckboxComponent,
    'slider': SliderComponent,
    'date': DateComponent,
    'toggle': SlideToggleComponent,
    'autocomplete': AutocompleteComponent,
    'radio': RadioButtonComponent
  };

  constructor(private viewContainerRef: ViewContainerRef) {}

  createComponent(): ComponentRef<any> {
    const componentType = this.componentMap[this.field.type];
    if (!componentType) {
      throw new Error(`Unknown field type: ${this.field.type}`);
    }

    this.viewContainerRef.clear();
    return this.viewContainerRef.createComponent(componentType);
  }
}
