import { InputValidationRules, type IFields } from '../../../utils/validation';

export const WorkflowFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter workflow name',
    label: 'Workflow Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter workflow description (optional)',
    label: 'Description',
    isRequired: false,
  },
};

export interface WorkflowFormData {
  name: string;
  description?: string;
}
