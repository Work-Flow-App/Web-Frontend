import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm, FormProvider, useController } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import type { TimePickerToolbarProps } from '@mui/x-date-pickers/TimePicker';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField } from '../../../../../components/UI/FormComponents';
import { Input } from '../../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../../components/UI/Forms/TextArea';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { visitLogService } from '../../../../../services/api';
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

const parseTime = (value?: string): Dayjs | null => {
  if (!value) return null;
  return dayjs(value, 'HH:mm');
};

const formatTime = (value: Dayjs | null): string => {
  if (!value || !value.isValid()) return '';
  return value.format('HH:mm');
};

interface CustomToolbarExtraProps {
  is24Hour: boolean;
  onToggle24Hour: (is24: boolean) => void;
}

const CustomTimePickerToolbar: React.FC<TimePickerToolbarProps & CustomToolbarExtraProps> = ({
  value: propValue,
  view,
  onViewChange,
  onAmPmChange,
  is24Hour,
  onToggle24Hour,
}) => {
  const pickerContext = usePickerContext<Dayjs>();
  const activeValue = pickerContext?.value || propValue;
  const currentVal = activeValue && dayjs(activeValue).isValid() ? dayjs(activeValue) : dayjs();

  const hourStr = is24Hour
    ? currentVal.format('HH')
    : currentVal.format('hh');
  const minuteStr = currentVal.format('mm');
  const isPm = currentVal.hour() >= 12;

  const handleAmPmClick = (targetMeridiem: 'am' | 'pm') => {
    if (!currentVal) return;
    const currentHour = currentVal.hour();
    let newHour = currentHour;
    if (targetMeridiem === 'am' && currentHour >= 12) {
      newHour = currentHour - 12;
    } else if (targetMeridiem === 'pm' && currentHour < 12) {
      newHour = currentHour + 12;
    }
    const updatedVal = currentVal.hour(newHour);
    if (pickerContext?.setValue) {
      pickerContext.setValue(updatedVal, { changeImportance: 'set', source: 'view' });
    }
    if (onAmPmChange) {
      onAmPmChange(targetMeridiem);
    }
  };

  return (
    <S.ToolbarContainer>
      <S.ToolbarTopRow>
        <S.SelectTimeTitle>SELECT TIME</S.SelectTimeTitle>
        <S.FormatToggleGroup>
          <S.FormatToggleButton
            active={!is24Hour}
            onClick={() => onToggle24Hour(false)}
            type="button"
          >
            12H
          </S.FormatToggleButton>
          <S.FormatToggleButton
            active={is24Hour}
            onClick={() => onToggle24Hour(true)}
            type="button"
          >
            24H
          </S.FormatToggleButton>
        </S.FormatToggleGroup>
      </S.ToolbarTopRow>

      <S.ToolbarTimeRow>
        <S.HourMinuteDisplay>
          <S.TimeDigitText
            selected={view === 'hours'}
            onClick={() => onViewChange('hours')}
          >
            {hourStr}
          </S.TimeDigitText>
          <S.TimeSeparatorText>:</S.TimeSeparatorText>
          <S.TimeDigitText
            selected={view === 'minutes'}
            onClick={() => onViewChange('minutes')}
          >
            {minuteStr}
          </S.TimeDigitText>
        </S.HourMinuteDisplay>

        <S.AmPmOr24HWrapper>
          {!is24Hour ? (
            <>
              <S.AmPmButton
                selected={!isPm}
                onClick={() => handleAmPmClick('am')}
                type="button"
              >
                AM
              </S.AmPmButton>
              <S.AmPmButton
                selected={isPm}
                onClick={() => handleAmPmClick('pm')}
                type="button"
              >
                PM
              </S.AmPmButton>
            </>
          ) : (
            <S.Label24H>24H</S.Label24H>
          )}
        </S.AmPmOr24HWrapper>
      </S.ToolbarTimeRow>
    </S.ToolbarContainer>
  );
};

interface TimeFieldProps {
  name: 'timeIn' | 'timeOut';
  label: string;
  is24Hour: boolean;
  onToggle24Hour: (is24: boolean) => void;
}

const TimeField: React.FC<TimeFieldProps> = ({ name, label, is24Hour, onToggle24Hour }) => {
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
      <S.TimePickerWrapper>
        <MobileTimePicker
          orientation="portrait"
          value={value}
          onChange={handleChange}
          ampm={!is24Hour}
          slots={{
            toolbar: CustomTimePickerToolbar,
          }}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
            dialog: {
              sx: S.timePickerDialogSx,
            },
            layout: {
              sx: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              },
            },
            toolbar: {
              is24Hour,
              onToggle24Hour,
            } as any,
          }}
        />
      </S.TimePickerWrapper>
    </FormField>
  );
};

export const AddWorkLogModal: React.FC<AddWorkLogModalProps> = ({ stepId, steps, editLog, onSuccess }) => {
  const isEdit = !!editLog;
  const now = dayjs();
  const [is24Hour, setIs24Hour] = useState(false);

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
        .catch(() => showError(isEdit ? 'Failed to update work log' : 'Failed to add work log'));
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
            <TimeField
              name="timeIn"
              label="Start Time"
              is24Hour={is24Hour}
              onToggle24Hour={setIs24Hour}
            />
            <TimeField
              name="timeOut"
              label="End Time"
              is24Hour={is24Hour}
              onToggle24Hour={setIs24Hour}
            />
          </S.ModalFormRow>

          <FormField label="Description">
            <TextArea name="description" placeHolder="What was done during this visit..." rows={3} fullWidth />
          </FormField>
        </S.ModalFormContainer>
      </LocalizationProvider>
    </FormProvider>
  );
};
