import { InputValidationRules } from '../../../../../utils/validation';
import type { IFields } from '../../../../../utils/validation';

export const InviteMemberFormSchema: IFields = {
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'member@example.com',
    label: 'Email Address',
    isRequired: true,
  },
};
