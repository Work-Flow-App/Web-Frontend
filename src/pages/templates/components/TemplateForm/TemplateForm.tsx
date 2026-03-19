import React, { useCallback, useEffect, useState } from 'react';
import { TemplateFormSchema, type TemplateFormData } from '../../schema/TemplateFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { TemplateFormFields } from '../TemplateFormFields/TemplateFormFields';
import { Loader } from '../../../../components/UI';
import { jobTemplateService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
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
      const title = isEditMode ? 'Edit Template' : 'Add New Template';
      const buttonText = isEditMode ? 'Update Template' : 'Add Template';

      updateModalTitle(title);
      updateGlobalModalInnerConfig({
        confirmModalButtonText: buttonText,
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
            isDefault: template.default || false,
          });
        } catch (error) {
          console.error('Error fetching template:', error);
          showError(extractErrorMessage(error, 'Failed to load template'));
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
        showError(extractErrorMessage(error, 'Failed to save template'));
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
