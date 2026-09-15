import React, { useEffect, useRef, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField, TimeField } from '../../../../../components/UI/FormComponents';
import { Input } from '../../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../../components/UI/Forms/TextArea';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { visitLogService } from '../../../../../services/api';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import type { StepVisitLogResponse } from '../../../../../services/api';
import type { JobWorkflowStepResponse } from '../../../../../services/api';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import * as S from './AddWorkLogModal.styles';

export interface AddWorkLogModalProps {
  stepId?: number | null;
  steps?: JobWorkflowStepResponse[];
  editLog?: StepVisitLogResponse | null;
  onSuccess: () => void;
}

type FormValues = {
  visitDate: string;
  timeIn: string;
  timeOut: string;
  description: string;
  stepId?: { label: string; value: string } | null;
};

export const AddWorkLogModal: React.FC<AddWorkLogModalProps> = ({ stepId, steps, editLog, onSuccess }) => {
  const isEdit = !!editLog;
  const now = dayjs();

  const methods = useForm<FormValues>({
    defaultValues: {
      visitDate: editLog?.visitDate || now.format('YYYY-MM-DD'),
      timeIn: editLog?.timeIn || now.format('HH:mm'),
      timeOut: editLog?.timeOut || now.format('HH:mm'),
      description: editLog?.description || '',
      stepId: null,
    },
  });
  const { showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const formRef = useRef(methods);
  formRef.current = methods;

  const stepOptions = useMemo(() => {
    if (!steps) return [];
    return steps.map((s, idx) => ({
      value: String(s.id),
      label: `${idx + 1}. ${s.name || `Step ${idx + 1}`}`,
    }));
  }, [steps]);

  useEffect(() => {
    updateModalTitle(isEdit ? 'Edit Work Log' : 'Add Work Log');
    updateGlobalModalInnerConfig({ confirmModalButtonText: isEdit ? 'Update' : 'Add' });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal, isEdit]);

  useEffect(() => {
    updateOnConfirm(() => {
      const values = formRef.current.getValues();

      if (!values.visitDate) {
        showError('Visit date is required');
        return;
      }

      const targetStepId = stepId || (values.stepId?.value ? Number(values.stepId.value) : null);
      if (!isEdit && !targetStepId) {
        showError('Step selection is required');
        return;
      }

      if (values.timeIn && values.timeOut && values.timeOut < values.timeIn) {
        showError('End time cannot be before start time.');
        return;
      }

      const payload = {
        visitDate: values.visitDate,
        timeIn: values.timeIn || undefined,
        timeOut: values.timeOut || undefined,
        description: values.description || undefined,
      };

      const request = isEdit
        ? visitLogService.updateVisitLog(editLog!.id!, payload)
        : visitLogService.addVisitLog(targetStepId!, payload);

      request
        .then(() => onSuccess())
        .catch((error) =>
          showError(extractErrorMessage(error, isEdit ? 'Failed to update work log' : 'Failed to add work log'))
        );
    });
  }, [updateOnConfirm, stepId, editLog, isEdit, onSuccess, showError]);

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <S.ModalFormContainer>
          {!stepId && !isEdit && steps && steps.length > 0 && (
            <FormField label="Select Step" required>
              <Dropdown
                name="stepId"
                preFetchedOptions={stepOptions}
                placeHolder="Select Step"
                disablePortal={true}
                fullWidth={true}
                error={methods.formState.errors.stepId as FieldError}
              />
            </FormField>
          )}

          <FormField label="Visit Date" required>
            <Input name="visitDate" type="date" placeHolder="Select date" fullWidth />
          </FormField>

          <S.ModalFormRow>
            <TimeField name="timeIn" label="Start Time" />
            <TimeField name="timeOut" label="End Time" />
          </S.ModalFormRow>

          <FormField label="Description">
            <TextArea name="description" placeHolder="What was done during this visit..." rows={3} fullWidth />
          </FormField>
        </S.ModalFormContainer>
      </LocalizationProvider>
    </FormProvider>
  );
};
