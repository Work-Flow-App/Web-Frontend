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
  /**
   * Skip the create API call and just hand the entered name/description back via `onSuccess`
   * (no `id`). Used for brand-new templates: the caller sends the actual create request once,
   * bundled with the fields added on the builder page, instead of creating an empty template
   * here that gets versioned (archived + replaced) the instant a field is added.
   */
  deferCreate?: boolean;
  onSuccess?: (template: FormTemplateRequest) => void;
}

/**
 * Collects name/description for a form template - either to rename an existing one (persists
 * immediately) or to seed a brand-new one (persistence deferred to the builder page, see
 * `deferCreate`). Field editing always happens on the builder page.
 */
export const FormTemplateMetaForm: React.FC<FormTemplateMetaFormProps> = ({
  isModal = false,
  template,
  deferCreate = false,
  onSuccess,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const isEditMode = !!template?.id;

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Rename Template' : 'Create Form Template');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Save Changes' : deferCreate ? 'Continue to Add Fields' : 'Create Template',
      });
    }
  }, [isModal, isEditMode, deferCreate, updateModalTitle, updateGlobalModalInnerConfig]);

  const handleSubmit = useCallback(
    async (data: FormTemplateMetaData) => {
      if (isEditMode && template?.id) {
        try {
          const payload: FormTemplateRequest = { ...template, name: data.name, description: data.description || '' };
          const response = await formService.updateTemplate(template.id, payload);
          showSuccess('Template updated successfully');
          onSuccess?.(response.data);
        } catch (error) {
          showError(extractErrorMessage(error, 'Failed to update template'));
          throw error;
        }
      } else if (deferCreate) {
        // No API call yet - the builder page creates the template once, fields included.
        onSuccess?.({ name: data.name, description: data.description || '', fields: [] });
      } else {
        try {
          const payload: FormTemplateRequest = { name: data.name, description: data.description || '', fields: [] };
          const response = await formService.createTemplate(payload);
          showSuccess('Template created successfully');
          onSuccess?.(response.data);
        } catch (error) {
          showError(extractErrorMessage(error, 'Failed to create template'));
          throw error;
        }
      }
      return { success: true };
    },
    [isEditMode, deferCreate, template, showSuccess, showError, onSuccess]
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
