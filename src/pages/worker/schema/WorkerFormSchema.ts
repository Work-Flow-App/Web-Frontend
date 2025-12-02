import { InputValidationRules, type IFields } from '../../../utils/validation';

export const WorkerFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter full name',
    label: 'Full Name',
    isRequired: true,
  },
  initials: {
    title: 'initials',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter initials (optional)',
    label: 'Initials',
    isRequired: false,
  },
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'worker@email.com',
    label: 'Email Address',
    isRequired: true,
  },
  telephone: {
    title: 'telephone',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter telephone number (optional)',
    label: 'Telephone',
    isRequired: false,
  },
  mobile: {
    title: 'mobile',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter mobile number (optional)',
    label: 'Mobile',
    isRequired: false,
  },
  username: {
    title: 'username',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter username',
    label: 'Username',
    isRequired: true,
  },
  password: {
    title: 'password',
    rule: InputValidationRules.PasswordRequired,
    defaultValue: '',
    placeHolder: 'Enter password',
    label: 'Password',
    isRequired: true,
  },
};

export interface WorkerFormData {
  name: string;
  initials?: string;
  email: string;
  telephone?: string;
  mobile?: string;
  username: string;
  password: string;
}
