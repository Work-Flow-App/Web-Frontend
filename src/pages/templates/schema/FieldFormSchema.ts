import { InputValidationRules, type IFields } from '../../../utils/validation';

export const FieldFormSchema: IFields = {
  label: {
    title: 'label',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g., Issue Type, Location',
    label: 'Field Label',
    isRequired: true,
  },
  jobFieldType: {
    title: 'jobFieldType',
    rule: InputValidationRules.DropDownRequired(),
    defaultValue: null,
    placeHolder: 'Select field type',
    label: 'Field Type',
    isRequired: true,
  },
  required: {
    title: 'required',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    placeHolder: '',
    label: 'Required Field',
    isRequired: false,
  },
  options: {
    title: 'options',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Comma-separated values: Low, Medium, High',
    label: 'Dropdown Options',
    isRequired: false,
  },
};

export interface FieldFormData {
  label: string;
  jobFieldType: string;
  required?: boolean;
  options?: string;
}
