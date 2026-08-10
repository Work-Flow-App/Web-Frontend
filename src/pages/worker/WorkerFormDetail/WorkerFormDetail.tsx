import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { Button } from '../../../components/UI/Button';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useFormSubmit } from '../../../hooks';
import { formService, FormFieldDtoRoleTargetEnum } from '../../../services/api';
import type { FormSubmissionResponse } from '../../../services/api';
import { buildFieldDefaultValues, buildFieldValueDtos, getMissingRequiredFieldLabels } from '../../forms/utils/formFieldRender';
import { FormFieldRow } from '../../forms/components/FormFieldRow';
import * as M from '../styles/WorkerMobile.styles';
import * as S from './WorkerFormDetail.styles';

const FINAL_STATUSES = ['SUBMITTED', 'COMPLETED'];

export const WorkerFormDetail: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { saving, withSaving } = useFormSubmit();

  const [submission, setSubmission] = useState<FormSubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingFieldId, setUploadingFieldId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm();

  const loadForm = useCallback(async () => {
    if (!formId) return;
    try {
      setLoading(true);
      const response = await formService.getMyForms();
      const found = (Array.isArray(response.data) ? response.data : []).find((s) => String(s.id) === formId);
      if (!found) {
        showError('Form not found');
        return;
      }
      setSubmission(found);
      methods.reset(buildFieldDefaultValues(found.values || []));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load form'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, showError]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const values = useMemo(() => submission?.values || [], [submission]);
  const isFinalized = submission ? FINAL_STATUSES.includes((submission.status || '').toUpperCase()) : false;

  const editableFieldIds = useMemo(
    () =>
      new Set(
        values
          .filter((v) => v.roleTarget === FormFieldDtoRoleTargetEnum.Worker || v.roleTarget === FormFieldDtoRoleTargetEnum.Both)
          .map((v) => v.fieldId)
          .filter((id): id is number => id != null)
      ),
    [values]
  );

  const handleSaveValues = async () => {
    if (!submission?.id) return;
    await withSaving(async () => {
      try {
        const data = methods.getValues();
        const dtos = buildFieldValueDtos(values, data, editableFieldIds);
        const response = await formService.fillValues(submission.id!, dtos);
        setSubmission(response.data);
        showSuccess('Progress saved');
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to save progress'));
      }
    });
  };

  const handleUploadFile = async (fieldId: number, file: File) => {
    if (!submission?.id) return;
    try {
      setUploadingFieldId(fieldId);
      const response = await formService.uploadMyFile(submission.id, fieldId, file);
      setSubmission(response.data);
      showSuccess('File uploaded');
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to upload file'));
    } finally {
      setUploadingFieldId(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!submission?.id) return;
    try {
      await formService.downloadMyPdf(submission.id, `${submission.title || 'form'}.pdf`);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to download PDF'));
    }
  };

  const handleSubmit = () => {
    if (!submission?.id) return;

    // Check the live form data, not the last-saved snapshot - a value just typed in but not
    // yet "Save Progress"-d still counts as filled, since onConfirm below saves it anyway.
    const data = methods.getValues();
    const missing = getMissingRequiredFieldLabels(values, data, editableFieldIds);
    if (missing.length > 0) {
      showError(`Please fill in required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
      return;
    }

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'submitForm',
      children: (
        <ConfirmationModal
          title="Submit Form"
          message="Submit this form? You won't be able to make further changes after submitting."
          variant="default"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={async () => {
            try {
              setSubmitting(true);
              // Save any unsaved changes first so the submission reflects the latest answers.
              const data = methods.getValues();
              const dtos = buildFieldValueDtos(values, data, editableFieldIds);
              if (dtos.length > 0) await formService.fillValues(submission.id!, dtos);
              const response = await formService.submitForm(submission.id!);
              setSubmission(response.data);
              showSuccess('Form submitted');
              resetGlobalModalOuterProps();
            } catch (error) {
              showError(extractErrorMessage(error, 'Failed to submit form'));
              resetGlobalModalOuterProps();
            } finally {
              setSubmitting(false);
            }
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  const handleBackClick = () => navigate('/worker/forms');

  if (loading) {
    return (
      <M.WorkerShell>
        <M.WorkerHeader>
          <M.BackIconButton onClick={handleBackClick} aria-label="Back">
            <ArrowBackIcon />
          </M.BackIconButton>
          <h1>Form</h1>
        </M.WorkerHeader>
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      </M.WorkerShell>
    );
  }

  if (!submission) {
    return (
      <M.WorkerShell>
        <M.WorkerHeader>
          <M.BackIconButton onClick={handleBackClick} aria-label="Back">
            <ArrowBackIcon />
          </M.BackIconButton>
          <h1>Form</h1>
        </M.WorkerHeader>
        <M.EmptyState>Form not found</M.EmptyState>
      </M.WorkerShell>
    );
  }

  const statusTheme = M.resolveStatusTheme(isFinalized ? 'COMPLETED' : 'STARTED');

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <M.BackIconButton onClick={handleBackClick} aria-label="Back">
          <ArrowBackIcon />
        </M.BackIconButton>
        <h1>{submission.title || submission.templateName || 'Form'}</h1>
      </M.WorkerHeader>

      <M.StepBadgesRow>
        <M.RefBadgeRow>
          <M.RefBadge>{submission.templateName || 'Form'}</M.RefBadge>
          <M.StatusPill bg={statusTheme.pillBg} fg={statusTheme.pillFg}>
            {submission.status || 'DRAFT'}
          </M.StatusPill>
        </M.RefBadgeRow>
        <Button variant="outlined" size="small" onClick={handleDownloadPdf} startIcon={<DownloadOutlinedIcon fontSize="small" />}>
          PDF
        </Button>
      </M.StepBadgesRow>

      <S.FieldsCard>
        <FormProvider {...methods}>
          {values.length === 0 ? (
            <S.EmptyText>This form has no fields.</S.EmptyText>
          ) : (
            values.map((value) => (
              <FormFieldRow
                key={value.id ?? value.fieldId}
                value={value}
                isEditable={!isFinalized && value.fieldId != null && editableFieldIds.has(value.fieldId)}
                uploading={uploadingFieldId === value.fieldId}
                onUploadFile={handleUploadFile}
              />
            ))
          )}
        </FormProvider>

        {!isFinalized && (
          <S.ActionsRow>
            <Button variant="outlined" color="primary" onClick={handleSaveValues} disabled={saving || submitting}>
              {saving ? 'Saving...' : 'Save Progress'}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving || submitting}>
              {submitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </S.ActionsRow>
        )}
      </S.FieldsCard>
    </M.WorkerShell>
  );
};

export default WorkerFormDetail;
