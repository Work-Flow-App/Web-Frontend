import { InputValidationRules, type IFields } from '../../../utils/validation';

export const RejectLeaveFormSchema: IFields = {
  decisionNote: {
    title: 'decisionNote',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Explain why this request is being rejected',
    label: 'Reason for Rejection',
    isRequired: true,
  },
};

export interface RejectLeaveFormData {
  decisionNote: string;
}
