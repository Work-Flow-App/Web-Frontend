import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { JobFormSchema } from '../../schema/JobFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { RadioGroup } from '../../../../components/UI/Forms/Radio';
import { FormField, FormRow } from '../../../../components/UI/FormComponents';
import { jobTemplateService, companyClientService, workerService, assetService } from '../../../../services/api';
import type {
  JobTemplateResponse,
  JobTemplateFieldResponse,
  ClientResponse,
  WorkerResponse,
  AssetResponse,
} from '../../../../services/api';
import { FieldType, JOB_STATUS_OPTIONS } from '../../../../enums';

interface JobFormFieldsProps {
  isEditMode?: boolean;
}

export const JobFormFields: React.FC<JobFormFieldsProps> = ({ isEditMode = false }) => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(JobFormSchema);
  const [templates, setTemplates] = useState<JobTemplateResponse[]>([]);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const { control } = useFormContext();
  const selectedTemplateId = useWatch({ control, name: fieldTitles.templateId });

  // Fetch templates, clients, and workers on mount
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

    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const response = await companyClientService.getAllClients();
        const clientsData = Array.isArray(response.data) ? response.data : [];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    const fetchWorkers = async () => {
      try {
        setLoadingWorkers(true);
        const response = await workerService.getAllWorkers();
        const workersData = Array.isArray(response.data) ? response.data : [];
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoadingWorkers(false);
      }
    };

    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const response = await assetService.getAllAssets(0, 100, false, true);
        const assetsData = response.data.content || [];
        setAssets(assetsData);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchTemplates();
    fetchClients();
    fetchWorkers();
    fetchAssets();
  }, []);

  // Fetch template fields when template is selected
  useEffect(() => {
    const fetchTemplateFields = async () => {
      if (!selectedTemplateId) {
        setTemplateFields([]);
        return;
      }

      // Extract the value if selectedTemplateId is an object
      const templateIdValue =
        typeof selectedTemplateId === 'object' && selectedTemplateId !== null
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
        console.log('Fetched template fields:', fieldsData);
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

  const clientOptions = useMemo(() => {
    return clients.map((client) => ({
      label: client.name || '',
      value: client.id?.toString() || '',
    }));
  }, [clients]);

  const workerOptions = useMemo(() => {
    return workers.map((worker) => ({
      label: worker.name || '',
      value: worker.id?.toString() || '',
    }));
  }, [workers]);

  const assetOptions = useMemo(() => {
    return assets.map((asset) => ({
      label: asset.name || '',
      value: asset.id?.toString() || '',
    }));
  }, [assets]);

  // Memoize dropdown options to prevent re-parsing on every render
  const dropdownOptionsMap = useMemo(() => {
    const map = new Map<number, Array<{ label: string; value: string }>>();
    templateFields.forEach((field) => {
      if (field.jobFieldType === FieldType.DROPDOWN && field.options) {
        const options = field.options
          .split(',')
          .map((opt) => {
            const trimmedOpt = opt.trim();
            return {
              label: trimmedOpt,
              value: trimmedOpt,
            };
          })
          .filter((opt) => opt.label && opt.value);

        map.set(field.id!, options);

        // Debug logging (only once during memoization)
        console.log(`Dropdown field "${field.label}" (ID: ${field.id}):`, {
          rawOptions: field.options,
          parsedOptions: options,
          optionsCount: options.length,
        });
      }
    });
    return map;
  }, [templateFields]);

  // Render input based on field type
  const renderFieldInput = (field: JobTemplateFieldResponse) => {
    // Use field ID as the key, not field name
    const fieldName = `field_${field.id}`;

    switch (field.jobFieldType) {
      case FieldType.TEXT:
        return <Input name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />;

      case FieldType.NUMBER:
        return <Input type="number" name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />;

      case FieldType.DATE:
        return <Input type="date" name={fieldName} hideErrorMessage={false} />;

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
        const options = dropdownOptionsMap.get(field.id!) || [];

        // Log warning if no options available
        if (options.length === 0) {
          console.warn(`Dropdown field "${field.label}" (ID: ${field.id}) has no options.`);
        }

        return (
          <Dropdown
            name={fieldName}
            preFetchedOptions={options}
            placeHolder={`Select ${field.label}`}
            fullWidth={true}
            disablePortal={true}
          />
        );
      }

      default:
        return <Input name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />;
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

      <FormRow>
        <FormField label={fieldLabels.clientId} required={isRequireds.clientId}>
          <Dropdown
            name={fieldTitles.clientId}
            preFetchedOptions={clientOptions}
            placeHolder={placeHolders.clientId}
            isPreFetchLoading={loadingClients}
            disablePortal={true}
            fullWidth={true}
            disabled={clientOptions.length === 0}
          />
        </FormField>

        <FormField label={fieldLabels.assignedWorkerId} required={isRequireds.assignedWorkerId}>
          <Dropdown
            name={fieldTitles.assignedWorkerId}
            preFetchedOptions={workerOptions}
            placeHolder={placeHolders.assignedWorkerId}
            isPreFetchLoading={loadingWorkers}
            disablePortal={true}
            fullWidth={true}
            disabled={workerOptions.length === 0}
          />
        </FormField>
      </FormRow>

      <FormField label={fieldLabels.assetIds} required={isRequireds.assetIds}>
        <Dropdown
          name={fieldTitles.assetIds}
          preFetchedOptions={assetOptions}
          placeHolder={placeHolders.assetIds}
          isPreFetchLoading={loadingAssets}
          disablePortal={true}
          fullWidth={true}
          disabled={assetOptions.length === 0}
        />
      </FormField>

      {/* Dynamic fields based on template */}
      {templateFields.length > 0 && (
        <>
          {templateFields
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((field) => (
              <FormField key={field.id} label={field.label || field.name || ''} required={field.required}>
                {renderFieldInput(field)}
              </FormField>
            ))}
        </>
      )}
    </>
  );
};
