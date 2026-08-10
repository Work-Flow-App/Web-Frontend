import { InputValidationRules, type IFields } from '../../../utils/validation';

export const FormTemplateMetaSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter form template name',
    label: 'Template Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter description (optional)',
    label: 'Description',
    isRequired: false,
  },
};

export interface FormTemplateMetaData {
  name: string;
  description?: string;
}
