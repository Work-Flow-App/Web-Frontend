import { useEffect, useCallback, useRef } from 'react';
import { FormProvider, type FieldValues } from 'react-hook-form';
import { useGlobalModalInnerContext } from '../GlobalModal/context';
import type { SetupFormWrapperProps } from './SetupFormWrapper.types';
import * as S from './SetupFormWrapper.styled';

interface ModalFormContentProps<TFormData extends FieldValues> extends SetupFormWrapperProps<TFormData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any;
  handleFormSubmit: (data: TFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const ModalFormContent = <TFormData extends FieldValues>(
  props: ModalFormContentProps<TFormData>
) => {
  const {
    children,
    methods,
    handleFormSubmit,
  } = props;

  const { handleSubmit, reset, formState } = methods;

  // Get modal context
  const {
    updateOnConfirm,
    updateOnClose,
    setSkipResetModal,
    updateGlobalModalInnerConfig,
  } = useGlobalModalInnerContext();

  // Use ref to store the latest submit handler
  const submitHandlerRef = useRef(handleFormSubmit);

  // Update ref when handler changes
  useEffect(() => {
    submitHandlerRef.current = handleFormSubmit;
  }, [handleFormSubmit]);

  // Create a stable submit function that calls the latest handler
  const stableSubmitHandler = useCallback(() => {
    handleSubmit(submitHandlerRef.current)();
  }, [handleSubmit]);

  // Setup modal handlers only once on mount
  useEffect(() => {
    // Handle close
    updateOnClose(() => {
      reset();
    });

    // Wire confirm button to stable submit handler
    updateOnConfirm(stableSubmitHandler);

    // Skip auto-reset so we can control it
    setSkipResetModal?.(true);

    // No cleanup function - modal reset is handled by the modal buttons
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update modal button disabled state based on form validation
  useEffect(() => {
    updateGlobalModalInnerConfig({
      isConfirmDisabled: !formState.isValid,
    });
  }, [formState.isValid, updateGlobalModalInnerConfig]);

  return (
    <FormProvider {...methods}>
      <S.FormWrapper>{children}</S.FormWrapper>
    </FormProvider>
  );
};
