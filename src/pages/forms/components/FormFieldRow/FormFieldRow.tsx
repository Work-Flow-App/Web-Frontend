import React from 'react';
import { Badge } from '../../../../components/UI/Badge';
import type { BadgeVariant } from '../../../../components/UI/Badge/Badge.types';
import { FormField } from '../../../../components/UI/FormComponents';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../../services/api';
import type { FormFieldValueResponse } from '../../../../services/api';
import { renderEditableField, formatFieldValueDisplay } from '../../utils/formFieldRender';
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

export interface FormFieldRowProps {
  value: FormFieldValueResponse;
  /** Can the current viewer (company or worker) edit this specific field right now? */
  isEditable: boolean;
  uploading: boolean;
  onUploadFile: (fieldId: number, file: File) => void;
}

/**
 * Renders one field of a form submission - editable input, read-only display, or a file
 * upload slot, plus a chip explaining who owns the field. Shared by the company submission
 * view and the worker fill-out view so both sides render fields identically.
 */
export const FormFieldRow: React.FC<FormFieldRowProps> = ({ value, isEditable, uploading, onUploadFile }) => {
  const label = value.fieldLabel || value.fieldName || 'Field';
  const roleTarget = value.roleTarget || FormFieldDtoRoleTargetEnum.Both;
  const roleChip = (
    <Badge variant={ROLE_CHIP_VARIANT[roleTarget] ?? 'default'} size="small">
      {ROLE_CHIP_LABEL[roleTarget] ?? 'Either can fill this'}
    </Badge>
  );

  if (value.fieldType === FormFieldDtoTypeEnum.File) {
    return (
      <S.RowWrapper>
        <S.LabelRow>
          <S.Label>
            {label}
            {value.required && <S.RequiredMark>*</S.RequiredMark>}
          </S.Label>
          {roleChip}
        </S.LabelRow>
        <S.FileRow>
          {value.fileUrl ? (
            <a href={value.fileUrl} target="_blank" rel="noreferrer">
              {value.fileName || 'View file'}
            </a>
          ) : (
            <S.Value>No file uploaded</S.Value>
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
        <S.LabelRow>
          <S.Label>
            {label}
            {value.required && <S.RequiredMark>*</S.RequiredMark>}
          </S.Label>
          {roleChip}
        </S.LabelRow>
        <S.Value>{formatFieldValueDisplay(value)}</S.Value>
      </S.RowWrapper>
    );
  }

  return (
    <FormField label={label} required={value.required}>
      {renderEditableField(value)}
    </FormField>
  );
};
