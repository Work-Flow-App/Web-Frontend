import React, { useCallback, useEffect, useState } from 'react';
import { FieldFormSchema, type FieldFormData } from '../../schema/FieldFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { FieldFormFields } from '../FieldFormFields/FieldFormFields';
import { Loader } from '../../../../components/UI';
import { jobTemplateService, JobTemplateFieldCreateRequestJobFieldTypeEnum } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { FieldType } from '../../../../enums';
import { isAddressField, ADDRESS_FIELD_MARKER } from '../../../../utils/customAddressField';

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

          // Convert jobFieldType to dropdown option format. An "Address" field is
          // encoded on the backend as JSON + a marker in `options` (see
          // src/utils/customAddressField.ts) — surface it as the ADDRESS tile instead
          // of leaking that encoding into the UI.
          const FIELD_TYPES = [
            { label: 'Text', value: 'TEXT' },
            { label: 'Number', value: 'NUMBER' },
            { label: 'Date', value: 'DATE' },
            { label: 'Boolean', value: 'BOOLEAN' },
            { label: 'Dropdown', value: 'DROPDOWN' },
            { label: 'Address', value: FieldType.ADDRESS },
          ];
          const isAddress = isAddressField(field);
          const selectedFieldType = isAddress
            ? FIELD_TYPES.find((ft) => ft.value === FieldType.ADDRESS) || null
            : FIELD_TYPES.find((ft) => ft.value === field.jobFieldType) || null;

          setFieldData({
            label: field.label || '',
            jobFieldType: selectedFieldType as any,
            required: field.required ?? false,
            options: isAddress ? '' : field.options || '',
          });
        } catch (error) {
          console.error('Error fetching field:', error);
          showError(extractErrorMessage(error, 'Failed to load field'));
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
        const required = Boolean(data.required);

        // Extract value from dropdown option object if it's an object
        const jobFieldTypeValue = typeof data.jobFieldType === 'object' && data.jobFieldType !== null
          ? (data.jobFieldType as any).value
          : data.jobFieldType;
        const isAddress = jobFieldTypeValue === FieldType.ADDRESS;

        // Auto-generate field name from label: lowercase, spaces → underscores, strip special chars
        const generatedName = data.label
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');

        const fieldPayload = {
          templateId,
          name: generatedName,
          label: data.label,
          // The backend has no ADDRESS enum value — encode it as JSON + a marker (see
          // src/utils/customAddressField.ts).
          jobFieldType: (isAddress
            ? JobTemplateFieldCreateRequestJobFieldTypeEnum.Json
            : jobFieldTypeValue) as JobTemplateFieldCreateRequestJobFieldTypeEnum,
          required,
          options: isAddress ? ADDRESS_FIELD_MARKER : data.options,
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
        showError(extractErrorMessage(error, 'Failed to save field'));
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
