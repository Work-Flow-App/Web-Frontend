import React from 'react';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Badge } from '../../../../components/UI/Badge';
import type { BadgeVariant } from '../../../../components/UI/Badge/Badge.types';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../../services/api';
import type { FormFieldValueResponse } from '../../../../services/api';
import { renderEditableField, formatFieldValueDisplay, typeLabel } from '../../utils/formFieldRender';
import { FileFieldUploadButton } from '../FileFieldUploadButton';
import * as S from './FormFieldRow.styles';

const ROLE_CHIP_LABEL: Record<string, string> = {
  [FormFieldDtoRoleTargetEnum.Company]: 'Company fills this',
  [FormFieldDtoRoleTargetEnum.Worker]: 'Worker fills this',
  [FormFieldDtoRoleTargetEnum.Both]: 'Either can fill this',
};

const ROLE_CHIP_VARIANT: Record<string, BadgeVariant> = {
  [FormFieldDtoRoleTargetEnum.Company]: 'secondary',
  [FormFieldDtoRoleTargetEnum.Worker]: 'primary',
  [FormFieldDtoRoleTargetEnum.Both]: 'default',
};

// Icon carries the field type instead of a text badge - quieter, more scannable, and matches
// the "property icon" convention modern data-entry UIs (Notion, Linear, Airtable) use.
const TYPE_ICON: Record<string, React.ElementType> = {
  [FormFieldDtoTypeEnum.Text]: ShortTextIcon,
  [FormFieldDtoTypeEnum.TextArea]: NotesIcon,
  [FormFieldDtoTypeEnum.Date]: EventOutlinedIcon,
  [FormFieldDtoTypeEnum.Checkbox]: CheckBoxOutlinedIcon,
  [FormFieldDtoTypeEnum.Dropdown]: ArrowDropDownCircleOutlinedIcon,
  [FormFieldDtoTypeEnum.MultiSelect]: PlaylistAddCheckIcon,
  [FormFieldDtoTypeEnum.Boolean]: ToggleOnOutlinedIcon,
  [FormFieldDtoTypeEnum.File]: UploadFileIcon,
};

export interface FormFieldRowProps {
  value: FormFieldValueResponse;
  /** Can the current viewer (company or worker) edit this specific field right now? */
  isEditable: boolean;
  uploading: boolean;
  onUploadFile: (fieldId: number, file: File) => void;
}

/**
 * Renders one field of a form submission - editable input, read-only display, or a file
 * upload slot, plus a type icon and a badge for who owns it. Shared by the company submission
 * view and the worker fill-out view so both sides render fields identically.
 */
export const FormFieldRow: React.FC<FormFieldRowProps> = ({ value, isEditable, uploading, onUploadFile }) => {
  const label = value.fieldLabel || value.fieldName || 'Field';
  const roleTarget = value.roleTarget || FormFieldDtoRoleTargetEnum.Both;
  const TypeIcon = TYPE_ICON[value.fieldType || ''] || ShortTextIcon;

  const header = (
    <S.LabelRow>
      <S.LabelGroup>
        <S.TypeIconBadge title={typeLabel(value.fieldType)}>
          <TypeIcon />
        </S.TypeIconBadge>
        <S.Label>
          {label}
          {value.required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      </S.LabelGroup>
      <Badge variant={ROLE_CHIP_VARIANT[roleTarget] ?? 'default'} size="small">
        {ROLE_CHIP_LABEL[roleTarget] ?? 'Either can fill this'}
      </Badge>
    </S.LabelRow>
  );

  if (value.fieldType === FormFieldDtoTypeEnum.File) {
    return (
      <S.RowWrapper>
        {header}
        <S.FileRow>
          {value.fileUrl ? (
            <a href={value.fileUrl} target="_blank" rel="noreferrer">
              {value.fileName || 'View file'}
            </a>
          ) : (
            <S.NoFileText>No file uploaded</S.NoFileText>
          )}
          {isEditable && (
            <FileFieldUploadButton
              uploading={uploading}
              hasFile={!!value.fileUrl}
              onSelect={(file) => value.fieldId != null && onUploadFile(value.fieldId, file)}
            />
          )}
        </S.FileRow>
      </S.RowWrapper>
    );
  }

  if (!isEditable) {
    return (
      <S.RowWrapper>
        {header}
        <S.Value>{formatFieldValueDisplay(value)}</S.Value>
      </S.RowWrapper>
    );
  }

  return (
    <S.RowWrapper>
      {header}
      <S.FieldContent>{renderEditableField(value)}</S.FieldContent>
    </S.RowWrapper>
  );
};
