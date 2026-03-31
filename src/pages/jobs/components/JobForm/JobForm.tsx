import React, { useCallback, useEffect, useState } from 'react';
import { JobFormSchema, type JobFormData } from '../../schema/JobFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { JobFormFields } from '../JobFormFields/JobFormFields';
import { Loader } from '../../../../components/UI';
import { jobService, jobTemplateService, assetService, workflowService } from '../../../../services/api';
import type { JobCreateRequest, JobUpdateRequest } from '../../../../services/api';
import { JobCreateRequestStatusEnum, JobUpdateRequestStatusEnum } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface JobFormProps {
  isModal?: boolean;
  jobId?: number;
  onSuccess?: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ isModal = false, jobId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  // Initialize with empty object - fields will use schema defaults
  const [jobData, setJobData] = useState<Partial<JobFormData>>({});
  // Start in loading state when editing so the form never briefly renders with empty defaults
  const [isLoading, setIsLoading] = useState(!!jobId);

  const isEditMode = !!jobId;

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Job' : 'Add New Job');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Job' : 'Add Job',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch job data when editing
  useEffect(() => {
    const fetchJobData = async () => {
      if (jobId) {
        try {
          setIsLoading(true);
          const response = await jobService.getJobById(jobId);
          const job = response.data;

          // Fetch template fields to map fieldValues to form fields
          if (job.templateId) {
            // Fetch all required data in parallel
            const [fieldsResponse, assetsResponse, workflowsResponse] = await Promise.all([
              jobTemplateService.getTemplateFields(job.templateId),
              assetService.getAllAssets(0, 200, false),
              workflowService.getAllWorkflows(),
            ]);

            const fields = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];
            const assetsData = (assetsResponse.data.content || []).filter((a: any) => a.archived !== true);
            const workflowsData = Array.isArray(workflowsResponse.data) ? workflowsResponse.data : [];

            // Convert assetIds to dropdown format { label, value }
            const assetIdsFormatted = (job.assetIds || []).map((assetId: number) => {
              const asset = assetsData.find(a => a.id === assetId);
              return {
                label: asset?.name || `Asset ${assetId}`,
                value: assetId.toString(),
              };
            });

            // Convert workflowId to dropdown format { label, value }
            let workflowIdFormatted = null;
            if (job.workflowId) {
              const workflow = workflowsData.find(w => w.id === job.workflowId);
              workflowIdFormatted = {
                label: workflow?.name || `Workflow ${job.workflowId}`,
                value: job.workflowId.toString(),
              };
            }

            // Map field values to form data
            const formData: Partial<JobFormData> = {
              templateId: job.templateId,
              status: job.status,
              customerId: job.customerId,
              clientId: job.clientId,
              assignedWorkerId: job.assignedWorkerId,
              assetIds: assetIdsFormatted,
              workflowId: workflowIdFormatted,
              addressStreet: [job.address?.street, job.address?.city, job.address?.state, job.address?.postalCode, job.address?.country].filter(Boolean).join(', '),
              addressCity: '',
              addressState: '',
              addressPostalCode: '',
              addressCountry: '',
              addressLatitude: job.address?.latitude ?? null,
              addressLongitude: job.address?.longitude ?? null,
            };

            console.log('Edit mode - Setting form data:', formData);

            // Add dynamic field values
            fields.forEach((field) => {
              const fieldName = `field_${field.id}`;
              const fieldValue = job.fieldValues?.[field.id?.toString() || ''];
              if (fieldValue !== undefined) {
                // Extract the actual value from FieldValueResponse object
                let extractedValue = typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue
                  ? fieldValue.value
                  : fieldValue;
                // DATE fields: strip time component so <input type="date"> recognises the value
                if (
                  typeof fieldValue === 'object' && fieldValue !== null && 'type' in fieldValue &&
                  (fieldValue as { type: string }).type === 'DATE' &&
                  typeof extractedValue === 'string'
                ) {
                  extractedValue = extractedValue.split('T')[0];
                }
                formData[fieldName] = extractedValue;
              }
            });

            setJobData(formData);
          }
        } catch (error) {
          console.error('Error fetching job:', error);
          showError(extractErrorMessage(error, 'Failed to load job data'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJobData();
  }, [jobId, showError]);

  const handleSubmit = useCallback(
    async (data: JobFormData) => {
      try {
        // Extract template ID and status
        const { templateId, status, customerId, clientId, assignedWorkerId, assetIds, workflowId, addressStreet, addressCity, addressState, addressPostalCode, addressCountry, addressLatitude, addressLongitude, ...dynamicFields } = data;

        // Extract the value if templateId is an object (from dropdown)
        const templateIdValue = typeof templateId === 'object' && templateId !== null
          ? (templateId as { value: string }).value
          : templateId;

        // Validate templateId
        const templateIdNumber = Number(templateIdValue);
        if (!isEditMode && (isNaN(templateIdNumber) || templateIdNumber <= 0)) {
          showError('Please select a valid template');
          return;
        }

        // Build fieldValues from dynamic fields (those starting with "field_")
        // The keys should be field IDs (numbers), not field names
        const fieldValues: Record<string, string | number | boolean | object> = {};
        Object.entries(dynamicFields).forEach(([key, value]) => {
          if (key.startsWith('field_')) {
            const fieldId = key.replace('field_', ''); // This is the field ID
            // Extract value from dropdown objects if needed
            const actualValue = typeof value === 'object' && value !== null && 'value' in value
              ? (value as { value: string | number | boolean }).value
              : value;
            // Only add non-empty values
            if (actualValue !== '' && actualValue !== null && actualValue !== undefined) {
              // DATE fields: backend expects LocalDateTime — restore time if stripped for display
              if (typeof actualValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(actualValue)) {
                fieldValues[fieldId] = `${actualValue}T00:00:00`;
              } else {
                fieldValues[fieldId] = actualValue;
              }
            }
          }
        });

        // Extract status value if it's an object
        const statusValue = typeof status === 'object' && status !== null
          ? (status as { value: string }).value
          : status;

        // Convert customerId, clientId and assignedWorkerId to numbers or undefined
        const customerIdValue = typeof customerId === 'object' && customerId !== null
          ? (customerId as { value: string }).value
          : customerId;
        const customerIdNumber = customerIdValue ? Number(customerIdValue) : undefined;

        const clientIdValue = typeof clientId === 'object' && clientId !== null
          ? (clientId as { value: string }).value
          : clientId;
        const clientIdNumber = clientIdValue ? Number(clientIdValue) : undefined;

        const assignedWorkerIdValue = typeof assignedWorkerId === 'object' && assignedWorkerId !== null
          ? (assignedWorkerId as { value: string }).value
          : assignedWorkerId;
        const assignedWorkerIdNumber = assignedWorkerIdValue ? Number(assignedWorkerIdValue) : undefined;

        // Convert assetIds from dropdown format to number array
        const assetIdsArray = Array.isArray(assetIds)
          ? assetIds
              .map(asset => {
                const assetValue = typeof asset === 'object' && asset !== null
                  ? (asset as { value: string }).value
                  : asset;
                return assetValue ? Number(assetValue) : null;
              })
              .filter((id): id is number => id !== null && !isNaN(id))
          : [];

        // Convert workflowId from dropdown format to number
        const workflowIdValue = typeof workflowId === 'object' && workflowId !== null
          ? (workflowId as { value: string }).value
          : workflowId;
        const workflowIdNumber = workflowIdValue ? Number(workflowIdValue) : undefined;

        // Build address object — always include coordinates when available
        const addressObj = {
          ...(addressStreet && { street: addressStreet as string }),
          ...(addressCity && { city: addressCity as string }),
          ...(addressState && { state: addressState as string }),
          ...(addressPostalCode && { postalCode: addressPostalCode as string }),
          ...(addressCountry && { country: addressCountry as string }),
          ...(addressLatitude != null && { latitude: addressLatitude as number }),
          ...(addressLongitude != null && { longitude: addressLongitude as number }),
        };
        const hasAddress = Object.keys(addressObj).length > 0;

        if (isEditMode) {
          // Update existing job
          const updatePayload: JobUpdateRequest = {
            archived: false,
            fieldValues,
          };
          if (statusValue) updatePayload.status = statusValue as JobUpdateRequestStatusEnum;
          if (customerIdNumber) updatePayload.customerId = customerIdNumber;
          if (clientIdNumber) updatePayload.clientId = clientIdNumber;
          if (assignedWorkerIdNumber) updatePayload.assignedWorkerId = assignedWorkerIdNumber;
          if (assetIdsArray.length > 0) updatePayload.assetIds = assetIdsArray;
          if (hasAddress) updatePayload.address = addressObj;

          await jobService.updateJob(jobId, updatePayload);
          showSuccess('Job updated successfully');
        } else {
          // Create new job - only include fields that have values
          const createPayload: JobCreateRequest = {
            templateId: templateIdNumber,
            customerId: customerIdNumber!,
            fieldValues,
          };
          if (statusValue) createPayload.status = statusValue as JobCreateRequestStatusEnum;
          if (clientIdNumber) createPayload.clientId = clientIdNumber;
          if (assignedWorkerIdNumber) createPayload.assignedWorkerId = assignedWorkerIdNumber;
          if (assetIdsArray.length > 0) createPayload.assetIds = assetIdsArray;
          if (workflowIdNumber) createPayload.workflowId = workflowIdNumber;
          if (hasAddress) createPayload.address = addressObj;

          await jobService.createJob(createPayload);
          showSuccess('Job created successfully');
        }

        // Call onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving job:', error);
        showError(extractErrorMessage(error, 'Failed to save job'));
      }
    },
    [jobId, isEditMode, showSuccess, showError, onSuccess]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={JobFormSchema}
      defaultValues={jobData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <JobFormFields isEditMode={isEditMode} />
    </SetupFormWrapper>
  );
};
