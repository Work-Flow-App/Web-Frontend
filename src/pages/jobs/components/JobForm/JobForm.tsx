import React, { useCallback, useEffect, useState } from 'react';
import { JobFormSchema, type JobFormData } from '../../schema/JobFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { JobFormFields } from '../JobFormFields/JobFormFields';
import { Loader } from '../../../../components/UI';
import { jobService, jobTemplateService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface JobFormProps {
  isModal?: boolean;
  jobId?: number;
  onSuccess?: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ isModal = false, jobId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [jobData, setJobData] = useState<Partial<JobFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
            const fieldsResponse = await jobTemplateService.getTemplateFields(job.templateId);
            const fields = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];

            // Map field values to form data
            const formData: Partial<JobFormData> = {
              templateId: job.templateId,
              status: job.status || 'pending',
              clientId: job.clientId,
              assignedWorkerId: job.assignedWorkerId,
            };

            // Add dynamic field values
            fields.forEach((field) => {
              const fieldName = `field_${field.name}`;
              const fieldValue = job.fieldValues?.[field.name || ''];
              if (fieldValue !== undefined) {
                formData[fieldName] = fieldValue;
              }
            });

            setJobData(formData);
          }
        } catch (error) {
          console.error('Error fetching job:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load job data';
          showError(errorMessage);
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
        const { templateId, status, clientId, assignedWorkerId, ...dynamicFields } = data;

        // Build fieldValues from dynamic fields (those starting with "field_")
        const fieldValues: { [key: string]: string } = {};
        Object.entries(dynamicFields).forEach(([key, value]) => {
          if (key.startsWith('field_')) {
            const fieldName = key.replace('field_', '');
            fieldValues[fieldName] = String(value || '');
          }
        });

        if (isEditMode) {
          // Update existing job
          await jobService.updateJob(jobId, {
            status,
            clientId,
            assignedWorkerId,
            archived: false,
            fieldValues,
          });
          showSuccess('Job updated successfully');
        } else {
          // Create new job
          await jobService.createJob({
            templateId: Number(templateId),
            status,
            clientId,
            assignedWorkerId,
            fieldValues,
          });
          showSuccess('Job created successfully');
        }

        // Call onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving job:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save job';
        showError(errorMessage);
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
