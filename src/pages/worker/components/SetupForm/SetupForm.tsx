import React, { useMemo, useCallback, useEffect } from 'react';
import { WorkerFormSchema, type WorkerFormData } from '../../schema/WorkerFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { WorkerFormFields } from '../WorkerFormFields';
import { WorkerControllerApi } from '../../../../../workflow-api/api';
import { Configuration } from '../../../../../workflow-api/configuration';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { apiClient } from '../../../../services/api/client';
import { env } from '../../../../config/env';
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

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(workerId ? 'Edit Worker' : 'Add New Worker');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: workerId ? 'Update' : 'Add Worker',
      });
    }
  }, [isModal, workerId, updateModalTitle, updateGlobalModalInnerConfig]);

  // Initialize API client
  const workerApi = useMemo(
    () =>
      new WorkerControllerApi(
        new Configuration({
          basePath: env.apiBaseUrl,
          accessToken: () => {
            return apiClient.getStoredAccessToken() || '';
          },
        })
      ),
    []
  );

  const handleSubmit = useCallback(
    async (data: WorkerFormData) => {
      try {
        let response;

        if (workerId) {
          // Update existing worker
          response = await workerApi.updateWorker(workerId, {
            name: data.name,
            initials: data.initials,
            email: data.email,
            telephone: data.telephone,
            mobile: data.mobile,
          });
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Worker updated successfully');
        } else {
          // Create new worker
          response = await workerApi.createWorker({
            name: data.name,
            initials: data.initials,
            email: data.email,
            telephone: data.telephone,
            mobile: data.mobile,
            username: data.username,
            password: data.password,
          });
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
    [workerApi, workerId, showSuccess, showError, onSuccess, navigate]
  );

  return (
    <SetupFormWrapper
      schema={WorkerFormSchema}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <WorkerFormFields />
    </SetupFormWrapper>
  );
};
