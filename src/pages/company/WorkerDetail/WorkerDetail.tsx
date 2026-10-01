import React, { useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '@mui/material';
import Table from '../../../components/UI/Table/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { Button, IconButton } from '../../../components/UI/Button';
import { Badge } from '../../../components/UI/Badge';
import { Loader } from '../../../components/UI';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import {
  CertificateForm,
  createCertificateColumns,
  mapCertificateToRow,
  type CertificateTableRow,
} from '../../worker/components/CertificateForm';
import { AvatarUpload } from '../../worker/components/AvatarUpload';
import { WeeklyHoursCard } from '../../worker/components/WeeklyHoursCard';
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

  const {
    data: worker,
    loading: loadingWorker,
    refetch: refetchWorker,
  } = useFetch(
    () => workerService.getWorkerById(numericWorkerId),
    [numericWorkerId],
    { onError: (err) => showError(extractErrorMessage(err, 'Failed to load worker')) }
  );

  const handlePhotoUpload = useCallback(
    async (file: File) => {
      await workerService.uploadWorkerPhoto(numericWorkerId, file);
      refetchWorker();
      showSuccess('Photo updated successfully.');
    },
    [numericWorkerId, refetchWorker, showSuccess]
  );

  const fetchWorkerWeeklyHours = useCallback(
    (date?: string) => workerService.getWorkerWeeklyHours(numericWorkerId, date),
    [numericWorkerId]
  );

  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [overtimeRateInput, setOvertimeRateInput] = useState('');
  const [savingRate, setSavingRate] = useState(false);

  const handleRateEditStart = useCallback(() => {
    setRateInput(worker?.hourlyRate != null ? String(worker.hourlyRate) : '');
    setOvertimeRateInput(worker?.overtimeRate != null ? String(worker.overtimeRate) : '');
    setIsEditingRate(true);
  }, [worker?.hourlyRate, worker?.overtimeRate]);

  const handleRateCancel = useCallback(() => setIsEditingRate(false), []);

  const handleRateSave = useCallback(async () => {
    const parsedRate = Number(rateInput);
    if (rateInput.trim() === '' || Number.isNaN(parsedRate) || parsedRate < 0) {
      showError('Enter a valid hourly rate.');
      return;
    }

    let parsedOvertimeRate: number | undefined;
    if (overtimeRateInput.trim() !== '') {
      parsedOvertimeRate = Number(overtimeRateInput);
      if (Number.isNaN(parsedOvertimeRate) || parsedOvertimeRate < 0) {
        showError('Enter a valid overtime rate.');
        return;
      }
    }

    setSavingRate(true);
    try {
      await workerService.updateWorkerRate(numericWorkerId, parsedRate, parsedOvertimeRate);
      refetchWorker();
      setIsEditingRate(false);
      showSuccess('Rates updated.');
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to update rates'));
    } finally {
      setSavingRate(false);
    }
  }, [rateInput, overtimeRateInput, numericWorkerId, refetchWorker, showSuccess, showError]);

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

  if (loadingWorker) {
    return <Loader />;
  }

  return (
    <S.PageContent>
      <S.ProfileHeaderCard>
        <AvatarUpload photoUrl={worker?.photoUrl} name={worker?.name} editable={canManageWorkers} onUpload={handlePhotoUpload} />

        <S.HeaderTop>
          <S.IdBlock>
            <S.HeaderTitleRow>
              <S.HeaderTitle>{worker?.name || 'Worker'}</S.HeaderTitle>
              {worker?.archived && (
                <Badge variant="default" size="small">
                  Archived
                </Badge>
              )}
            </S.HeaderTitleRow>
            <S.HeaderMetaRow>
              {worker?.username && <span>@{worker.username}</span>}
              {worker?.email && (
                <>
                  <S.HeaderMetaDot>&bull;</S.HeaderMetaDot>
                  <a href={`mailto:${worker.email}`}>{worker.email}</a>
                </>
              )}
              {(worker?.telephone || worker?.mobile) && (
                <>
                  <S.HeaderMetaDot>&bull;</S.HeaderMetaDot>
                  <span>{worker?.telephone || worker?.mobile}</span>
                </>
              )}
            </S.HeaderMetaRow>
          </S.IdBlock>

          <S.HeaderActionsRow>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={() => navigate('/company/workers')}
            >
              Back to Workers
            </Button>
            {canManageWorkers && (
              <Button variant="contained" color="primary" size="small" onClick={handleUploadCertificate}>
                Upload Certificate
              </Button>
            )}
          </S.HeaderActionsRow>
        </S.HeaderTop>
      </S.ProfileHeaderCard>

      <S.StatsRow>
        <WeeklyHoursCard fetchHours={fetchWorkerWeeklyHours} />

        <S.RateCard>
          <S.RateColsRow>
            <S.RateMainCol>
              <S.RateLabel>Hourly Rate</S.RateLabel>
              {isEditingRate ? (
                <TextField
                  type="number"
                  size="small"
                  autoFocus
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  disabled={savingRate}
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  sx={{ width: 120 }}
                />
              ) : (
                <S.RateValue $empty={worker?.hourlyRate == null}>
                  {worker?.hourlyRate != null ? (
                    <>
                      {worker.hourlyRate}
                      <span>/hr</span>
                    </>
                  ) : (
                    'Not set'
                  )}
                </S.RateValue>
              )}
            </S.RateMainCol>

            <S.RateMainCol>
              <S.RateLabel>Overtime Rate</S.RateLabel>
              {isEditingRate ? (
                <TextField
                  type="number"
                  size="small"
                  value={overtimeRateInput}
                  onChange={(e) => setOvertimeRateInput(e.target.value)}
                  disabled={savingRate}
                  placeholder="Optional"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  sx={{ width: 120 }}
                />
              ) : (
                <S.RateValue $empty={worker?.overtimeRate == null}>
                  {worker?.overtimeRate != null ? (
                    <>
                      {worker.overtimeRate}
                      <span>/hr</span>
                    </>
                  ) : (
                    'Not set'
                  )}
                </S.RateValue>
              )}
            </S.RateMainCol>
          </S.RateColsRow>

          {canManageWorkers && (
            <S.RateEditRow>
              {isEditingRate ? (
                <>
                  <IconButton size="small" color="success" onClick={handleRateSave} disabled={savingRate} aria-label="Save rates">
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={handleRateCancel} disabled={savingRate} aria-label="Cancel">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <IconButton size="small" variant="text" color="secondary" onClick={handleRateEditStart} aria-label="Edit rates">
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </S.RateEditRow>
          )}
        </S.RateCard>
      </S.StatsRow>

      <div>
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
          view={false}
        />
      </div>
    </S.PageContent>
  );
};

export default WorkerDetail;
