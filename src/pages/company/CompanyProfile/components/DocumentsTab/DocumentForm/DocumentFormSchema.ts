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
    label: 'Make this document public',
    isRequired: false,
    control: 'checkbox',
    helperText: 'Anyone with the link can view this document without logging in, even outside your company',
  },
  file: {
    title: 'file',
    rule: InputValidationRules.SingleFileRequired,
    defaultValue: null,
    placeHolder: '',
    label: 'File',
    isRequired: true,
    control: 'file',
  },
};

/** Same form when editing: the document already has a file, so choosing a new one is optional. */
export const DocumentEditFormSchema: Record<string, SchemaFieldDefinition> = {
  ...DocumentFormSchema,
  file: {
    ...DocumentFormSchema.file,
    rule: InputValidationRules.SingleFileNotRequired,
    isRequired: false,
  },
};
