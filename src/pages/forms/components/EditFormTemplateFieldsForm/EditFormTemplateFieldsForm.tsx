import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { FieldRowsSection, buildFieldPayload, type FieldRowData } from '../FieldRowsEditor';
import { formService } from '../../../../services/api';
import type { FormTemplateRequest } from '../../../../services/api';
import * as S from './EditFormTemplateFieldsForm.styles';

export interface EditFormTemplateFieldsFormProps {
  isModal?: boolean;
  template: FormTemplateRequest;
  onSuccess?: () => void;
}

interface EditFieldsFormData {
  fields: FieldRowData[];
}

const toRowData = (template: FormTemplateRequest): FieldRowData[] =>
  (template.fields || []).map((f) => ({
    label: f.label || '',
    type: f.type || null,
    roleTarget: f.roleTarget || null,
    required: f.required || false,
    options: f.options || '',
  }));

/**
 * Editing an existing template's fields used to mean navigating away to the full builder page.
 * This keeps it in a modal, next to the "Edit Fields" action that opens it, and mirrors the
 * create-template modal's single-card field editor so both flows look and behave the same way.
 * One save, one new version — same batching the builder page's manual "Save Template" already
 * relied on, just without the separate page.
 */
export const EditFormTemplateFieldsForm: React.FC<EditFormTemplateFieldsFormProps> = ({
  isModal = true,
  template,
  onSuccess,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const methods = useForm<EditFieldsFormData>({
    defaultValues: { fields: toRowData(template) },
    mode: 'onChange',
  });
  const { handleSubmit, setError } = methods;

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit(async (data) => {
        const fieldPayload = buildFieldPayload(data.fields, setError);
        if (fieldPayload === null) return;
        if (!template.id) return;

        updateGlobalModalInnerConfig({ isConfirmDisabled: true });
        try {
          const payload: FormTemplateRequest = {
            name: template.name,
            description: template.description,
            version: template.version,
            archived: template.archived,
            fields: fieldPayload,
          };
          await formService.updateTemplate(template.id, payload);
          showSuccess('Fields saved successfully');
          onSuccess?.();
        } catch (error) {
          showError(extractErrorMessage(error, 'Failed to save fields'));
        } finally {
          updateGlobalModalInnerConfig({ isConfirmDisabled: false });
        }
      })();
    };
  }, [handleSubmit, setError, showSuccess, showError, onSuccess, updateGlobalModalInnerConfig, template]);

  useEffect(() => {
    if (isModal) {
      updateModalTitle(`Edit Fields — ${template.name}`);
      updateGlobalModalInnerConfig({ confirmModalButtonText: 'Save Changes' });
      setSkipResetModal?.(true);
      updateOnConfirm(() => onConfirmRef.current());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <S.FormBody>
        <FieldRowsSection subtitle="Add, remove, reorder, or edit the fields on this template" />
      </S.FormBody>
    </FormProvider>
  );
};
