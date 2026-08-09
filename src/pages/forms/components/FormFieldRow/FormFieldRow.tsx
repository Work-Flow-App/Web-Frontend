import React from 'react';
import ShortTextIcon from '@mui/icons-material/ShortText';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../../services/api';
import type { FormFieldValueResponse } from '../../../../services/api';
import { renderEditableField, formatFieldValueDisplay, typeLabel, TYPE_ICON, TYPE_COLOR, ROLE_COLOR } from '../../utils/formFieldRender';
import { floowColors } from '../../../../theme/colors';
import { FileFieldUploadButton } from '../FileFieldUploadButton';
import * as S from './FormFieldRow.styles';

const ROLE_CHIP_LABEL: Record<string, string> = {
  [FormFieldDtoRoleTargetEnum.Company]: 'Company fills this',
  [FormFieldDtoRoleTargetEnum.Worker]: 'Worker fills this',
  [FormFieldDtoRoleTargetEnum.Both]: 'Either can fill this',
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
 * upload slot, plus a colored type icon and role tag. Shared by the company submission view
 * and the worker fill-out view so both sides render fields identically.
 */
export const FormFieldRow: React.FC<FormFieldRowProps> = ({ value, isEditable, uploading, onUploadFile }) => {
  const label = value.fieldLabel || value.fieldName || 'Field';
  const roleTarget = value.roleTarget || FormFieldDtoRoleTargetEnum.Both;
  const TypeIcon = TYPE_ICON[value.fieldType || ''] || ShortTextIcon;
  const typeColor = TYPE_COLOR[value.fieldType || ''] || floowColors.slate.main;
  const roleColor = ROLE_COLOR[roleTarget] || floowColors.slate.main;

  const header = (
    <S.LabelRow>
      <S.LabelGroup>
        <S.TypeIconBadge tint={typeColor} title={typeLabel(value.fieldType)}>
          <TypeIcon />
        </S.TypeIconBadge>
        <S.Label>
          {label}
          {value.required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      </S.LabelGroup>
      <S.RoleTag tint={roleColor}>{ROLE_CHIP_LABEL[roleTarget] ?? 'Either can fill this'}</S.RoleTag>
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
