import React from 'react';
import type { FieldError } from 'react-hook-form';
import { Input } from '../../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../../components/UI/Forms/TextArea';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { Checkbox } from '../../../../../components/UI/Forms/Checkbox';
import type { IField } from '../../../../../utils/validation';
import { FieldRow, FieldLabel, FieldValue } from '../../CompanyProfile.styles';

export type SchemaFieldControl = 'text' | 'email' | 'date' | 'textarea' | 'dropdown' | 'checkbox';

export interface SchemaFieldDefinition extends IField {
  control?: SchemaFieldControl;
  dropdownOptions?: { value: string; label: string }[];
  /** Allow clearing a dropdown's selection. Defaults to false (not clearable). */
  dropdownClearable?: boolean;
  /** Helper text shown under a checkbox control. */
  helperText?: string;
  /** Row count for a textarea control. Defaults to 3. */
  rows?: number;
}

export interface SchemaFieldProps {
  /** React Hook Form field name (the schema entry's key). */
  name: string;
  field: SchemaFieldDefinition;
  error?: FieldError;
  /** Read-only mode instead of an editable control. Defaults to true (always editable). */
  isEditing?: boolean;
  /** Read-only display value; only used when isEditing is false. */
  viewValue?: string;
  /**
   * Pass true when this field renders inside a GlobalModal. A dropdown's popper portals to
   * document.body by default, which escapes the modal's stacking context — MUI then renders it
   * behind/outside the modal instead of as its dropdown list. Matches the disablePortal usage in
   * InviteMemberForm/ChangeMemberRoleForm, the other modal-hosted dropdowns in this codebase.
   */
  disablePortal?: boolean;
}

const EMPTY = 'Not provided';

/**
 * Renders one schema-driven field: an editable control (Input/TextArea/Dropdown/Checkbox) or,
 * when isEditing is false, a read-only value. Label, placeholder and control type all come from
 * the field's schema definition, so callers only need to say which field to render.
 */
export const SchemaField: React.FC<SchemaFieldProps> = ({
  name,
  field,
  error,
  isEditing = true,
  viewValue,
  disablePortal = false,
}) => {
  if (!isEditing) {
    return (
      <FieldRow>
        <FieldLabel>{field.label}</FieldLabel>
        <FieldValue $empty={!viewValue}>{viewValue || EMPTY}</FieldValue>
      </FieldRow>
    );
  }

  switch (field.control) {
    case 'dropdown':
      return (
        <Dropdown
          name={name}
          label={field.label}
          placeHolder={field.placeHolder}
          preFetchedOptions={field.dropdownOptions}
          fullWidth
          disableClearable={!field.dropdownClearable}
          disablePortal={disablePortal}
          error={error}
        />
      );
    case 'textarea':
      return (
        <TextArea name={name} label={field.label} placeHolder={field.placeHolder} fullWidth rows={field.rows ?? 3} />
      );
    case 'checkbox':
      return <Checkbox name={name} label={field.label} description={field.helperText} />;
    case 'date':
      return (
        <Input name={name} label={field.label} type="date" placeholder={field.placeHolder} fullWidth error={error} />
      );
    case 'email':
      return (
        <Input
          name={name}
          label={field.label}
          type="email"
          placeholder={field.placeHolder}
          fullWidth
          error={error}
        />
      );
    default:
      return (
        <Input name={name} label={field.label} type="text" placeholder={field.placeHolder} fullWidth error={error} />
      );
  }
};
