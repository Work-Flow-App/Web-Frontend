import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { JobFormSchema } from '../../schema/JobFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { RadioGroup } from '../../../../components/UI/Forms/Radio';
import {  FormField, FormRow } from '../../../../components/UI/FormComponents';
import { jobTemplateService } from '../../../../services/api';
import type { JobTemplateResponse, JobTemplateFieldResponse } from '../../../../services/api';
import { FieldType, JOB_STATUS_OPTIONS } from '../../../../enums';


interface JobFormFieldsProps {
  isEditMode?: boolean;
}

export const JobFormFields: React.FC<JobFormFieldsProps> = ({ isEditMode = false }) => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(JobFormSchema);
  const [templates, setTemplates] = useState<JobTemplateResponse[]>([]);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  const { control } = useFormContext();
  const selectedTemplateId = useWatch({ control, name: fieldTitles.templateId });

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const response = await jobTemplateService.getAllTemplates();
        const templatesData = Array.isArray(response.data) ? response.data : [];
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Fetch template fields when template is selected
  useEffect(() => {
    const fetchTemplateFields = async () => {
      if (!selectedTemplateId) {
        setTemplateFields([]);
        return;
      }

      // Extract the value if selectedTemplateId is an object
      const templateIdValue = typeof selectedTemplateId === 'object' && selectedTemplateId !== null
        ? (selectedTemplateId as { value: string }).value
        : selectedTemplateId;

      const templateIdNumber = Number(templateIdValue);
      if (isNaN(templateIdNumber) || templateIdNumber <= 0) {
        console.warn('Invalid template ID:', selectedTemplateId);
        setTemplateFields([]);
        return;
      }

      try {
        const response = await jobTemplateService.getTemplateFields(templateIdNumber);
        const fieldsData = Array.isArray(response.data) ? response.data : [];
        setTemplateFields(fieldsData);
      } catch (error) {
        console.error('Error fetching template fields:', error);
        setTemplateFields([]);
      }
    };

    fetchTemplateFields();
  }, [selectedTemplateId]);

  const templateOptions = useMemo(() => {
      return templates.map((template) => ({
        label: template.name || '',
        value: template.id?.toString() || '',
      }));
    }, [templates]);

  // Render input based on field type
  const renderFieldInput = (field: JobTemplateFieldResponse) => {
    const fieldName = `field_${field.name}`;

    switch (field.jobFieldType) {
      case FieldType.TEXT:
        return (
          <Input
            name={fieldName}
            placeholder={`Enter ${field.label}`}
            hideErrorMessage={false}
          />
        );

      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            name={fieldName}
            placeholder={`Enter ${field.label}`}
            hideErrorMessage={false}
          />
        );

      case FieldType.DATE:
        return (
          <Input
            type="date"
            name={fieldName}
            hideErrorMessage={false}
          />
        );

      case FieldType.BOOLEAN:
        return (
          <RadioGroup
            name={fieldName}
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
          />
        );

      case FieldType.DROPDOWN: {
        const options = field.options
          ? field.options.split(',').map((opt) => ({
              label: opt.trim(),
              value: opt.trim(),
            }))
          : [];
        return (
          <Dropdown
            name={fieldName}
            preFetchedOptions={options}
            placeHolder={`Select ${field.label}`}
            fullWidth={true}
          />
        );
      }

      default:
        return (
          <Input
            name={fieldName}
            placeholder={`Enter ${field.label}`}
            hideErrorMessage={false}
          />
        );
    }
  };

  return (
    <>
      <FormRow>
        <FormField label={fieldLabels.templateId} required={isRequireds.templateId}>
          <Dropdown
            name={fieldTitles.templateId}
            preFetchedOptions={templateOptions}
            placeHolder={placeHolders.templateId}
            isPreFetchLoading={loadingTemplates}
            disabled={isEditMode}
            disablePortal={true}
            fullWidth={true}
          />
        </FormField>

        <FormField label={fieldLabels.status} required={isRequireds.status}>
          <Dropdown
            name={fieldTitles.status}
            preFetchedOptions={JOB_STATUS_OPTIONS}
            placeHolder={placeHolders.status}
            disablePortal={true}
            fullWidth={true}
            disabled={!selectedTemplateId}
          />
        </FormField>
      </FormRow>

      {selectedTemplateId && (
        <>

          {/* TODO: Add Client and Worker dropdowns when those services are available */}
          {/* <FormField label={fieldLabels.clientId} required={isRequireds.clientId}>
            <Dropdown
              name={fieldTitles.clientId}
              preFetchedOptions={clientOptions}
              placeholder={placeHolders.clientId}
              hideErrorMessage={false}
            />
          </FormField>

          <FormField label={fieldLabels.assignedWorkerId} required={isRequireds.assignedWorkerId}>
            <Dropdown
              name={fieldTitles.assignedWorkerId}
              preFetchedOptions={workerOptions}
              placeholder={placeHolders.assignedWorkerId}
              hideErrorMessage={false}
            />
          </FormField> */}

          {/* Dynamic fields based on template */}
          {templateFields.length > 0 && (
            <>
              {templateFields
                .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                .map((field) => (
                  <FormField
                    key={field.id}
                    label={field.label || field.name || ''}
                    required={field.required}
                  >
                    {renderFieldInput(field)}
                  </FormField>
                ))}
            </>
          )}
        </>
      )}
    </>
  );
};
