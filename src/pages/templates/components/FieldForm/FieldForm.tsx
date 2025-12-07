import React, { useCallback, useEffect, useState } from 'react';
import { FieldFormSchema, type FieldFormData } from '../../schema/FieldFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { FieldFormFields } from '../FieldFormFields/FieldFormFields';
import { Loader } from '../../../../components/UI';
import { jobTemplateService, JobTemplateFieldCreateRequestJobFieldTypeEnum } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface FieldFormProps {
  isModal?: boolean;
  templateId: number;
  fieldId?: number;
  onSuccess?: () => void;
}

export const FieldForm: React.FC<FieldFormProps> = ({ isModal = false, templateId, fieldId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [fieldData, setFieldData] = useState<Partial<FieldFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!fieldId;

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Field' : 'Add New Field');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Field' : 'Add Field',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch field data when editing
  useEffect(() => {
    const fetchFieldData = async () => {
      if (fieldId) {
        try {
          setIsLoading(true);
          const response = await jobTemplateService.getFieldById(fieldId);
          const field = response.data;

          // Convert jobFieldType to dropdown option format
          const FIELD_TYPES = [
            { label: 'Text', value: 'TEXT' },
            { label: 'Number', value: 'NUMBER' },
            { label: 'Date', value: 'DATE' },
            { label: 'Boolean', value: 'BOOLEAN' },
            { label: 'Dropdown', value: 'DROPDOWN' },
          ];
          const selectedFieldType = FIELD_TYPES.find(ft => ft.value === field.jobFieldType) || null;

          setFieldData({
            name: field.name || '',
            label: field.label || '',
            jobFieldType: selectedFieldType as any,
            required: String(field.required) as any, // Convert boolean to string for RadioGroup
            options: field.options || '',
            orderIndex: field.orderIndex || 0,
          });
        } catch (error) {
          console.error('Error fetching field:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load field';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFieldData();
  }, [fieldId, showError]);

  const handleSubmit = useCallback(
    async (data: FieldFormData) => {
      try {
        // Convert 'true'/'false' string to boolean
        const required = typeof data.required === 'string'
          ? data.required === 'true'
          : Boolean(data.required);

        // Extract value from dropdown option object if it's an object
        const jobFieldType = typeof data.jobFieldType === 'object' && data.jobFieldType !== null
          ? (data.jobFieldType as any).value
          : data.jobFieldType;

        const fieldPayload = {
          templateId,
          name: data.name,
          label: data.label,
          jobFieldType: jobFieldType as JobTemplateFieldCreateRequestJobFieldTypeEnum,
          required,
          options: data.options,
          orderIndex: Number(data.orderIndex),
        };

        if (isEditMode) {
          await jobTemplateService.updateField(fieldId, fieldPayload);
          showSuccess('Field updated successfully');
        } else {
          await jobTemplateService.createField(fieldPayload);
          showSuccess('Field created successfully');
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving field:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save field';
        showError(errorMessage);
      }
    },
    [templateId, fieldId, isEditMode, showSuccess, showError, onSuccess]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={FieldFormSchema}
      defaultValues={fieldData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <FieldFormFields />
    </SetupFormWrapper>
  );
};
