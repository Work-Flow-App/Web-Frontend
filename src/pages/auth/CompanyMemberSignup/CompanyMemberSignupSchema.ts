import { InputValidationRules } from '../../../utils/validation';
import type { IFields } from '../../../utils/validation';

export const CompanyMemberSignupSchema: IFields = {
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'your@email.com',
    label: 'Email',
    isRequired: true,
  },
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter your full name',
    label: 'Full Name',
    isRequired: true,
  },
  username: {
    title: 'username',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Choose a username',
    label: 'Username',
    isRequired: true,
  },
  password: {
    title: 'password',
    rule: InputValidationRules.PasswordRequired,
    defaultValue: '',
    placeHolder: 'Create a strong password',
    label: 'Password',
    isRequired: true,
  },
  confirmPassword: {
    title: 'confirmPassword',
    rule: InputValidationRules.RetypePasswordMatched,
    defaultValue: '',
    placeHolder: 'Confirm your password',
    label: 'Confirm Password',
    isRequired: true,
  },
};

export interface CompanyMemberSignupFormData {
  email: string;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}
