import { InputValidationRules } from '../../../utils/validation';
import type { IFields } from '../../../utils/validation';
import { UserRole } from '../../../types/auth';

export const SignupFormSchema: IFields = {
  role: {
    title: 'role',
    defaultValue: UserRole.COMPANY,
    label: 'Register As',
    isRequired: false,
  },
  username: {
    title: 'username',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter your username',
    label: 'Username',
    isRequired: true,
  },
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'Enter your email',
    label: 'Email',
    isRequired: true,
  },
  password: {
    title: 'password',
    rule: InputValidationRules.PasswordRequired,
    defaultValue: '',
    placeHolder: 'Enter your password',
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
