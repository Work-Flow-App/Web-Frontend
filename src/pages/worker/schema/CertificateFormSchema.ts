import { InputValidationRules, type IFields } from '../../../utils/validation';
import { CertificateType } from '../../../services/api';

export const CertificateFormSchema: IFields = {
  type: {
    title: 'type',
    rule: InputValidationRules.DropDownRequired('Certificate type'),
    defaultValue: CertificateType.License,
    placeHolder: 'Select type',
    label: 'Certificate Type',
    isRequired: true,
  },
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g. Forklift License',
    label: 'Certificate Name',
    isRequired: true,
  },
  issuingAuthority: {
    title: 'issuingAuthority',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'e.g. State Transport Authority (optional)',
    label: 'Issuing Authority',
    isRequired: false,
  },
  issueDate: {
    title: 'issueDate',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'YYYY-MM-DD',
    label: 'Issue Date (optional)',
    isRequired: false,
  },
  expiryDate: {
    title: 'expiryDate',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'YYYY-MM-DD',
    label: 'Expiry Date (optional)',
    isRequired: false,
  },
};

export interface CertificateFormData {
  type: CertificateType | { value: CertificateType; label: string };
  name: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
}
