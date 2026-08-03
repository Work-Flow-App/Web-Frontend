import { InputValidationRules, type IFields } from '../../../utils/validation';
import { LeaveType } from '../../../services/api';

export const LeaveRequestFormSchema: IFields = {
  type: {
    title: 'type',
    rule: InputValidationRules.DropDownRequired('Leave type'),
    defaultValue: LeaveType.Annual,
    placeHolder: 'Select type',
    label: 'Leave Type',
    isRequired: true,
  },
  startDate: {
    title: 'startDate',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'YYYY-MM-DD',
    label: 'Start Date',
    isRequired: true,
  },
  endDate: {
    title: 'endDate',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'YYYY-MM-DD',
    label: 'End Date',
    isRequired: true,
  },
  reason: {
    title: 'reason',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Reason for leave (optional)',
    label: 'Reason',
    isRequired: false,
  },
};

export interface LeaveRequestFormData {
  type: LeaveType | { value: LeaveType; label: string };
  startDate: string;
  endDate: string;
  reason?: string;
}
