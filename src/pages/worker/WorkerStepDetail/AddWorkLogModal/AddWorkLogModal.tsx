import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { FormField, TimeField } from '../../../../components/UI/FormComponents';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { workerJobWorkflowService } from '../../../../services/api';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import * as S from './AddWorkLogModal.styles';

export interface AddWorkLogModalProps {
  stepId: number;
  onSuccess: () => void;
}

type FormValues = {
  visitDate: string;
  timeIn: string;
  timeOut: string;
  description: string;
};

export const AddWorkLogModal: React.FC<AddWorkLogModalProps> = ({ stepId, onSuccess }) => {
  const now = dayjs();
  const methods = useForm<FormValues>({
    defaultValues: {
      visitDate: now.format('YYYY-MM-DD'),
      timeIn: now.format('HH:mm'),
      timeOut: now.format('HH:mm'),
      description: '',
    },
  });
  const { showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const formRef = useRef(methods);
  formRef.current = methods;

  useEffect(() => {
    updateModalTitle('Add Work Log');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Add' });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal]);

  useEffect(() => {
    updateOnConfirm(() => {
      const values = formRef.current.getValues();

      if (!values.visitDate) {
        showError('Visit date is required');
        return;
      }

      if (values.timeIn && values.timeOut && values.timeOut < values.timeIn) {
        showError('End time cannot be before start time.');
        return;
      }

      workerJobWorkflowService
        .addVisitLog(stepId, {
          visitDate: values.visitDate,
          timeIn: values.timeIn || undefined,
          timeOut: values.timeOut || undefined,
          description: values.description || undefined,
        })
        .then(() => onSuccess())
        .catch((error) => showError(extractErrorMessage(error, 'Failed to add work log')));
    });
  }, [updateOnConfirm, stepId, onSuccess, showError]);

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <S.ModalFormContainer>
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
