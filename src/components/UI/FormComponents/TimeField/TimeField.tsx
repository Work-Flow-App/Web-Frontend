import React, { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import type { TimePickerToolbarProps } from '@mui/x-date-pickers/TimePicker';
import { usePickerContext } from '@mui/x-date-pickers/hooks';
import { FormField } from '../FormField';
import { useTimeFormatPreference } from '../../../../hooks/useTimeFormatPreference';
import { parseTime, formatTime } from './TimeField.utils';
import * as S from './TimeField.styles';

interface CustomToolbarExtraProps {
  is24Hour: boolean;
  onToggle24Hour: (is24: boolean) => void;
}

// MUI x-date-pickers v9 moved the toolbar's value/view state off props and onto
// PickerContext — TimePickerToolbarProps no longer carries `value`/`view`/
// `onViewChange`/`onAmPmChange`, so this toolbar reads and drives everything
// through `usePickerContext` instead.
const CustomTimePickerToolbar: React.FC<CustomToolbarExtraProps> = ({ is24Hour, onToggle24Hour }) => {
  const pickerContext = usePickerContext<Dayjs>();
  const currentVal = pickerContext.value && dayjs(pickerContext.value).isValid() ? dayjs(pickerContext.value) : dayjs();
  const view = pickerContext.view;

  const hourStr = is24Hour ? currentVal.format('HH') : currentVal.format('hh');
  const minuteStr = currentVal.format('mm');
  const isPm = currentVal.hour() >= 12;

  const handleAmPmClick = (targetMeridiem: 'am' | 'pm') => {
    const currentHour = currentVal.hour();
    let newHour = currentHour;
    if (targetMeridiem === 'am' && currentHour >= 12) {
      newHour = currentHour - 12;
    } else if (targetMeridiem === 'pm' && currentHour < 12) {
      newHour = currentHour + 12;
    }
    pickerContext.setValue(currentVal.hour(newHour), { changeImportance: 'set' });
  };

  return (
    <S.ToolbarContainer>
      <S.ToolbarTopRow>
        <S.SelectTimeTitle>SELECT TIME</S.SelectTimeTitle>
        <S.FormatToggleGroup>
          <S.FormatToggleButton active={!is24Hour} onClick={() => onToggle24Hour(false)} type="button">
            12H
          </S.FormatToggleButton>
          <S.FormatToggleButton active={is24Hour} onClick={() => onToggle24Hour(true)} type="button">
            24H
          </S.FormatToggleButton>
        </S.FormatToggleGroup>
      </S.ToolbarTopRow>

      <S.ToolbarTimeRow>
        <S.HourMinuteDisplay>
          <S.TimeDigitText selected={view === 'hours'} onClick={() => pickerContext.setView('hours')}>
            {hourStr}
          </S.TimeDigitText>
          <S.TimeSeparatorText>:</S.TimeSeparatorText>
          <S.TimeDigitText selected={view === 'minutes'} onClick={() => pickerContext.setView('minutes')}>
            {minuteStr}
          </S.TimeDigitText>
        </S.HourMinuteDisplay>

        <S.AmPmOr24HWrapper>
          {!is24Hour ? (
            <>
              <S.AmPmButton selected={!isPm} onClick={() => handleAmPmClick('am')} type="button">
                AM
              </S.AmPmButton>
              <S.AmPmButton selected={isPm} onClick={() => handleAmPmClick('pm')} type="button">
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

export interface TimeFieldProps {
  /** react-hook-form field name, e.g. 'timeIn' / 'timeOut' */
  name: string;
  label: string;
}

/**
 * A "HH:mm" time field wired to react-hook-form, with a 12h/24h format toggle
 * built into the picker toolbar. The format choice is shared (live-synced and
 * persisted) via `useTimeFormatPreference`, so it stays consistent across every
 * time field in the app — Start/End Time together, and Worker vs Company views.
 */
export const TimeField: React.FC<TimeFieldProps> = ({ name, label }) => {
  const { field } = useController({ name });
  const currentTime = dayjs();
  const [value, setValue] = useState<Dayjs | null>(parseTime(field.value) || currentTime);
  const [is24Hour, setIs24Hour] = useTimeFormatPreference();

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
            // MUI's slot typing only allows a toolbar accepting exactly
            // TimePickerToolbarProps; ours also takes the format-toggle props
            // supplied via slotProps.toolbar below (cast there too).
            toolbar: CustomTimePickerToolbar as unknown as React.JSXElementConstructor<TimePickerToolbarProps>,
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
              onToggle24Hour: setIs24Hour,
            } as any,
          }}
        />
      </S.TimePickerWrapper>
    </FormField>
  );
};
