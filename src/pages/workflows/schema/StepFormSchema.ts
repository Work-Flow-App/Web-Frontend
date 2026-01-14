import { InputValidationRules, type IFields } from '../../../utils/validation';

export const StepFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter step name',
    label: 'Step Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter step description (optional)',
    label: 'Description',
    isRequired: false,
  },
  optional: {
    title: 'optional',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    label: 'Optional step (can be skipped)',
    isRequired: false,
  },
};

export interface StepFormData {
  name: string;
  description?: string;
  optional?: boolean;
}
