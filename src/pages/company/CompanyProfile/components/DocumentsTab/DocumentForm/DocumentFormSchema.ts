import { InputValidationRules } from '../../../../../../utils/validation';
import { CompanyUploadDocumentTypeEnum } from '../../../../../../../workflow-api';
import type { SchemaFieldDefinition } from '../../SchemaField';

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  [CompanyUploadDocumentTypeEnum.Certificate]: 'Certificate',
  [CompanyUploadDocumentTypeEnum.License]: 'License',
  [CompanyUploadDocumentTypeEnum.Insurance]: 'Insurance',
  [CompanyUploadDocumentTypeEnum.Other]: 'Other',
};

const DOCUMENT_TYPE_OPTIONS = Object.values(CompanyUploadDocumentTypeEnum).map((type) => ({
  value: type,
  label: DOCUMENT_TYPE_LABELS[type],
}));

export const DocumentFormSchema: Record<string, SchemaFieldDefinition> = {
  title: {
    title: 'title',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g. Public Liability Insurance',
    label: 'Document Title',
    isRequired: true,
  },
  type: {
    title: 'type',
    rule: InputValidationRules.DropDownRequired('Document type'),
    defaultValue: '',
    placeHolder: 'Select document type',
    label: 'Document Type',
    isRequired: true,
    control: 'dropdown',
    dropdownOptions: DOCUMENT_TYPE_OPTIONS,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'Add optional notes about this document',
    label: 'Description',
    isRequired: false,
    control: 'textarea',
  },
  validityStartDate: {
    title: 'validityStartDate',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: '',
    label: 'Valid From',
    isRequired: false,
    control: 'date',
  },
  validityEndDate: {
    title: 'validityEndDate',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: '',
    label: 'Valid Until',
    isRequired: false,
    control: 'date',
  },
  isPublic: {
    title: 'isPublic',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    placeHolder: '',
    label: 'Visible to workers',
    isRequired: false,
    control: 'checkbox',
    helperText: 'Workers can view this document',
  },
};
