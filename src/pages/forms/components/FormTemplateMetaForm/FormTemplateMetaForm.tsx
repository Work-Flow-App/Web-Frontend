import React, { useCallback, useEffect } from 'react';
import { FormTemplateMetaSchema, type FormTemplateMetaData } from '../../schema/FormTemplateMetaSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { FormTemplateMetaFormFields } from './FormTemplateMetaFormFields';
import { formService } from '../../../../services/api';
import type { FormTemplateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface FormTemplateMetaFormProps {
  isModal?: boolean;
  /** Pass the full existing template (there's no get-by-id endpoint) to rename it - fields are preserved as-is. */
  template?: FormTemplateRequest;
  onSuccess?: (template: FormTemplateRequest) => void;
}

/**
 * Create a new (empty) form template, or rename an existing one. Field editing happens on the
 * builder page - this only ever touches name/description, so an update always re-sends the
 * template's existing `fields` untouched to avoid wiping them out.
 */
export const FormTemplateMetaForm: React.FC<FormTemplateMetaFormProps> = ({ isModal = false, template, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const isEditMode = !!template?.id;

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Rename Template' : 'Create Form Template');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Save Changes' : 'Create Template',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  const handleSubmit = useCallback(
    async (data: FormTemplateMetaData) => {
      try {
        if (isEditMode && template?.id) {
          const payload: FormTemplateRequest = { ...template, name: data.name, description: data.description || '' };
          const response = await formService.updateTemplate(template.id, payload);
          showSuccess('Template updated successfully');
          onSuccess?.(response.data);
        } else {
          const payload: FormTemplateRequest = { name: data.name, description: data.description || '', fields: [] };
          const response = await formService.createTemplate(payload);
          showSuccess('Template created successfully');
          onSuccess?.(response.data);
        }
      } catch (error) {
        showError(extractErrorMessage(error, `Failed to ${isEditMode ? 'update' : 'create'} template`));
        throw error;
      }
      return { success: true };
    },
    [isEditMode, template, showSuccess, showError, onSuccess]
  );

  return (
    <SetupFormWrapper
      schema={FormTemplateMetaSchema}
      defaultValues={template ? { name: template.name || '', description: template.description || '' } : undefined}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <FormTemplateMetaFormFields />
    </SetupFormWrapper>
  );
};
