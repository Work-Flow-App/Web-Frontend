import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { SetupForm } from '../SetupForm';
import { workerService, type Worker } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { columns, type WorkerTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch workers from API
  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);

      // Use workerService to fetch workers
      const response = await workerService.getAllWorkers();

      // Get the workers array from response
      const workersData = Array.isArray(response.data) ? response.data : [];

      // Transform API response to table format
      const transformedData: WorkerTableRow[] = workersData.map((worker: Worker) => ({
        id: worker.id || 0,
        name: worker.name || '',
        email: worker.email || '',
        username: worker.username || '',
        telephone: worker.telephone || '',
        mobile: worker.mobile || '',
        initials: worker.initials || '',
        addedOn: worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '',
      }));

      setWorkers(transformedData);
    } catch (error) {
      console.error('Error fetching workers:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to load workers';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

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
        <SetupForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchWorkers();
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
          <SetupForm
            isModal={true}
            workerId={worker.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchWorkers();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchWorkers]
  );

  // Handle delete worker
  const handleDeleteWorker = useCallback(
    (worker: WorkerTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteWorker',
        children: (
          <ConfirmationModal
            title="Delete Worker"
            message={`Are you sure you want to delete ${worker.name}?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await workerService.deleteWorker(worker.id);
                showSuccess(`${worker.name} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchWorkers();
              } catch (error) {
                console.error('Error deleting worker:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete worker';
                showError(errorMessage);
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
    },
    [showSuccess, showError, fetchWorkers, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Define table actions
  const tableActions: ITableAction<WorkerTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditWorker,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteWorker,
        color: 'error' as const,
      },
    ],
    [handleEditWorker, handleDeleteWorker]
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
        actions={tableActions}
        loading={loading}
        emptyMessage="No workers found. Add your first worker to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
