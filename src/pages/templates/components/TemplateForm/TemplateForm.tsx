import React, { useCallback, useEffect, useState } from 'react';
import { TemplateFormSchema, type TemplateFormData } from '../../schema/TemplateFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { TemplateFormFields } from '../TemplateFormFields/TemplateFormFields';
import { Loader } from '../../../../components/UI';
import { jobTemplateService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface TemplateFormProps {
  isModal?: boolean;
  templateId?: number;
  onSuccess?: () => void;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({ isModal = false, templateId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [templateData, setTemplateData] = useState<Partial<TemplateFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!templateId;

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Template' : 'Add New Template');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Template' : 'Add Template',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch template data when editing
  useEffect(() => {
    const fetchTemplateData = async () => {
      if (templateId) {
        try {
          setIsLoading(true);
          const response = await jobTemplateService.getTemplateById(templateId);
          const template = response.data;

          setTemplateData({
            name: template.name || '',
            description: template.description || '',
          });
        } catch (error) {
          console.error('Error fetching template:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load template';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTemplateData();
  }, [templateId, showError]);

  const handleSubmit = useCallback(
    async (data: TemplateFormData) => {
      try {
        if (isEditMode) {
          await jobTemplateService.updateTemplate(templateId, data);
          showSuccess('Template updated successfully');
        } else {
          await jobTemplateService.createTemplate(data);
          showSuccess('Template created successfully');
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save template';
        showError(errorMessage);
      }
    },
    [templateId, isEditMode, showSuccess, showError, onSuccess]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={TemplateFormSchema}
      defaultValues={templateData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <TemplateFormFields />
    </SetupFormWrapper>
  );
};
