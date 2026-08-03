import React, { useCallback, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import Table from '../../../components/UI/Table/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { Button } from '../../../components/UI/Button';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import {
  CertificateForm,
  createCertificateColumns,
  mapCertificateToRow,
  type CertificateTableRow,
} from '../components/CertificateForm';
import { LeaveRequestForm } from '../components/LeaveRequestForm';
import { AvatarUpload } from '../components/AvatarUpload';
import { WeeklyHoursCard } from '../components/WeeklyHoursCard';
import { certificateService, leaveService, workerService, LeaveStatus } from '../../../services/api';
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
    data: profile,
    loading: loadingProfile,
    refetch: refetchProfile,
  } = useFetch(() => workerService.getMyProfile(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load profile')),
  });

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      await workerService.uploadMyPhoto(file);
      refetchProfile();
      showSuccess('Photo updated successfully.');
    },
    [refetchProfile, showSuccess]
  );

  const fetchMyWeeklyHours = useCallback((date?: string) => workerService.getMyWeeklyHours(date), []);

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

  if (loadingProfile) {
    return (
      <S.PageContent>
        <S.LoadingContainer>
          <CircularProgress size={40} />
        </S.LoadingContainer>
      </S.PageContent>
    );
  }

  return (
    <S.PageContent>
      <S.ProfileHeaderCard>
        <S.HeaderRow>
          <AvatarUpload photoUrl={profile?.photoUrl} name={profile?.name} editable onUpload={handlePhotoUpload} />

          <S.HeaderTop>
            <S.IdBlock>
              <S.HeaderTitle>{profile?.name || 'Worker'}</S.HeaderTitle>
              <S.HeaderMetaRow>
                {profile?.username && <span>@{profile.username}</span>}
                {profile?.email && (
                  <>
                    <S.HeaderMetaDot>&bull;</S.HeaderMetaDot>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </>
                )}
                {(profile?.telephone || profile?.mobile) && (
                  <>
                    <S.HeaderMetaDot>&bull;</S.HeaderMetaDot>
                    <span>{profile?.telephone || profile?.mobile}</span>
                  </>
                )}
              </S.HeaderMetaRow>
            </S.IdBlock>

            <S.HeaderActionsRow>
              {activeTab === 0 ? (
                <Button variant="contained" color="primary" onClick={handleUploadCertificate}>
                  Upload Certificate
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleRequestLeave}>
                  Request Leave
                </Button>
              )}
            </S.HeaderActionsRow>
          </S.HeaderTop>
        </S.HeaderRow>

        <S.TabsWrapper>
          <S.StyledTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <S.StyledTab icon={<WorkspacePremiumOutlinedIcon fontSize="small" />} iconPosition="start" label="Certificates" />
            <S.StyledTab icon={<EventAvailableOutlinedIcon fontSize="small" />} iconPosition="start" label="Leave" />
          </S.StyledTabs>
        </S.TabsWrapper>
      </S.ProfileHeaderCard>

      <WeeklyHoursCard fetchHours={fetchMyWeeklyHours} />

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
    </S.PageContent>
  );
};

export default WorkerProfile;
