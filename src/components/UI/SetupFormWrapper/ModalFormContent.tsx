import { useEffect } from 'react';
import { FormProvider, type FieldValues } from 'react-hook-form';
import { useGlobalModalInnerContext, useGlobalModalOuterContext } from '../GlobalModal/context';
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
    title,
    confirmButtonText = 'Submit',
    cancelButtonText = 'Cancel',
    confirmButtonOnly = false,
    closeModalOnSuccess = true,
    methods,
    handleFormSubmit,
  } = props;

  const { handleSubmit, reset } = methods;

  // Get modal contexts
  const modalInnerContext = useGlobalModalInnerContext();
  const modalOuterContext = useGlobalModalOuterContext();

  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnConfirm,
    updateOnClose,
    setSkipResetModal,
  } = modalInnerContext;

  const { resetGlobalModalOuterProps } = modalOuterContext;

  // Setup modal configuration
  useEffect(() => {
    // Set modal title
    if (title) {
      updateModalTitle(title);
    }

    // Configure modal buttons
    updateGlobalModalInnerConfig({
      confirmModalButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonOnly: confirmButtonOnly,
      hideFooter: false,
    });

    // Wire confirm button to form submit
    updateOnConfirm(() => {
      handleSubmit(handleFormSubmit)();
    });

    // Handle close
    updateOnClose(() => {
      reset();
    });

    // Skip auto-reset so we can control it
    setSkipResetModal?.(true);

    // Cleanup function
    return () => {
      // Reset modal when component unmounts if closeModalOnSuccess is true
      if (closeModalOnSuccess) {
        resetGlobalModalOuterProps();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-wire confirm handler when handleFormSubmit changes
  useEffect(() => {
    updateOnConfirm(() => {
      handleSubmit(handleFormSubmit)();
    });
  }, [handleFormSubmit, handleSubmit, updateOnConfirm]);

  return (
    <FormProvider {...methods}>
      <S.FormWrapper>{children}</S.FormWrapper>
    </FormProvider>
  );
};
