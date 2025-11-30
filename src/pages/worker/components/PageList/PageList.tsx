import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import { ActionButton } from '../../../../components/UI/Table/Table.styles';
import { MoreOptionsIcon } from '../../../../components/UI/Table/icons';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { AddWorkerScreen } from '../../../../components/UI/GlobalModal/screens/AddWorker';
import type { AddWorkerFormData } from '../../../../components/UI/GlobalModal/screens/AddWorker';
import { WorkerControllerApi } from '../../../../../workflow-api/api';
import type { WorkerResponse } from '../../../../../workflow-api/api';
import { Configuration } from '../../../../../workflow-api/configuration';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { apiClient } from '../../../../services/api/client';
import { env } from '../../../../config/env';
import { columns, type WorkerTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerTableRow | null>(null);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Initialize API client
  const workerApi = useMemo(
    () =>
      new WorkerControllerApi(
        new Configuration({
          basePath: env.apiBaseUrl,
          accessToken: () => {
            const token = apiClient.getStoredAccessToken();
            console.log('🔑 Token for API call:', token ? 'EXISTS' : 'MISSING');
            if (token) {
              console.log('   Token preview:', token.substring(0, 30) + '...');
            }
            return token || '';
          },
        })
      ),
    []
  );

  // Fetch workers from API
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerApi.getAllWorkers();

      // Get the workers array from response
      const workersData = Array.isArray(response.data) ? response.data : [];

      // Transform API response to table format
      const transformedData: WorkerTableRow[] = workersData.map((worker: WorkerResponse) => ({
        id: worker.id || 0,
        name: worker.name || '',
        email: worker.email || '',
        username: worker.username || '',
        telephone: worker.telephone || '-',
        mobile: worker.mobile || '-',
        role: 'Worker',
        jobAssignments: 0,
        status: worker.archived ? 'deactivated' : worker.loginLocked ? 'pending' : 'active',
        addedOn: worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '-',
      }));

      setWorkers(transformedData);
    } catch (error: any) {
      console.error('Error fetching workers:', error);
      console.error('Error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        headers: error?.response?.headers,
      });

      const errorMessage = error instanceof Error ? error.message : 'Failed to load workers';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [workerApi, showError]);

  // Load workers on mount
  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  // Handle add worker
  const handleAddWorker = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorker',
      children: (
        <AddWorkerScreen
          onInvite={async (data: AddWorkerFormData) => {
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
              resetGlobalModalOuterProps();
              fetchWorkers();
            } catch (error) {
              console.error('Error adding worker:', error);
              const errorMessage = error instanceof Error ? error.message : 'Failed to add worker';
              showError(errorMessage);
              throw error;
            }
          }}
        />
      ),
    });
  };

  // Handle edit worker
  const handleEditWorker = useCallback(
    (worker: WorkerTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editWorker',
        children: (
          <AddWorkerScreen
            onInvite={async (data: AddWorkerFormData) => {
              try {
                const response = await workerApi.updateWorker(worker.id, {
                  name: data.name,
                  initials: data.initials,
                  email: data.email,
                  telephone: data.telephone,
                  mobile: data.mobile,
                });

                showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Worker updated successfully');
                resetGlobalModalOuterProps();
                fetchWorkers();
              } catch (error) {
                console.error('Error updating worker:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to update worker';
                showError(errorMessage);
                throw error;
              }
            }}
          />
        ),
      });
    },
    [workerApi, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchWorkers]
  );

  // Handle delete worker
  const handleDeleteWorker = useCallback(
    async (worker: WorkerTableRow) => {
      if (!window.confirm(`Are you sure you want to delete ${worker.name}?`)) {
        return;
      }

      try {
        await workerApi.deleteWorker(worker.id);
        showSuccess(`${worker.name} deleted successfully`);
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete worker';
        showError(errorMessage);
      }
    },
    [workerApi, showSuccess, showError, fetchWorkers]
  );

  // Handle send invitation
  const handleSendInvitation = useCallback(
    async (worker: WorkerTableRow) => {
      try {
        const response = await workerApi.sendInvitation(worker.id);
        showSuccess(response.data.message || `Invitation sent to ${worker.email}`);
      } catch (error) {
        console.error('Error sending invitation:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation';
        showError(errorMessage);
      }
    },
    [workerApi, showSuccess, showError]
  );

  // Handle menu open
  const handleMenuOpen = useCallback((worker: WorkerTableRow, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedWorker(worker);
  }, []);

  // Handle menu close
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedWorker(null);
  }, []);

  // Handle menu actions
  const handleMenuEdit = useCallback(() => {
    if (selectedWorker) {
      handleEditWorker(selectedWorker);
      handleMenuClose();
    }
  }, [selectedWorker, handleEditWorker, handleMenuClose]);

  const handleMenuDelete = useCallback(() => {
    if (selectedWorker) {
      handleDeleteWorker(selectedWorker);
      handleMenuClose();
    }
  }, [selectedWorker, handleDeleteWorker, handleMenuClose]);

  const handleMenuInvite = useCallback(() => {
    if (selectedWorker) {
      handleSendInvitation(selectedWorker);
      handleMenuClose();
    }
  }, [selectedWorker, handleSendInvitation, handleMenuClose]);

  // Render action menu
  const renderActions = useCallback(
    (worker: WorkerTableRow) => (
      <>
        <ActionButton onClick={(e) => handleMenuOpen(worker, e)}>
          <MoreOptionsIcon />
        </ActionButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && selectedWorker?.id === worker.id}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleMenuEdit}>Edit</MenuItem>
          <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
          <MenuItem onClick={handleMenuInvite}>Send Invitation</MenuItem>
        </Menu>
      </>
    ),
    [anchorEl, selectedWorker, handleMenuOpen, handleMenuClose, handleMenuEdit, handleMenuDelete, handleMenuInvite]
  );

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      actions={[
        {
          label: 'Add Worker',
          onClick: handleAddWorker,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search workers"
    >
      <Table<WorkerTableRow>
        columns={columns}
        data={workers}
        selectable
        showActions
        renderActions={renderActions}
        loading={loading}
        emptyMessage="No workers found. Add your first worker to get started."
        rowsPerPage={10}
        showPagination
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
