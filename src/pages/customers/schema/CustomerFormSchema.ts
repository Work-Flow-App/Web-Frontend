import { InputValidationRules, type IFields } from '../../../utils/validation';

export const CustomerFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter customer name',
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
  street: {
    title: 'street',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter street',
    label: 'Street',
    isRequired: false,
  },
  city: {
    title: 'city',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter city',
    label: 'City',
    isRequired: false,
  },
  postalCode: {
    title: 'postalCode',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter postal code',
    label: 'Postal Code',
    isRequired: false,
  },
  country: {
    title: 'country',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter country',
    label: 'Country',
    isRequired: false,
  },
};

export interface CustomerFormData {
  name: string;
  email?: string;
  telephone?: string;
  mobile?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}
