import { InputValidationRules } from '../../../utils/validation';
import type { IFields } from '../../../utils/validation';

export const WorkerSignupSchema: IFields = {
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
  initials: {
    title: 'initials',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'e.g., JD',
    label: 'Initials (Optional)',
    isRequired: false,
  },
  telephone: {
    title: 'telephone',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'e.g., 123-456-7890',
    label: 'Telephone (Optional)',
    isRequired: false,
  },
  mobile: {
    title: 'mobile',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'e.g., 987-654-3210',
    label: 'Mobile (Optional)',
    isRequired: false,
  },
};
