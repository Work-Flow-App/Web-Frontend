import React, { useCallback, useMemo, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table from '../../../components/UI/Table/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import {
  CertificateForm,
  createCertificateColumns,
  mapCertificateToRow,
  type CertificateTableRow,
} from '../components/CertificateForm';
import { LeaveRequestForm } from '../components/LeaveRequestForm';
import { certificateService, leaveService, LeaveStatus } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useFetch } from '../../../hooks';
import { createLeaveColumns, mapLeaveToRow, type LeaveTableRow } from './WorkerProfile.columns';
import * as S from './WorkerProfile.styles';

export const WorkerProfile: React.FC = () => {
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: rawCertificates,
    loading: loadingCertificates,
    refetch: refetchCertificates,
  } = useFetch(() => certificateService.getMyCertificates(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load certificates')),
  });

  const {
    data: rawLeaveRequests,
    loading: loadingLeaveRequests,
    refetch: refetchLeaveRequests,
  } = useFetch(() => leaveService.getMyLeaveRequests(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load leave requests')),
  });

  const certificates = useMemo((): CertificateTableRow[] => {
    const list = Array.isArray(rawCertificates) ? rawCertificates : [];
    return list.map(mapCertificateToRow);
  }, [rawCertificates]);

  const leaveRequests = useMemo((): LeaveTableRow[] => {
    const list = Array.isArray(rawLeaveRequests) ? rawLeaveRequests : [];
    return list.map(mapLeaveToRow);
  }, [rawLeaveRequests]);

  // Certificates handlers
  const handleUploadCertificate = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'uploadCertificate',
      children: (
        <CertificateForm
          isModal
          onSuccess={() => {
            resetGlobalModalOuterProps();
            refetchCertificates();
          }}
        />
      ),
    });
  };

  const handleEditCertificate = useCallback(
    (row: CertificateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editCertificate',
        children: (
          <CertificateForm
            isModal
            certificate={row.raw}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetchCertificates();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetchCertificates]
  );

  const handleDeleteCertificate = useCallback(
    (row: CertificateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCertificate',
        children: (
          <ConfirmationModal
            title="Delete Certificate"
            message={`Are you sure you want to delete "${row.name}"?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await certificateService.deleteMyCertificate(row.id);
                showSuccess('Certificate deleted');
                resetGlobalModalOuterProps();
                refetchCertificates();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete certificate'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetchCertificates]
  );

  const certificateActions: ITableAction<CertificateTableRow>[] = useMemo(
    () => [
      { id: 'edit', label: 'Edit', onClick: handleEditCertificate },
      { id: 'delete', label: 'Delete', onClick: handleDeleteCertificate, color: 'error' as const },
    ],
    [handleEditCertificate, handleDeleteCertificate]
  );

  // Leave request handlers
  const handleRequestLeave = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'requestLeave',
      children: (
        <LeaveRequestForm
          isModal
          onSuccess={() => {
            resetGlobalModalOuterProps();
            refetchLeaveRequests();
          }}
        />
      ),
    });
  };

  const handleEditLeave = useCallback(
    (row: LeaveTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editLeave',
        children: (
          <LeaveRequestForm
            isModal
            leaveRequest={row.raw}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetchLeaveRequests();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetchLeaveRequests]
  );

  const handleCancelLeave = useCallback(
    (row: LeaveTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'cancelLeave',
        children: (
          <ConfirmationModal
            title="Cancel Leave Request"
            message={`Cancel your ${row.type.toLowerCase()} leave request for ${row.startDate} - ${row.endDate}?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Cancel Request"
            cancelButtonText="Keep Request"
            onConfirm={async () => {
              try {
                await leaveService.cancelLeaveRequest(row.id);
                showSuccess('Leave request cancelled');
                resetGlobalModalOuterProps();
                refetchLeaveRequests();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to cancel leave request'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetchLeaveRequests]
  );

  const leaveActions: ITableAction<LeaveTableRow>[] = useMemo(
    () => [
      { id: 'edit', label: 'Edit', onClick: handleEditLeave, show: (row) => row.status === LeaveStatus.Pending },
      {
        id: 'cancel',
        label: 'Cancel',
        onClick: handleCancelLeave,
        color: 'error' as const,
        show: (row) => row.status === LeaveStatus.Pending,
      },
    ],
    [handleEditLeave, handleCancelLeave]
  );

  const certificateColumns = useMemo(() => createCertificateColumns(), []);
  const leaveColumns = useMemo(() => createLeaveColumns(), []);

  const pageActions = useMemo(() => {
    if (activeTab === 0) {
      return [{ label: 'Upload Certificate', onClick: handleUploadCertificate, variant: 'contained' as const, color: 'primary' as const }];
    }
    return [{ label: 'Request Leave', onClick: handleRequestLeave, variant: 'contained' as const, color: 'primary' as const }];
  }, [activeTab]);

  return (
    <PageWrapper title="My Profile" description="Manage your certificates and leave requests." actions={pageActions}>
      <S.TabsWrapper>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<WorkspacePremiumOutlinedIcon fontSize="small" />} iconPosition="start" label="Certificates" />
          <Tab icon={<EventAvailableOutlinedIcon fontSize="small" />} iconPosition="start" label="Leave" />
        </Tabs>
      </S.TabsWrapper>

      {activeTab === 0 && (
        <Table<CertificateTableRow>
          columns={certificateColumns}
          data={certificates}
          showActions
          actions={certificateActions}
          loading={loadingCertificates}
          emptyMessage="No certificates uploaded yet."
          rowsPerPage={10}
          showPagination
        />
      )}

      {activeTab === 1 && (
        <Table<LeaveTableRow>
          columns={leaveColumns}
          data={leaveRequests}
          showActions
          actions={leaveActions}
          loading={loadingLeaveRequests}
          emptyMessage="No leave requests submitted yet."
          rowsPerPage={10}
          showPagination
        />
      )}
    </PageWrapper>
  );
};

export default WorkerProfile;
