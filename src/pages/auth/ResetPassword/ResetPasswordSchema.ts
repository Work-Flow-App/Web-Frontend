import { InputValidationRules } from '../../../utils/validation';
import type { IFields } from '../../../utils/validation';
import { string } from 'yup';

export const ResetPasswordFormSchema: IFields = {
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'Enter your email address',
    label: 'Email Address',
    isRequired: true,
  },
  code: {
    title: 'code',
    rule: string()
      .required('Verification code is required')
      .matches(/^\d{6}$/, 'Code must be 6 digits'),
    defaultValue: '',
    placeHolder: 'Enter 6-digit code',
    label: 'Verification Code',
    isRequired: true,
  },
  newPassword: {
    title: 'newPassword',
    rule: InputValidationRules.NewPasswordRequired,
    defaultValue: '',
    placeHolder: 'Enter your new password',
    label: 'New Password',
    isRequired: true,
  },
  confirmPassword: {
    title: 'confirmPassword',
    rule: InputValidationRules.RetypePasswordMatched,
    defaultValue: '',
    placeHolder: 'Confirm your new password',
    label: 'Confirm Password',
    isRequired: true,
  },
};
