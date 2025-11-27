import React, { useMemo, useCallback } from 'react';
import { AddWorkerScreen } from '../../../../components/UI/GlobalModal/screens/AddWorker';
import type { AddWorkerFormData } from '../../../../components/UI/GlobalModal/screens/AddWorker';
import { WorkerControllerApi } from '../../../../../workflow-api/api';
import { Configuration } from '../../../../../workflow-api/configuration';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { apiClient } from '../../../../services/api/client';
import { env } from '../../../../config/env';
import { useNavigate } from 'react-router-dom';

export const SetupForm: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();

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

  const handleAddWorker = useCallback(
    async (data: AddWorkerFormData) => {
      try {
        const response = await workerApi.createWorker({
          name: data.name,
          initials: data.initials,
          email: data.email,
          telephone: data.telephone,
          mobile: data.mobile,
          username: data.username,
          password: data.password,
        });

        showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Worker added successfully');

        // Navigate back to list view
        navigate('/workers');
      } catch (error) {
        console.error('Error adding worker:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to add worker';
        showError(errorMessage);
        throw error;
      }
    },
    [workerApi, showSuccess, showError, navigate]
  );

  return <AddWorkerScreen onInvite={handleAddWorker} />;
};
