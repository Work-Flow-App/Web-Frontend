import { InputValidationRules } from '../../../utils/validation';
import type { IFields } from '../../../utils/validation';

export const ForgotPasswordFormSchema: IFields = {
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'Enter your email address',
    label: 'Email Address',
    isRequired: true,
  },
};
