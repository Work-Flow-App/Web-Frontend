import { useState, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useSchema } from '../../../utils/validation';
import { Button } from '../Button';
import type { SetupFormWrapperProps, FormState } from './SetupFormWrapper.types';
import * as S from './SetupFormWrapper.styled';

// Modal Form Component (used when inside GlobalModal)
import { ModalFormContent } from './ModalFormContent';

// Standalone Form Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StandaloneFormContent = <TFormData extends Record<string, any>>(props: {
  children: React.ReactNode;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  customSubmitButton?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any;
  handleFormSubmit: (data: TFormData) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const { children, submitButtonText = 'Submit', showSubmitButton = true, customSubmitButton, methods, handleFormSubmit, isSubmitting } = props;
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <S.StandaloneForm onSubmit={handleSubmit(handleFormSubmit)}>
        <S.FormWrapper>{children}</S.FormWrapper>

        {showSubmitButton && (
          <S.SubmitButtonWrapper>
            {customSubmitButton || (
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>
                {isSubmitting ? 'Submitting...' : submitButtonText}
              </Button>
            )}
          </S.SubmitButtonWrapper>
        )}
      </S.StandaloneForm>
    </FormProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SetupFormWrapper = <TFormData extends Record<string, any>>(
  props: SetupFormWrapperProps<TFormData>
) => {
  const {
    children,
    schema,
    defaultValues,
    onSubmit,
    onSuccess,
    onError,
    successMessage,
    errorMessage = 'An error occurred. Please try again.',
    showLoadingState = true,
    resetOnSuccess = true,
    isModal: isModalProp,
    formMethods: externalFormMethods,
  } = props;

  const { showSuccess, showError } = useSnackbar();
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
  });

  // Get schema utilities
  const { fieldRules, defaultValues: schemaDefaults } = useSchema(schema);

  // Merge default values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergedDefaultValues = { ...schemaDefaults, ...defaultValues } as any;

  // Create or use external form methods
  const internalMethods = useForm<TFormData>({
    // @ts-expect-error - Yup resolver type compatibility
    resolver: yupResolver(fieldRules),
    defaultValues: mergedDefaultValues,
    mode: 'onChange',
  });

  const methods = externalFormMethods || internalMethods;

  const {
    formState: { isSubmitting: formIsSubmitting },
    reset,
  } = methods;

  // Reset form when defaultValues change (e.g., when editing existing data)
  useEffect(() => {
    if (defaultValues) {
      reset({ ...schemaDefaults, ...defaultValues });
    }
  }, [defaultValues, reset, schemaDefaults]);

  // Combine loading states
  const isSubmitting = showLoadingState && (formState.isSubmitting || formIsSubmitting);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: TFormData) => {
      setFormState({ isSubmitting: true, error: null });

      try {
        const result = await onSubmit(data);

        // Check if submission was successful
        const isSuccess = !result || result.success !== false;

        if (isSuccess) {
          // Show success message
          if (successMessage) {
            showSuccess(result?.message || successMessage);
          }

          // Reset form if needed
          if (resetOnSuccess) {
            reset();
          }

          // Call success callback
          onSuccess?.(data);
        } else {
          // Submission returned failure
          const message = result?.message || errorMessage;
          showError(message);
          onError?.(new Error(message));
        }
      } catch (error: unknown) {
        console.error('Form submission error:', error);
        const message = extractErrorMessage(error, errorMessage);
        showError(message);
        onError?.(error);
      } finally {
        setFormState({ isSubmitting: false, error: null });
      }
    },
    [onSubmit, successMessage, showSuccess, resetOnSuccess, reset, onSuccess, errorMessage, showError, onError]
  );

  // Determine if we should render as modal or standalone
  // If isModalProp is explicitly set, use that. Otherwise, default to modal mode
  const shouldRenderAsModal = isModalProp ?? true;

  if (shouldRenderAsModal) {
    // Try to render as modal form
    return (
      <ModalFormContent
        {...props}
        methods={methods}
        handleFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Render as standalone form
  return (
    <StandaloneFormContent
      children={children}
      submitButtonText={props.submitButtonText}
      showSubmitButton={props.showSubmitButton}
      customSubmitButton={props.customSubmitButton}
      methods={methods}
      handleFormSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
    />
  );
};
