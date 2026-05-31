import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { InputAdornment } from '@mui/material';
import { StepFormSchema } from '../../schema/StepFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input, TextArea, Checkbox } from '../../../../components/UI/Forms';
import { FormField } from '../../../../components/UI/FormComponents';
import * as S from './StepForm.styles';

export const StepFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(StepFormSchema);
  const { control } = useFormContext();
  const enableTimer = useWatch({ control, name: fieldTitles.enableTimer });

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.description} required={isRequireds.description}>
        <TextArea
          name={fieldTitles.description}
          placeholder={placeHolders.description}
          hideErrorMessage={false}
          rows={3}
        />
      </FormField>

      <Checkbox
        name={fieldTitles.optional}
        label={fieldLabels.optional}
        description="This step can be skipped during workflow execution"
        hideErrorMessage={false}
      />

      <S.SectionDivider />

      <S.SectionHeader>
        <S.SectionIcon>
          <TimerIcon />
        </S.SectionIcon>
        <S.SectionLabel variant="caption">SLA Timer</S.SectionLabel>
      </S.SectionHeader>

      <Checkbox
        name={fieldTitles.enableTimer}
        label={fieldLabels.enableTimer}
        description="Track how long this step takes and get alerts when deadlines are missed"
        hideErrorMessage={false}
      />

      {enableTimer && (
        <S.TimerFieldsContainer>
          <S.TimerGrid>
            {/* Expected Duration */}
            <S.TimerFieldBlock>
              <S.TimerFieldLabel>
                <S.TimerFieldLabelIcon>
                  <AccessTimeIcon />
                </S.TimerFieldLabelIcon>
                {fieldLabels.expectedDurationDays}
              </S.TimerFieldLabel>
              <S.DurationInputRow>
                <Input
                  name={fieldTitles.expectedDurationDays}
                  placeholder={placeHolders.expectedDurationDays}
                  hideErrorMessage={false}
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <S.DurationUnit>days</S.DurationUnit>
                    </InputAdornment>
                  }
                />
                <Input
                  name={fieldTitles.expectedDurationHours}
                  placeholder={placeHolders.expectedDurationHours}
                  hideErrorMessage={false}
                  type="number"
                  inputProps={{ min: 0, max: 23, step: 1 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <S.DurationUnit>hrs</S.DurationUnit>
                    </InputAdornment>
                  }
                />
              </S.DurationInputRow>
              <S.FieldHint hintVariant="warning">
                <WarningAmberIcon />
                Step turns orange after this period
              </S.FieldHint>
            </S.TimerFieldBlock>

            {/* Maximum Deadline */}
            <S.TimerFieldBlock>
              <S.TimerFieldLabel>
                <S.TimerFieldLabelIcon>
                  <ScheduleIcon />
                </S.TimerFieldLabelIcon>
                {fieldLabels.maximumDurationDays}
              </S.TimerFieldLabel>
              <S.DurationInputRow>
                <Input
                  name={fieldTitles.maximumDurationDays}
                  placeholder={placeHolders.maximumDurationDays}
                  hideErrorMessage={false}
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <S.DurationUnit>days</S.DurationUnit>
                    </InputAdornment>
                  }
                />
                <Input
                  name={fieldTitles.maximumDurationHours}
                  placeholder={placeHolders.maximumDurationHours}
                  hideErrorMessage={false}
                  type="number"
                  inputProps={{ min: 0, max: 23, step: 1 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <S.DurationUnit>hrs</S.DurationUnit>
                    </InputAdornment>
                  }
                />
              </S.DurationInputRow>
              <S.FieldHint hintVariant="error">
                <ErrorOutlineIcon />
                SLA breach alert after this period
              </S.FieldHint>
            </S.TimerFieldBlock>
          </S.TimerGrid>
        </S.TimerFieldsContainer>
      )}
    </>
  );
};
