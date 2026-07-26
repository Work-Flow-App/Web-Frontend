import type { ComponentType } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { InputValidationRules } from '../../../utils/validation';
import { CompanyProfileResponseCurrencyEnum } from '../../../../workflow-api';
import type { SchemaFieldDefinition } from './components/SchemaField';

export type ProfileSection = 'company' | 'address' | 'bank';
export type ProfileFieldGroup = 'general' | 'contact' | 'business';

export interface CompanyProfileField extends SchemaFieldDefinition {
  section: ProfileSection;
  /** Icon-row group on the read-only Overview tab. Only set for section:'company' fields shown there. */
  group?: ProfileFieldGroup;
  /** Icon shown in the read-only Overview tab's icon-row list. */
  icon?: ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>;
}

const CURRENCY_OPTIONS = Object.values(CompanyProfileResponseCurrencyEnum).map((c) => ({
  value: c,
  label: c,
}));

export const CompanyProfileFormSchema: Record<string, CompanyProfileField> = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter company name',
    label: 'Company Name',
    isRequired: true,
    section: 'company',
  },
  description: {
    title: 'description',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Briefly describe your company',
    label: 'Description',
    isRequired: false,
    section: 'company',
    control: 'textarea',
    group: 'general',
    icon: DescriptionOutlinedIcon,
  },
  website: {
    title: 'website',
    rule: InputValidationRules.Website,
    defaultValue: '',
    placeHolder: 'https://example.com',
    label: 'Website',
    isRequired: false,
    section: 'company',
    group: 'general',
    icon: LanguageOutlinedIcon,
  },
  tagline: {
    title: 'tagline',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter a short tagline',
    label: 'Tagline',
    isRequired: false,
    section: 'company',
    group: 'general',
    icon: LabelOutlinedIcon,
  },
  email: {
    title: 'email',
    rule: InputValidationRules.Email,
    defaultValue: '',
    placeHolder: 'Enter email address',
    label: 'Email',
    isRequired: false,
    section: 'company',
    control: 'email',
    group: 'contact',
    icon: MailOutlineIcon,
  },
  contactEmail: {
    title: 'contactEmail',
    rule: InputValidationRules.Email,
    defaultValue: '',
    placeHolder: 'Enter contact email',
    label: 'Contact Email',
    isRequired: false,
    section: 'company',
    control: 'email',
    group: 'contact',
    icon: MailOutlineIcon,
  },
  contactNumber: {
    title: 'contactNumber',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter contact number',
    label: 'Contact Number',
    isRequired: false,
    section: 'company',
    group: 'contact',
    icon: PhoneOutlinedIcon,
  },
  telephone: {
    title: 'telephone',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter telephone number',
    label: 'Telephone',
    isRequired: false,
    section: 'company',
    group: 'contact',
    icon: PhoneOutlinedIcon,
  },
  mobile: {
    title: 'mobile',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter mobile number',
    label: 'Mobile',
    isRequired: false,
    section: 'company',
    group: 'contact',
    icon: PhoneOutlinedIcon,
  },
  fax: {
    title: 'fax',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter fax number',
    label: 'Fax',
    isRequired: false,
    section: 'company',
    group: 'contact',
    icon: PrintOutlinedIcon,
  },
  vatNumber: {
    title: 'vatNumber',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter VAT number',
    label: 'VAT Number',
    isRequired: false,
    section: 'company',
    group: 'business',
    icon: ReceiptLongOutlinedIcon,
  },
  currency: {
    title: 'currency',
    rule: InputValidationRules.ObjectNotRequired,
    defaultValue: '',
    placeHolder: 'Select currency',
    label: 'Currency',
    isRequired: false,
    section: 'company',
    control: 'dropdown',
    dropdownOptions: CURRENCY_OPTIONS,
    dropdownClearable: true,
    group: 'business',
    icon: PaidOutlinedIcon,
  },
  addressLine1: {
    title: 'addressLine1',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Address line 1',
    label: 'Address Line 1',
    isRequired: false,
    section: 'address',
  },
  addressLine2: {
    title: 'addressLine2',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Address line 2',
    label: 'Address Line 2',
    isRequired: false,
    section: 'address',
  },
  addressLine3: {
    title: 'addressLine3',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Address line 3',
    label: 'Address Line 3',
    isRequired: false,
    section: 'address',
  },
  town: {
    title: 'town',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter town / city',
    label: 'Town / City',
    isRequired: false,
    section: 'address',
  },
  country: {
    title: 'country',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter country',
    label: 'Country',
    isRequired: false,
    section: 'address',
  },
  postcode: {
    title: 'postcode',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter postcode',
    label: 'Postcode',
    isRequired: false,
    section: 'address',
  },
  bankName: {
    title: 'bankName',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter bank name',
    label: 'Bank Name',
    isRequired: false,
    section: 'bank',
  },
  accountName: {
    title: 'accountName',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter account name',
    label: 'Account Name',
    isRequired: false,
    section: 'bank',
  },
  accountNo: {
    title: 'accountNo',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter account number',
    label: 'Account Number',
    isRequired: false,
    section: 'bank',
  },
  sortCode: {
    title: 'sortCode',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Enter sort code',
    label: 'Sort Code',
    isRequired: false,
    section: 'bank',
  },
};
