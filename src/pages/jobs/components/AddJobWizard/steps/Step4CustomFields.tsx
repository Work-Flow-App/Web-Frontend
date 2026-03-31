import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField } from '../../../../../components/UI/FormComponents';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { Input } from '../../../../../components/UI/Forms/Input';
import { RadioGroup } from '../../../../../components/UI/Forms/Radio';
import { Loader } from '../../../../../components/UI';
import { jobTemplateService, jobService, customerService, companyClientService } from '../../../../../services/api';
import type { JobTemplateFieldResponse } from '../../../../../services/api';
import { FieldType } from '../../../../../enums';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import type { WizardData } from '../AddJobWizard';

interface Step4Props {
  wizardData: WizardData;
  onSuccess?: () => void;
  jobId?: number;
  originalAssetIds?: number[];
}

export const Step4CustomFields: React.FC<Step4Props> = ({ wizardData, onSuccess, jobId, originalAssetIds = [] }) => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnConfirm,
    setSkipResetModal,
    resetActiveScreen,
  } = useGlobalModalInnerContext();

  const { showSuccess, showError } = useSnackbar();
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<Record<string, any>>({
    defaultValues: {},
    mode: 'onChange',
  });

  const { handleSubmit, setError, reset, formState: { errors } } = methods;

  useEffect(() => {
    const fetchFields = async () => {
      if (!wizardData.templateId) {
        setLoadingFields(false);
        return;
      }
      try {
        setLoadingFields(true);
        const resp = await jobTemplateService.getTemplateFields(wizardData.templateId);
        setTemplateFields(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching template fields:', error);
      } finally {
        setLoadingFields(false);
      }
    };
    fetchFields();
  }, [wizardData.templateId]);

  // Pre-fill form when editing an existing job
  useEffect(() => {
    if (!jobId || !wizardData.fieldValues || templateFields.length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: Record<string, any> = {};
    templateFields.forEach((field) => {
      const fieldKey = field.id?.toString() || '';
      const raw = wizardData.fieldValues![fieldKey];
      if (raw !== undefined && raw !== null) {
        if (field.jobFieldType === 'DROPDOWN') {
          values[`field_${field.id}`] = { label: String(raw), value: String(raw) };
        } else if (field.jobFieldType === FieldType.DATE && typeof raw === 'string') {
          values[`field_${field.id}`] = raw.split('T')[0];
        } else {
          values[`field_${field.id}`] = raw;
        }
      }
    });
    reset(values);
  }, [jobId, templateFields, wizardData.fieldValues, reset]);

  const dropdownOptionsMap = useMemo(() => {
    const map = new Map<number, Array<{ label: string; value: string }>>();
    templateFields.forEach((field) => {
      if (field.jobFieldType === FieldType.DROPDOWN && field.options) {
        const options = field.options
          .split(',')
          .map((opt) => opt.trim())
          .filter(Boolean)
          .map((opt) => ({ label: opt, value: opt }));
        map.set(field.id!, options);
      }
    });
    return map;
  }, [templateFields]);

  const renderFieldInput = (field: JobTemplateFieldResponse) => {
    const fieldName = `field_${field.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldError = errors[fieldName] as any;

    switch (field.jobFieldType) {
      case FieldType.TEXT:
        return <Input name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />;
      case FieldType.NUMBER:
        return (
          <Input type="number" name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />
        );
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
        return (
          <Dropdown
            name={fieldName}
            preFetchedOptions={options}
            placeHolder={`Select ${field.label}`}
            fullWidth={true}
            disablePortal={true}
            error={fieldError}
          />
        );
      }
      default:
        return <Input name={fieldName} placeholder={`Enter ${field.label}`} hideErrorMessage={false} />;
    }
  };

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit(async (data) => {
        // Validate required custom fields
        let hasRequiredErrors = false;
        templateFields.forEach((field) => {
          if (field.required) {
            const fieldName = `field_${field.id}`;
            const value = data[fieldName];
            const isEmpty =
              value === null ||
              value === undefined ||
              value === '' ||
              (typeof value === 'object' && !('value' in value));
            if (isEmpty) {
              setError(fieldName, { message: `${field.label} is required` });
              hasRequiredErrors = true;
            }
          }
        });
        if (hasRequiredErrors) return;

        updateGlobalModalInnerConfig({ isConfirmDisabled: true });
        try {
          // Build fieldValues from dynamic fields
          const fieldValues: Record<string, string | number | boolean> = {};
          Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith('field_')) {
              const fieldId = key.replace('field_', '');
              const actualValue =
                typeof value === 'object' && value !== null && 'value' in value
                  ? (value as { value: string | number | boolean }).value
                  : value;
              if (actualValue !== '' && actualValue !== null && actualValue !== undefined) {
                // DATE fields: backend expects LocalDateTime format — append time if stripped for display
                const field = templateFields.find((f) => `field_${f.id}` === key);
                if (field?.jobFieldType === FieldType.DATE && typeof actualValue === 'string' && !actualValue.includes('T')) {
                  fieldValues[fieldId] = `${actualValue}T00:00:00`;
                } else {
                  fieldValues[fieldId] = actualValue;
                }
              }
            }
          });

          if (jobId) {
            // Edit mode — call updateJob
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatePayload: any = {};
            if (Object.keys(fieldValues).length > 0) updatePayload.fieldValues = fieldValues;
            if (wizardData.customerId) updatePayload.customerId = wizardData.customerId;
            if (wizardData.clientId) updatePayload.clientId = wizardData.clientId;
            if (wizardData.assignedWorkerId) updatePayload.assignedWorkerId = wizardData.assignedWorkerId;
            updatePayload.assetIds = wizardData.assetIds ?? [];

            await jobService.updateJob(jobId, updatePayload);
            showSuccess('Job updated successfully');
            resetActiveScreen();
            onSuccess?.();
            return;
          }

          // Create mode — resolve or create customer
          let customerId = wizardData.customerId;
          if (!customerId && wizardData.newCustomerData) {
            const { name, email, telephone, mobile, street, city, postalCode, country } =
              wizardData.newCustomerData;
            const customerResp = await customerService.createCustomer({
              name,
              ...(email && { email }),
              ...(telephone && { telephone }),
              ...(mobile && { mobile }),
              ...((street || city || postalCode || country) && {
                address: { street, city, postalCode, country },
              }),
            });
            customerId = customerResp.data.id;
          }

          if (!customerId) {
            showError('Customer is required to create a job');
            return;
          }

          // Resolve or create client
          let clientId = wizardData.clientId;
          if (!clientId && wizardData.newClientData) {
            const { name, email, telephone, mobile, address } = wizardData.newClientData;
            const clientResp = await companyClientService.createClient({
              name,
              ...(email && { email }),
              ...(telephone && { telephone }),
              ...(mobile && { mobile }),
              ...(address && { address }),
            });
            clientId = clientResp.data.id;
          }

          // Build create payload
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const createPayload: any = {
            templateId: wizardData.templateId!,
            customerId,
            fieldValues,
          };
          if (clientId) createPayload.clientId = clientId;
          if (wizardData.assignedWorkerId) createPayload.assignedWorkerId = wizardData.assignedWorkerId;
          if (wizardData.workflowId) createPayload.workflowId = wizardData.workflowId;
          if (wizardData.assetIds && wizardData.assetIds.length > 0) {
            createPayload.assetIds = wizardData.assetIds;
          }
          if (wizardData.address) {
            createPayload.address = {
              street: wizardData.address.fullAddress,
              latitude: wizardData.address.latitude,
              longitude: wizardData.address.longitude,
            };
          }

          await jobService.createJob(createPayload);
          showSuccess('Job created successfully');
          resetActiveScreen();
          onSuccess?.();
        } catch (error) {
          console.error('Error creating job:', error);
          showError(extractErrorMessage(error, 'Failed to create job'));
        } finally {
          updateGlobalModalInnerConfig({ isConfirmDisabled: false });
        }
      })();
    };
  }, [handleSubmit, setError, templateFields, wizardData, showSuccess, showError, onSuccess, resetActiveScreen, updateGlobalModalInnerConfig]);

  useEffect(() => {
    updateModalTitle(jobId ? 'Edit Job' : 'Custom Fields');
    updateGlobalModalInnerConfig({ confirmModalButtonText: jobId ? 'Save Changes' : 'Create Job' });
    setSkipResetModal?.(true);
    updateOnConfirm(() => onConfirmRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingFields) {
    return <Loader />;
  }

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {templateFields.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No custom fields defined for this template. Click &quot;Create Job&quot; to create the job.
          </Typography>
        ) : (
          templateFields
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((field) => (
              <FormField
                key={field.id}
                label={field.label || field.name || ''}
                required={field.required}
              >
                {renderFieldInput(field)}
              </FormField>
            ))
        )}
      </Box>
    </FormProvider>
  );
};
