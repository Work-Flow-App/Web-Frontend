import React from 'react';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Input } from '../../../components/UI/Forms/Input';
import { TextArea } from '../../../components/UI/Forms/TextArea';
import { Dropdown } from '../../../components/UI/Forms/Dropdown';
import { Checkbox } from '../../../components/UI/Forms/Checkbox';
import { RadioGroup } from '../../../components/UI/Forms/Radio';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum, FORM_FIELD_TYPE_OPTIONS } from '../../../services/api';
import type { FormFieldValueResponse, FormFieldValueDto } from '../../../services/api';
import { extractFieldValue } from '../../../utils/fieldValueHelper';
import { floowColors } from '../../../theme/colors';

/**
 * Shared dynamic-field rendering for custom form submissions (used by both the company
 * submission view and the worker fill-out view). Fields are keyed `field_<fieldId>` in
 * react-hook-form. Modeled on Step4CustomFields' per-type switch for job template fields.
 */

export const fieldFormName = (fieldId: number) => `field_${fieldId}`;

/** Human-readable label for a field type enum value, e.g. 'TEXT_AREA' -> 'Text Area'. */
export const typeLabel = (value?: string) => FORM_FIELD_TYPE_OPTIONS.find((o) => o.value === value)?.label || value || 'Text';

/**
 * Icon + color per field type - the "colored property icon" convention modern data-entry UIs
 * (Notion, Airtable, ClickUp) use so a list of mixed field types reads at a glance. Shared by
 * the builder's field list and the submission views' field rows so "Text" (say) is the same
 * blue everywhere in the feature.
 */
export const TYPE_ICON: Record<string, React.ElementType> = {
  [FormFieldDtoTypeEnum.Text]: ShortTextIcon,
  [FormFieldDtoTypeEnum.TextArea]: NotesIcon,
  [FormFieldDtoTypeEnum.Date]: EventOutlinedIcon,
  [FormFieldDtoTypeEnum.Checkbox]: CheckBoxOutlinedIcon,
  [FormFieldDtoTypeEnum.Dropdown]: ArrowDropDownCircleOutlinedIcon,
  [FormFieldDtoTypeEnum.MultiSelect]: PlaylistAddCheckIcon,
  [FormFieldDtoTypeEnum.Boolean]: ToggleOnOutlinedIcon,
  [FormFieldDtoTypeEnum.File]: UploadFileIcon,
};

export const TYPE_COLOR: Record<string, string> = {
  [FormFieldDtoTypeEnum.Text]: floowColors.blue.main,
  [FormFieldDtoTypeEnum.TextArea]: floowColors.indigo.main,
  [FormFieldDtoTypeEnum.Date]: floowColors.chart.quaternary,
  [FormFieldDtoTypeEnum.Checkbox]: floowColors.success.main,
  [FormFieldDtoTypeEnum.Dropdown]: floowColors.chart.quinary,
  [FormFieldDtoTypeEnum.MultiSelect]: floowColors.chart.secondary,
  [FormFieldDtoTypeEnum.Boolean]: '#0EA5E9',
  [FormFieldDtoTypeEnum.File]: '#0D9488',
};

/** Distinct color per role - this theme's primary/secondary are both near-black navy/grey, so
 * Badge's built-in variants can't tell Company/Worker/Both apart at a glance. */
export const ROLE_COLOR: Record<string, string> = {
  [FormFieldDtoRoleTargetEnum.Company]: floowColors.blue.main,
  [FormFieldDtoRoleTargetEnum.Worker]: floowColors.chart.quaternary,
  [FormFieldDtoRoleTargetEnum.Both]: floowColors.success.main,
};

const parseOptionsList = (options?: string): { label: string; value: string }[] =>
  (options || '')
    .split(',')
    .map((opt) => opt.trim())
    .filter(Boolean)
    .map((opt) => ({ label: opt, value: opt }));

const parseMultiSelectValue = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw.map((item) =>
      typeof item === 'object' && item !== null && 'value' in (item as Record<string, unknown>)
        ? String((item as { value: unknown }).value)
        : String(item)
    );
  }
  const s = extractFieldValue(raw);
  if (!s) return [];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed.map(String) : [s];
  } catch {
    return s
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
};

// Dropdown/Autocomplete fields may hold either the raw scalar or a resolved {label, value} option object
const unwrapScalar = (raw: unknown): string => {
  if (raw === null || raw === undefined) return '';
  if (typeof raw === 'object' && 'value' in (raw as Record<string, unknown>)) {
    const v = (raw as { value: unknown }).value;
    return v === null || v === undefined ? '' : String(v);
  }
  return String(raw);
};

/** React Hook Form default values for a submission's fields, keyed by field_<id>. */
export const buildFieldDefaultValues = (values: FormFieldValueResponse[]): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  values.forEach((v) => {
    if (v.fieldId == null || v.fieldType === FormFieldDtoTypeEnum.File) return;
    const name = fieldFormName(v.fieldId);
    switch (v.fieldType) {
      case FormFieldDtoTypeEnum.Checkbox:
      case FormFieldDtoTypeEnum.Boolean: {
        const raw = extractFieldValue(v.value);
        defaults[name] = raw === 'true';
        break;
      }
      case FormFieldDtoTypeEnum.Date: {
        const raw = extractFieldValue(v.value);
        defaults[name] = raw ? raw.split('T')[0] : '';
        break;
      }
      case FormFieldDtoTypeEnum.MultiSelect:
        defaults[name] = parseMultiSelectValue(v.value);
        break;
      default:
        defaults[name] = extractFieldValue(v.value);
    }
  });
  return defaults;
};

