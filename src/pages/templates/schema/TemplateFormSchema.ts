import { InputValidationRules, type IFields } from '../../../utils/validation';

export const TemplateFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g., Plumbing Repair, Electrical Installation',
    label: 'Template Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Brief description of this template',
    label: 'Description',
    isRequired: false,
  },
  isDefault: {
    title: 'isDefault',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    placeHolder: '',
    label: 'Set as default template',
    isRequired: false,
  },
};

export interface TemplateFormData {
  name: string;
  description?: string;
  isDefault?: boolean;
}
