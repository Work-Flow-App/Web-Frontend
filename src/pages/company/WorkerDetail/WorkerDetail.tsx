import React, { useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table from '../../../components/UI/Table/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { Button } from '../../../components/UI/Button';
import { Loader } from '../../../components/UI';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import {
  CertificateForm,
  createCertificateColumns,
  mapCertificateToRow,
  type CertificateTableRow,
} from '../../worker/components/CertificateForm';
import { workerService, certificateService } from '../../../services/api';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useFetch } from '../../../hooks';
import * as S from './WorkerDetail.styles';

export const WorkerDetail: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const navigate = useNavigate();
  const { canManageWorkers } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const numericWorkerId = Number(workerId);

  const { data: worker, loading: loadingWorker } = useFetch(
    () => workerService.getWorkerById(numericWorkerId),
    [numericWorkerId],
    { onError: (err) => showError(extractErrorMessage(err, 'Failed to load worker')) }
  );

  const {
    data: rawCertificates,
    loading: loadingCertificates,
    refetch: refetchCertificates,
  } = useFetch(
    () => certificateService.getWorkerCertificates(numericWorkerId),
    [numericWorkerId],
    { onError: (err) => showError(extractErrorMessage(err, 'Failed to load certificates')) }
  );

  const certificates = useMemo((): CertificateTableRow[] => {
    const list = Array.isArray(rawCertificates) ? rawCertificates : [];
    return list.map(mapCertificateToRow);
  }, [rawCertificates]);

  const handleUploadCertificate = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'uploadWorkerCertificate',
      children: (
        <CertificateForm
          isModal
          workerId={numericWorkerId}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            refetchCertificates();
          }}
        />
      ),
    });
  };

  const handleDeleteCertificate = useCallback(
    (row: CertificateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteWorkerCertificate',
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
                await certificateService.deleteWorkerCertificate(numericWorkerId, row.id);
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
    [numericWorkerId, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetchCertificates]
  );

  const certificateActions: ITableAction<CertificateTableRow>[] = useMemo(
    () => (canManageWorkers ? [{ id: 'delete', label: 'Delete', onClick: handleDeleteCertificate, color: 'error' as const }] : []),
    [canManageWorkers, handleDeleteCertificate]
  );

  const certificateColumns = useMemo(() => createCertificateColumns(), []);

  const pageActions = useMemo(
    () => (canManageWorkers ? [{ label: 'Upload Certificate', onClick: handleUploadCertificate, variant: 'contained' as const, color: 'primary' as const }] : []),
    [canManageWorkers]
  );

  if (loadingWorker) {
    return <Loader />;
  }

  return (
    <PageWrapper
      title={worker?.name || 'Worker'}
      description={worker?.email}
      actions={pageActions}
      headerExtra={
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<ArrowBackIcon fontSize="small" />}
          onClick={() => navigate('/company/workers')}
        >
          Back to Workers
        </Button>
      }
    >
      <S.SectionTitle variant="subtitle1">Certificates</S.SectionTitle>
      <Table<CertificateTableRow>
        columns={certificateColumns}
        data={certificates}
        showActions={canManageWorkers}
        actions={certificateActions}
        loading={loadingCertificates}
        emptyMessage="No certificates on file for this worker."
        rowsPerPage={10}
        showPagination
      />
    </PageWrapper>
  );
};

export default WorkerDetail;
