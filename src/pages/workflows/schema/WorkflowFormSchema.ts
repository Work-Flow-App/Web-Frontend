import { InputValidationRules, type IFields } from '../../../utils/validation';

export const WorkflowFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter workfloow name',
    label: 'Workfloow Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter workfloow description (optional)',
    label: 'Description',
    isRequired: false,
  },
};

export interface WorkflowFormData {
  name: string;
  description?: string;
}
