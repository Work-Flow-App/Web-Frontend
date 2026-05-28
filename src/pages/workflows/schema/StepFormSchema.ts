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
  enableTimer: {
    title: 'enableTimer',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    label: 'Enable SLA Timer',
    isRequired: false,
  },
  expectedDurationDays: {
    title: 'expectedDurationDays',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: undefined,
    placeHolder: 'e.g. 4',
    label: 'Expected Duration (days)',
    isRequired: false,
  },
  maximumDurationDays: {
    title: 'maximumDurationDays',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: undefined,
    placeHolder: 'e.g. 5',
    label: 'Maximum Deadline (days)',
    isRequired: false,
  },
};

export interface StepFormData {
  name: string;
  description?: string;
  optional?: boolean;
  enableTimer?: boolean;
  expectedDurationDays?: number;
  maximumDurationDays?: number;
}
