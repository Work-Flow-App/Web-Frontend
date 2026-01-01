import { InputValidationRules, type IFields } from '../../../utils/validation';

export const JobFormSchema: IFields = {
  templateId: {
    title: 'templateId',
    rule: InputValidationRules.DropDownRequired(), // Required dropdown
    defaultValue: null,
    placeHolder: 'Choose a job template',
    label: 'Template',
    isRequired: true,
  },
  status: {
    title: 'status',
    defaultValue: null,
    placeHolder: 'Select status',
    label: 'Status',
    isRequired: false,
  },
  clientId: {
    title: 'clientId',
    defaultValue: null,
    placeHolder: 'Select client',
    label: 'Client',
    isRequired: false,
  },
  assignedWorkerId: {
    title: 'assignedWorkerId',
    defaultValue: null,
    placeHolder: 'Select worker',
    label: 'Assigned Worker',
    isRequired: false,
  },
  assetIds: {
    title: 'assetIds',
    defaultValue: [],
    placeHolder: 'Select assets (optional)',
    label: 'Assets',
    isRequired: false,
  },
};

export interface JobFormData {
  templateId: number | string | { label: string; value: string } | null;
  status?: string | { label: string; value: string } | null;
  clientId?: number | string | { label: string; value: string } | null;
  assignedWorkerId?: number | string | { label: string; value: string } | null;
  assetIds?: Array<number | string | { label: string; value: string }> | null;
  [key: string]: string | number | undefined | null | { label: string; value: string } | Array<number | string | { label: string; value: string }>; // For dynamic template fields
}
