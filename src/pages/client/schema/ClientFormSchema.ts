import { InputValidationRules, type IFields } from '../../../utils/validation';

export const ClientFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter client name',
    label: 'Name',
    isRequired: true,
  },
  email: {
    title: 'email',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter email address',
    label: 'Email',
    isRequired: false,
  },
  telephone: {
    title: 'telephone',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter telephone number',
    label: 'Telephone',
    isRequired: false,
  },
  mobile: {
    title: 'mobile',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter mobile number',
    label: 'Mobile',
    isRequired: false,
  },
  address: {
    title: 'address',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter address',
    label: 'Address',
    isRequired: false,
  },
};

export interface ClientFormData {
  name: string;
  email?: string;
  telephone?: string;
  mobile?: string;
  address?: string;
}
