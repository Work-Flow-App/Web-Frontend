import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, useController } from 'react-hook-form';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { FormField } from '../../../../components/UI/FormComponents';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { workerJobWorkflowService } from '../../../../services/api';
import * as S from '../../../jobs/JobDetailsPage.styles';

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

const parseTime = (value?: string): Dayjs | null => {
  if (!value) return null;
  return dayjs(value, 'HH:mm');
};

const formatTime = (value: Dayjs | null): string => {
  if (!value || !value.isValid()) return '';
  return value.format('HH:mm');
};

const timePickerDialogSx = {
  zIndex: 9000,
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.16)',
  },
  '& .MuiPickersLayout-root': {
    backgroundColor: '#FFFFFF',
  },
  '& .MuiPickersToolbar-root': {
    backgroundColor: '#101a32',
    padding: '20px 24px 16px',
    '& .MuiTypography-overline': {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.7rem',
      letterSpacing: '1.5px',
      fontWeight: 600,
    },
  },
  '& .MuiTimePickerToolbar-hourMinuteLabel': {
    alignItems: 'center',
    '& .MuiPickersToolbarText-root': {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '3rem',
      fontWeight: 300,
      lineHeight: 1,
      padding: '4px 2px',
      borderRadius: '8px',
      minWidth: '64px',
      textAlign: 'center',
      '&.Mui-selected': {
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        fontWeight: 400,
      },
    },
  },
  '& .MuiDialogActions-root': {
    padding: '12px 24px 16px',
    '& .MuiButton-root': {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.5px',
      textTransform: 'none',
      borderRadius: '8px',
      padding: '6px 16px',
    },
    '& .MuiButton-root:first-of-type': {
      color: '#737373',
    },
    '& .MuiButton-root:last-of-type': {
      color: '#101a32',
    },
  },
};

interface TimeFieldProps {
  name: 'timeIn' | 'timeOut';
  label: string;
}

const TimeField: React.FC<TimeFieldProps> = ({ name, label }) => {
  const { field } = useController({ name });
  const currentTime = dayjs();
  const [value, setValue] = useState<Dayjs | null>(parseTime(field.value) || currentTime);

  useEffect(() => {
    if (!field.value) {
      field.onChange(formatTime(currentTime));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    field.onChange(formatTime(newValue));
  };

  return (
    <FormField label={label}>
      <MobileTimePicker
        value={value}
        onChange={handleChange}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
          },
          dialog: {
            sx: timePickerDialogSx,
          },
        }}
      />
    </FormField>
  );
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

      workerJobWorkflowService
        .addVisitLog(stepId, {
          visitDate: values.visitDate,
          timeIn: values.timeIn || undefined,
          timeOut: values.timeOut || undefined,
          description: values.description || undefined,
        })
        .then(() => onSuccess())
        .catch(() => showError('Failed to add work log'));
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
