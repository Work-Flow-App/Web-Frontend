import { InputValidationRules, type IFields } from '../../../utils/validation';

export const FieldFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g., issue_type, location',
    label: 'Field Name',
    isRequired: true,
  },
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
    rule: InputValidationRules.StringNotRequired,
    defaultValue: 'false',
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
  orderIndex: {
    title: 'orderIndex',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: 0,
    placeHolder: '0',
    label: 'Order Index',
    isRequired: false,
  },
};

export interface FieldFormData {
  name: string;
  label: string;
  jobFieldType: string;
  required?: boolean;
  options?: string;
  orderIndex?: number;
}