/** Renders the bound input for one editable field. */
export const renderEditableField = (value: FormFieldValueResponse): React.ReactNode => {
  const name = fieldFormName(value.fieldId!);
  const label = value.fieldLabel || value.fieldName || 'this field';

  switch (value.fieldType) {
    case FormFieldDtoTypeEnum.TextArea:
      return <TextArea name={name} placeholder={`Enter ${label}`} hideErrorMessage={false} rows={3} />;
    case FormFieldDtoTypeEnum.Date:
      return <Input type="date" name={name} hideErrorMessage={false} />;
    case FormFieldDtoTypeEnum.Checkbox:
      return <Checkbox name={name} label="Yes" hideErrorMessage={false} />;
    case FormFieldDtoTypeEnum.Boolean:
      return (
        <RadioGroup
          name={name}
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      );
    case FormFieldDtoTypeEnum.Dropdown:
      return (
        <Dropdown
          name={name}
          preFetchedOptions={parseOptionsList(value.options)}
          placeHolder={`Select ${label}`}
          fullWidth
          disablePortal
        />
      );
    case FormFieldDtoTypeEnum.MultiSelect:
      return (
        <Dropdown
          name={name}
          multiple
          preFetchedOptions={parseOptionsList(value.options)}
          placeHolder={`Select ${label}`}
          fullWidth
          disablePortal
        />
      );
    case FormFieldDtoTypeEnum.Text:
    default:
      return <Input name={name} placeholder={`Enter ${label}`} hideErrorMessage={false} />;
  }
};

/** Plain-text rendering of a value for read-only display (fields owned by the other party). */
export const formatFieldValueDisplay = (value: FormFieldValueResponse): string => {
  if (value.fieldType === FormFieldDtoTypeEnum.File) {
    return value.fileName || 'No file uploaded';
  }
  if (value.fieldType === FormFieldDtoTypeEnum.Checkbox || value.fieldType === FormFieldDtoTypeEnum.Boolean) {
    const raw = extractFieldValue(value.value);
    return raw === 'true' ? 'Yes' : raw === 'false' ? 'No' : 'Not answered';
  }
  if (value.fieldType === FormFieldDtoTypeEnum.MultiSelect) {
    const list = parseMultiSelectValue(value.value);
    return list.length ? list.join(', ') : 'Not answered';
  }
  const raw = extractFieldValue(value.value);
  return raw || 'Not answered';
};

/**
 * Builds the values PUT payload for the fields the current actor owns.
 * FILE fields are excluded - those are written through the separate upload endpoint.
 */
export const buildFieldValueDtos = (
  fields: FormFieldValueResponse[],
  data: Record<string, unknown>,
  editableFieldIds: Set<number>
): FormFieldValueDto[] => {
  const dtos: FormFieldValueDto[] = [];
  fields.forEach((field) => {
    if (field.fieldId == null || field.fieldType === FormFieldDtoTypeEnum.File) return;
    if (!editableFieldIds.has(field.fieldId)) return;
    const raw = data[fieldFormName(field.fieldId)];

    switch (field.fieldType) {
      case FormFieldDtoTypeEnum.Checkbox:
      case FormFieldDtoTypeEnum.Boolean: {
        dtos.push({ fieldId: field.fieldId, booleanValue: raw === true || raw === 'true' });
        break;
      }
      case FormFieldDtoTypeEnum.Date: {
        const str = unwrapScalar(raw);
        if (str) dtos.push({ fieldId: field.fieldId, dateValue: str.includes('T') ? str : `${str}T00:00:00` });
        break;
      }
      case FormFieldDtoTypeEnum.MultiSelect: {
        const list = parseMultiSelectValue(raw);
        dtos.push({ fieldId: field.fieldId, jsonValue: JSON.stringify(list) });
        break;
      }
      default: {
        const str = unwrapScalar(raw);
        if (str !== '') dtos.push({ fieldId: field.fieldId, stringValue: str });
      }
    }
  });
  return dtos;
};

/**
 * Labels of required, currently-editable fields that are still empty in the live form data
 * (react-hook-form's current values - not the last-saved snapshot, so a value just typed in
 * counts as filled even before it's saved). Call this before a save/submit call to block it
 * instead of silently persisting a required field left blank.
 *
 * Checkbox/Boolean are skipped - buildFieldValueDtos always resolves them to a concrete
 * true/false (unset defaults to false), so there's no "unanswered" state to require. File
 * fields are checked against the already-saved fileUrl, since uploads go through a separate
 * endpoint rather than this form data.
 */
export const getMissingRequiredFieldLabels = (
  fields: FormFieldValueResponse[],
  data: Record<string, unknown>,
  editableFieldIds: Set<number>
): string[] => {
  const missing: string[] = [];
  fields.forEach((field) => {
    if (!field.required || field.fieldId == null || !editableFieldIds.has(field.fieldId)) return;
    const label = field.fieldLabel || field.fieldName || 'This field';

    if (field.fieldType === FormFieldDtoTypeEnum.File) {
      if (!field.fileUrl) missing.push(label);
      return;
    }
    if (field.fieldType === FormFieldDtoTypeEnum.Checkbox || field.fieldType === FormFieldDtoTypeEnum.Boolean) return;

    const raw = data[fieldFormName(field.fieldId)];
    if (field.fieldType === FormFieldDtoTypeEnum.MultiSelect) {
      if (parseMultiSelectValue(raw).length === 0) missing.push(label);
      return;
    }
    if (!unwrapScalar(raw)) missing.push(label);
  });
  return missing;
};
