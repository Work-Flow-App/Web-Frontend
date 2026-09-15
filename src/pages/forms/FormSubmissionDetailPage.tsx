import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { Loader } from '../../components/UI';
import { Button } from '../../components/UI/Button';
import { FormField } from '../../components/UI/FormComponents';
import { Dropdown } from '../../components/UI/Forms/Dropdown';
import { Badge } from '../../components/UI/Badge';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../components/UI/GlobalModal';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useFormSubmit } from '../../hooks';
import { formService, workerService, FormFieldDtoRoleTargetEnum } from '../../services/api';
import type { FormSubmissionResponse, WorkerResponse } from '../../services/api';
import { buildFieldDefaultValues, buildFieldValueDtos, getMissingRequiredFieldLabels } from './utils/formFieldRender';
import { FormFieldRow } from './components/FormFieldRow';
import { floowColors } from '../../theme/colors';
import * as S from './FormSubmissionDetailPage.styles';

const FINAL_STATUSES = ['SUBMITTED', 'COMPLETED'];

export const FormSubmissionDetailPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { saving, withSaving } = useFormSubmit();

  const [submission, setSubmission] = useState<FormSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [uploadingFieldId, setUploadingFieldId] = useState<number | null>(null);

  const methods = useForm();

  const loadSubmission = useCallback(async () => {
    if (!submissionId) return;
    try {
      setLoading(true);
      // No get-by-id endpoint for submissions - the list is the source of truth.
      const response = await formService.getAllSubmissions();
      const found = (Array.isArray(response.data) ? response.data : []).find((s) => String(s.id) === submissionId);
      if (!found) {
        showError('Submission not found');
        return;
      }
      setSubmission(found);
      setSelectedWorkerId(found.workerId ?? null);
      methods.reset(buildFieldDefaultValues(found.values || []));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load submission'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, showError]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  useEffect(() => {
    workerService
      .getAllWorkers()
      .then((res) => setWorkers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const values = useMemo(() => submission?.values || [], [submission]);
  const isFinalized = submission ? FINAL_STATUSES.includes((submission.status || '').toUpperCase()) : false;

  const editableFieldIds = useMemo(
    () =>
      new Set(
        values
          .filter((v) => v.roleTarget === FormFieldDtoRoleTargetEnum.Company || v.roleTarget === FormFieldDtoRoleTargetEnum.Both)
          .map((v) => v.fieldId)
          .filter((id): id is number => id != null)
      ),
    [values]
  );

  const handleSaveValues = async () => {
    if (!submission?.id) return;
    const data = methods.getValues();

    const missing = getMissingRequiredFieldLabels(values, data, editableFieldIds);
    if (missing.length > 0) {
      showError(`Please fill in required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
      return;
    }

    await withSaving(async () => {
      try {
        const dtos = buildFieldValueDtos(values, data, editableFieldIds);
        const response = await formService.updateValues(submission.id!, dtos);
        setSubmission(response.data);
        showSuccess('Values saved');
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to save values'));
      }
    });
  };

  const handleUploadFile = async (fieldId: number, file: File) => {
    if (!submission?.id) return;
    try {
      setUploadingFieldId(fieldId);
      const response = await formService.uploadFile(submission.id, fieldId, file);
      setSubmission(response.data);
      showSuccess('File uploaded');
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to upload file'));
    } finally {
      setUploadingFieldId(null);
    }
  };

  const handleSendToWorker = async () => {
    if (!submission?.id || !selectedWorkerId) {
      showError('Select a worker to send this form to');
      return;
    }
    try {
      const response = await formService.sendToWorker(submission.id, selectedWorkerId);
      setSubmission(response.data);
      showSuccess('Form sent to worker');
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to send form to worker'));
    }
  };

  const handleDownloadPdf = async () => {
    if (!submission?.id) return;
    try {
      await formService.downloadPdf(submission.id, `${submission.title || 'form'}.pdf`);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to download PDF'));
    }
  };

  const handleDelete = () => {
    if (!submission?.id) return;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'deleteFormSubmission',
      children: (
        <ConfirmationModal
          title="Delete Submission"
          message={`Are you sure you want to delete "${submission.title}"?`}
          description="This action cannot be undone."
          variant="danger"
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          onConfirm={async () => {
            try {
              await formService.deleteSubmission(submission.id!);
              showSuccess('Submission deleted');
              resetGlobalModalOuterProps();
              navigate('/company/forms?tab=submissions');
            } catch (error) {
              showError(extractErrorMessage(error, 'Failed to delete submission'));
              resetGlobalModalOuterProps();
            }
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  const workerOptions = useMemo(
    () => workers.map((w) => ({ label: w.name || `Worker #${w.id}`, value: (w.id ?? 0).toString() })),
    [workers]
  );

  if (loading) return <Loader />;
  if (!submission) return <Typography>Submission not found</Typography>;

  return (
    <PageWrapper
      title={submission.title || 'Form Submission'}
      description="Fill in your fields, send the form to a worker, and export the finished PDF."
      actions={[
        { label: 'Back to Forms', onClick: () => navigate('/company/forms?tab=submissions'), variant: 'outlined', icon: <ArrowBackIcon /> },
        { label: 'Download PDF', onClick: handleDownloadPdf, variant: 'outlined', icon: <DownloadIcon /> },
        { label: 'Delete', onClick: handleDelete, variant: 'outlined', color: 'error', icon: <DeleteIcon /> },
      ]}
    >
      <FormProvider {...methods}>
        <S.DetailCard>
          <S.CardHeader>
            <S.SectionTitle>Overview</S.SectionTitle>
          </S.CardHeader>
          <S.CardBody>
            <S.MetaRow>
              <S.MetaItem>
                <S.MetaIconBadge tint={isFinalized ? floowColors.success.main : floowColors.warning.main}>
                  <FlagOutlinedIcon />
                </S.MetaIconBadge>
                <S.MetaText>
                  <span className="label">Status</span>
                  <Badge variant={isFinalized ? 'success' : 'warning'} size="small">
                    {submission.status || 'DRAFT'}
                  </Badge>
                </S.MetaText>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaIconBadge tint={floowColors.indigo.main}>
                  <DescriptionOutlinedIcon />
                </S.MetaIconBadge>
                <S.MetaText>
                  <span className="label">Template</span>
                  <span className="value">{submission.templateName || '-'}</span>
                </S.MetaText>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaIconBadge tint={floowColors.chart.quaternary}>
                  <PersonOutlineIcon />
                </S.MetaIconBadge>
                <S.MetaText>
                  <span className="label">Worker</span>
                  <span className={submission.workerName ? 'value' : 'value muted'}>{submission.workerName || 'Unassigned'}</span>
                </S.MetaText>
              </S.MetaItem>
              {submission.jobRef != null && (
                <S.MetaItem
                  onClick={() => navigate(`/company/jobs/${submission.jobRef}/details`)}
                  style={{ cursor: 'pointer' }}
                >
                  <S.MetaIconBadge tint={floowColors.chart.tertiary}>
                    <WorkOutlineIcon />
                  </S.MetaIconBadge>
                  <S.MetaText>
                    <span className="label">Job</span>
                    <span className="value">Job #{submission.jobRef}</span>
                  </S.MetaText>
                </S.MetaItem>
              )}
            </S.MetaRow>

            <S.SendToWorkerPanel>
              <div style={{ minWidth: 240 }}>
                <FormField label="Send to Worker">
                  <Dropdown
                    name="sendWorkerId"
                    preFetchedOptions={workerOptions}
                    placeHolder="Select a worker"
                    value={selectedWorkerId ? selectedWorkerId.toString() : undefined}
                    onChange={(value) => setSelectedWorkerId(value ? parseInt(value as string) : null)}
                    disablePortal
                    fullWidth
                    disabled={isFinalized}
                  />
                </FormField>
              </div>
              <Button variant="outlined" color="primary" onClick={handleSendToWorker} disabled={isFinalized} startIcon={<SendIcon fontSize="small" />}>
                Send
              </Button>
            </S.SendToWorkerPanel>
          </S.CardBody>
        </S.DetailCard>

        <S.DetailCard>
          <S.CardHeader>
            <S.SectionTitle>Fields</S.SectionTitle>
            <S.CountBadge>
              {values.length} {values.length === 1 ? 'field' : 'fields'}
            </S.CountBadge>
          </S.CardHeader>
          <S.CardBody>
            {values.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                This template has no fields.
              </Typography>
            ) : (
              <S.FieldsList>
                {values.map((value) => (
                  <FormFieldRow
                    key={value.id ?? value.fieldId}
                    value={value}
                    isEditable={!isFinalized && value.fieldId != null && editableFieldIds.has(value.fieldId)}
                    uploading={uploadingFieldId === value.fieldId}
                    onUploadFile={handleUploadFile}
                  />
                ))}
              </S.FieldsList>
            )}

            {!isFinalized && (
              <S.ActionsRow>
                <Button variant="contained" color="primary" onClick={handleSaveValues} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Values'}
                </Button>
              </S.ActionsRow>
            )}
          </S.CardBody>
        </S.DetailCard>
      </FormProvider>
    </PageWrapper>
  );
};

export default FormSubmissionDetailPage;
