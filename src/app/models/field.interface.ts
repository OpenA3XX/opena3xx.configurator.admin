import { ValidatorFn } from '@angular/forms';

export interface Validator {
  name: string;
  validator: ValidatorFn;
  message: string;
  pattern?: string;
}

export interface FormConfiguration {
  [key: string]: string | number | boolean;
}

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: OptionList[];
  collections?: OptionList[];
  type?: string;
  value?: string | number | boolean;
  validations?: Validator[];
  hint?: string;
  stepValue?: string;
  minValue?: string;
  maxValue?: string;
  disabled?: boolean;
}

export interface OptionList {
  key: string;
  value: string;
}
