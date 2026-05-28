import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TimerIcon from '@mui/icons-material/Timer';
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
          <FormField label={fieldLabels.expectedDurationDays} required={isRequireds.expectedDurationDays}>
            <Input
              name={fieldTitles.expectedDurationDays}
              placeholder={placeHolders.expectedDurationDays}
              hideErrorMessage={false}
              type="number"
              inputProps={{ min: 1, step: 1 }}
            />
            <S.FieldHint variant="caption" hintVariant="warning">
              Step turns orange after this period
            </S.FieldHint>
          </FormField>

          <FormField label={fieldLabels.maximumDurationDays} required={isRequireds.maximumDurationDays}>
            <Input
              name={fieldTitles.maximumDurationDays}
              placeholder={placeHolders.maximumDurationDays}
              hideErrorMessage={false}
              type="number"
              inputProps={{ min: 1, step: 1 }}
            />
            <S.FieldHint variant="caption" hintVariant="error">
              SLA breach alert after this period
            </S.FieldHint>
          </FormField>
        </S.TimerFieldsContainer>
      )}
    </>
  );
};
