export interface Validator {
  name: string;
  validator: any;
  message: string;
}
export interface FieldConfig {
  label?: string;
  name: string;
  inputType?: string;
  //options?: {[key: string]: string};
  options?: OptionList[];
  collections?: any;
  type?: string;
  value?: any;
  validations?: Validator[];
  hint?: string;
  stepValue?: string;
  minValue?: string;
  maxValue?: string;
}

export interface OptionList {
  key: string;
  value: string;
}
