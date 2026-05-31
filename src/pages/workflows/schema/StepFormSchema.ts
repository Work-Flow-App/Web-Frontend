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
    placeHolder: '0',
    label: 'Expected Duration',
    isRequired: false,
  },
  expectedDurationHours: {
    title: 'expectedDurationHours',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: undefined,
    placeHolder: '0',
    label: 'hrs',
    isRequired: false,
  },
  maximumDurationDays: {
    title: 'maximumDurationDays',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: undefined,
    placeHolder: '0',
    label: 'Maximum Deadline',
    isRequired: false,
  },
  maximumDurationHours: {
    title: 'maximumDurationHours',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: undefined,
    placeHolder: '0',
    label: 'hrs',
    isRequired: false,
  },
};

export interface StepFormData {
  name: string;
  description?: string;
  optional?: boolean;
  enableTimer?: boolean;
  expectedDurationDays?: number;
  expectedDurationHours?: number;
  maximumDurationDays?: number;
  maximumDurationHours?: number;
}
