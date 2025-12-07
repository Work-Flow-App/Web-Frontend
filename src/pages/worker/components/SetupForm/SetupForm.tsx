import React, { useCallback, useEffect, useState } from 'react';
import { WorkerFormSchema, type WorkerFormData } from '../../schema/WorkerFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { WorkerFormFields } from '../WorkerFormFields';
import { Loader } from '../../../../components/UI';
import { workerService, type WorkerCreateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface SetupFormProps {
  isModal?: boolean;
  workerId?: number;
  onSuccess?: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ isModal = false, workerId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [workerData, setWorkerData] = useState<Partial<WorkerFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Set modal title and button text based on mode - do this FIRST so button text is always set
  useEffect(() => {
    if (isModal) {
      updateModalTitle(workerId ? 'Edit Worker' : 'Add New Worker');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: workerId ? 'Update' : 'Add Worker',
      });
    }
  }, [isModal, workerId, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch worker data when editing
  useEffect(() => {
    const fetchWorkerData = async () => {
      if (workerId) {
        try {
          setIsLoading(true);
          const response = await workerService.getWorkerById(workerId);
          const worker = response.data;

          // Map worker data to form data structure
          setWorkerData({
            name: worker.name || '',
            initials: worker.initials || '',
            email: worker.email || '',
            telephone: worker.telephone || '',
            mobile: worker.mobile || '',
            username: worker.username || '',
            password: '',
          });
        } catch (error) {
          console.error('Error fetching worker:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load worker data';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWorkerData();
  }, [workerId, showError]);

  const handleSubmit = useCallback(
    async (data: WorkerFormData) => {
      try {
        if (workerId) {
          // Update existing worker
          const response = await workerService.updateWorker(workerId, {
            name: data.name,
            initials: data.initials,
            email: data.email,
            telephone: data.telephone,
            mobile: data.mobile,
          });
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Worker updated successfully');
        } else {
          // Create new worker - only include optional fields if they have values
          const createPayload: WorkerCreateRequest = {
            name: data.name,
            email: data.email,
            username: data.username,
            password: data.password,
          };
          if (data.initials) createPayload.initials = data.initials;
          if (data.telephone) createPayload.telephone = data.telephone;
          if (data.mobile) createPayload.mobile = data.mobile;

          const response = await workerService.createWorker(createPayload);
          showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Worker added successfully');
        }

        // Call onSuccess callback if provided (for modal usage)
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate back to list view (for standalone usage)
          navigate('/workers');
        }
      } catch (error) {
        console.error('Error saving worker:', error);
        const errorMessage = error instanceof Error ? error.message : `Failed to ${workerId ? 'update' : 'add'} worker`;
        showError(errorMessage);
        throw error;
      }
      return { success: true };
    },
    [workerId, showSuccess, showError, onSuccess, navigate]
  );

  // Show loading state while fetching worker data
  if (workerId && isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={WorkerFormSchema}
      defaultValues={workerData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <WorkerFormFields />
    </SetupFormWrapper>
  );
};
