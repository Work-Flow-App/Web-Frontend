import { InputValidationRules, type IFields } from '../../../utils/validation';

export const JobFormSchema: IFields = {
  templateId: {
    title: 'templateId',
    rule: InputValidationRules.NumberRequired,
    defaultValue: '',
    placeHolder: 'Choose a job template',
    label: 'Template',
    isRequired: true,
  },
  status: {
    title: 'status',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: 'pending',
    placeHolder: 'Select status',
    label: 'Status',
    isRequired: false,
  },
  clientId: {
    title: 'clientId',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: '',
    placeHolder: 'Select client',
    label: 'Client',
    isRequired: false,
  },
  assignedWorkerId: {
    title: 'assignedWorkerId',
    rule: InputValidationRules.NumberNotRequired,
    defaultValue: '',
    placeHolder: 'Select worker',
    label: 'Assigned Worker',
    isRequired: false,
  },
};

export interface JobFormData {
  templateId: number;
  status?: string;
  clientId?: number;
  assignedWorkerId?: number;
  [key: string]: string | number | undefined; // For dynamic template fields
}
