import React, { useCallback, useEffect, useState } from 'react';
import { StepFormSchema, type StepFormData } from '../../schema/StepFormSchema';
import { SetupFormWrapper } from '../../../../components/SetupFormWrapper';
import { StepFormFields } from './StepFormFields';
import { useGlobalModalInnerContext } from '../../../../components/GlobalModal/context';

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;

const toFormDuration = (minutes?: number) => {
  if (!minutes) return { days: undefined, hours: undefined };
  const days = Math.floor(minutes / MINUTES_PER_DAY);
  const hours = Math.floor((minutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR);
  return {
    days: days > 0 ? days : undefined,
    hours: hours > 0 ? hours : undefined,
  };
};

const toMinutes = (days?: number, hours?: number): number | undefined => {
  const d = days ?? 0;
  const h = hours ?? 0;
  if (!d && !h) return undefined;
  return (d * HOURS_PER_DAY + h) * MINUTES_PER_HOUR;
};

export interface StepFormStep {
  id: number;
  name: string;
  description?: string;
  optional?: boolean;
  expectedDurationMinutes?: number;
  maximumDurationMinutes?: number;
}

export interface StepFormProps {
  isModal?: boolean;
  initialStep?: StepFormStep | null;
  onSave: (step: StepFormStep) => void;
  isEditing?: boolean;
}

export const StepForm: React.FC<StepFormProps> = ({
  isModal = true,
  initialStep,
  onSave,
  isEditing = false,
}) => {
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [stepData, setStepData] = useState<Partial<StepFormData> | undefined>(undefined);

  useEffect(() => {
    if (isModal) {
      const title = isEditing ? 'Edit Step' : 'Add New Step';
      const buttonText = isEditing ? 'Update Step' : 'Add Step';

      updateModalTitle(title);
      updateGlobalModalInnerConfig({
        confirmModalButtonText: buttonText,
      });
    }
  }, [isModal, isEditing, updateModalTitle, updateGlobalModalInnerConfig]);

  useEffect(() => {
    if (initialStep) {
      const hasTimer = !!(initialStep.expectedDurationMinutes || initialStep.maximumDurationMinutes);
      const expected = toFormDuration(initialStep.expectedDurationMinutes);
      const maximum = toFormDuration(initialStep.maximumDurationMinutes);

      setStepData({
        name: initialStep.name || '',
        description: initialStep.description || '',
        optional: initialStep.optional || false,
        enableTimer: hasTimer,
        expectedDurationDays: expected.days,
        expectedDurationHours: expected.hours,
        maximumDurationDays: maximum.days,
        maximumDurationHours: maximum.hours,
      });
    }
  }, [initialStep]);

  const handleSubmit = useCallback(
    async (data: StepFormData) => {
      const stepPayload: StepFormStep = {
        id: initialStep?.id || Date.now(),
        name: data.name,
        description: data.description || undefined,
        optional: data.optional || false,
        expectedDurationMinutes: data.enableTimer
          ? toMinutes(data.expectedDurationDays, data.expectedDurationHours)
          : undefined,
        maximumDurationMinutes: data.enableTimer
          ? toMinutes(data.maximumDurationDays, data.maximumDurationHours)
          : undefined,
      };

      onSave(stepPayload);
    },
    [initialStep, onSave]
  );

  return (
    <SetupFormWrapper
      schema={StepFormSchema}
      defaultValues={stepData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <StepFormFields />
    </SetupFormWrapper>
  );
};
