import React, { useCallback, useEffect, useState } from 'react';
import { FieldFormSchema, type FieldFormData } from '../../schema/FieldFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { FieldFormFields } from './FieldFormFields';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../../services/api';
import type { FormFieldDto } from '../../../../services/api';

export interface BuilderField extends FormFieldDto {
  /** Client-side identity for the field list before it's ever been saved to the backend. */
  clientId: number;
}

export interface FieldFormProps {
  isModal?: boolean;
  initialField?: BuilderField | null;
  onSave: (field: BuilderField) => void;
  isEditing?: boolean;
}

const extractValue = <T,>(v: T | { value: T; label: string } | undefined, fallback: T): T =>
  v === undefined ? fallback : typeof v === 'object' && v !== null && 'value' in v ? (v as { value: T }).value : v;

/**
 * Add/edit a single field on a form template. Purely client-side, like StepForm - the parent
 * builder page holds the field array and persists the whole template in one save.
 */
export const FieldForm: React.FC<FieldFormProps> = ({ isModal = true, initialField, onSave, isEditing = false }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [fieldData, setFieldData] = useState<Partial<FieldFormData> | undefined>(undefined);

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditing ? 'Edit Field' : 'Add Field');
      updateGlobalModalInnerConfig({ confirmModalButtonText: isEditing ? 'Save Field' : 'Add Field' });
    }
  }, [isModal, isEditing, updateModalTitle, updateGlobalModalInnerConfig]);

  useEffect(() => {
    if (initialField) {
      setFieldData({
        label: initialField.label || '',
        type: initialField.type || FormFieldDtoTypeEnum.Text,
        roleTarget: initialField.roleTarget || FormFieldDtoRoleTargetEnum.Both,
        required: initialField.required || false,
        options: initialField.options || '',
      });
    }
  }, [initialField]);

  const handleSubmit = useCallback(
    async (data: FieldFormData) => {
      const type = extractValue(data.type, FormFieldDtoTypeEnum.Text);
      const roleTarget = extractValue(data.roleTarget, FormFieldDtoRoleTargetEnum.Both);
      const fieldPayload: BuilderField = {
        ...initialField,
        clientId: initialField?.clientId ?? Date.now(),
        id: initialField?.id,
        name: initialField?.name || data.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
        label: data.label,
        type,
        roleTarget,
        required: data.required || false,
        options: data.options || undefined,
      };
      onSave(fieldPayload);
      return { success: true };
    },
    [initialField, onSave]
  );

  return (
    <SetupFormWrapper schema={FieldFormSchema} defaultValues={fieldData} onSubmit={handleSubmit} isModal={isModal}>
      <FieldFormFields />
    </SetupFormWrapper>
  );
};
