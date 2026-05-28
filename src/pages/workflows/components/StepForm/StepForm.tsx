import React, { useCallback, useEffect, useState } from 'react';
import { StepFormSchema, type StepFormData } from '../../schema/StepFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { StepFormFields } from './StepFormFields';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

const MINUTES_PER_DAY = 24 * 60;

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
      setStepData({
        name: initialStep.name || '',
        description: initialStep.description || '',
        optional: initialStep.optional || false,
        enableTimer: hasTimer,
        expectedDurationDays: initialStep.expectedDurationMinutes
          ? initialStep.expectedDurationMinutes / MINUTES_PER_DAY
          : undefined,
        maximumDurationDays: initialStep.maximumDurationMinutes
          ? initialStep.maximumDurationMinutes / MINUTES_PER_DAY
          : undefined,
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
        expectedDurationMinutes: data.enableTimer && data.expectedDurationDays
          ? Math.round(data.expectedDurationDays * MINUTES_PER_DAY)
          : undefined,
        maximumDurationMinutes: data.enableTimer && data.maximumDurationDays
          ? Math.round(data.maximumDurationDays * MINUTES_PER_DAY)
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
