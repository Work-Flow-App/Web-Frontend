import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { SetupForm } from '../SetupForm';
import { InviteWorkerForm } from '../InviteWorkerForm';
import { ResetPasswordForm } from '../ResetPasswordForm';
import { workerService } from '../../../../services/api';
import type { WorkerResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useFetch } from '../../../../hooks';
import { columns, type WorkerTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const navigate = useNavigate();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const { data: rawWorkers, loading, refetch: fetchWorkers } = useFetch(
    () => workerService.getAllWorkers(),
    [],
    { onError: (err) => showError(extractErrorMessage(err, 'Failed to load workers')) }
  );

  const workers = useMemo((): WorkerTableRow[] => {
    const workersData = Array.isArray(rawWorkers) ? rawWorkers : [];
    return workersData.map((worker: WorkerResponse) => ({
      id: worker.id || 0,
      name: worker.name || '',
      email: worker.email || '',
      username: worker.username || '',
      telephone: worker.telephone || '',
      mobile: worker.mobile || '',
      initials: worker.initials || '',
      addedOn: worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '',
    }));
  }, [rawWorkers]);

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

  // Handle invite worker
  const handleInviteWorker = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'inviteWorker',
      children: (
        <InviteWorkerForm
          onSuccess={() => {
            resetGlobalModalOuterProps();
          }}
          onCancel={() => {
            resetGlobalModalOuterProps();
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
                showError(extractErrorMessage(error, 'Failed to delete worker'));
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

  const handleResetPassword = useCallback(
    (worker: WorkerTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'resetWorkerPassword',
        children: (
          <ResetPasswordForm
            workerId={worker.id}
            workerName={worker.name}
            workerUsername={worker.username}
            onSuccess={() => resetGlobalModalOuterProps()}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const handleViewProfile = useCallback(
    (worker: WorkerTableRow) => {
      navigate(`/company/workers/${worker.id}`);
    },
    [navigate]
  );

  // Define table actions
  const tableActions: ITableAction<WorkerTableRow>[] = useMemo(
    () => [
      {
        id: 'view',
        label: 'View Profile',
        onClick: handleViewProfile,
      },
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditWorker,
      },
      {
        id: 'resetPassword',
        label: 'Reset Password',
        onClick: handleResetPassword,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteWorker,
        color: 'error' as const,
      },
    ],
    [handleViewProfile, handleEditWorker, handleResetPassword, handleDeleteWorker]
  );

  return (
    <PageWrapper
      title="All Workers"
      description="Manage worker details, roles, and assignments in one place."
      actions={[
        {
          label: 'Invite Worker',
          onClick: handleInviteWorker,
          variant: 'outlined',
          color: 'primary',
        },
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
        customiseColumns={true}
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
