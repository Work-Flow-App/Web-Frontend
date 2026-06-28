import type { ReactNode } from 'react';
import type { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SetupFormWrapperProps<TFormData extends FieldValues = any> {
  /**
   * Form fields to render inside the wrapper
   */
  children: ReactNode;

  /**
   * Validation schema (Yup schema)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;

  /**
   * Default values for the form
   */
  defaultValues?: DefaultValues<TFormData>;

  /**
   * Submit handler - should return a promise
   * Can return void or { success: boolean, message?: string }
   */
  onSubmit: (data: TFormData) => Promise<void | { success?: boolean; message?: string }>;

  /**
   * Success callback - called after successful submission
   */
  onSuccess?: (data: TFormData) => void;

  /**
   * Error callback - called on submission error
   */
  onError?: (error: unknown) => void;

  /**
   * Success message to show in snackbar
   * If not provided, no success snackbar will be shown
   */
  successMessage?: string;

  /**
   * Error message to show in snackbar
   * Default: "An error occurred. Please try again."
   */
  errorMessage?: string;

  /**
   * Whether to show loading state on submit button
   * Default: true
   */
  showLoadingState?: boolean;

  /**
   * Whether to reset form after successful submission
   * Default: true
   */
  resetOnSuccess?: boolean;

  // ===== Modal-specific props (only used when inside GlobalModal) =====

  /**
   * Modal title (only used when isModal is true)
   */
  title?: string;

  /**
   * Confirm button text (only used when isModal is true)
   * Default: "Submit"
   */
  confirmButtonText?: string;

  /**
   * Cancel button text (only used when isModal is true)
   * Default: "Cancel"
   */
  cancelButtonText?: string;

  /**
   * Whether to show only confirm button (only used when isModal is true)
   * Default: false
   */
  confirmButtonOnly?: boolean;

  /**
   * Whether to close modal after successful submission (only used when isModal is true)
   * Default: true
   */
  closeModalOnSuccess?: boolean;

  /**
   * Whether this form is inside a modal
   * Default: auto-detected based on GlobalModalInnerContext availability
   */
  isModal?: boolean;

  // ===== Standalone form props (only used when NOT inside modal) =====

  /**
   * Submit button text (only used when isModal is false)
   * Default: "Submit"
   */
  submitButtonText?: string;

  /**
   * Whether to show submit button (only used when isModal is false)
   * Default: true
   */
  showSubmitButton?: boolean;

  /**
   * Custom submit button component (only used when isModal is false)
   */
  customSubmitButton?: ReactNode;

  /**
   * External form methods (if you want to control the form from outside)
   * If provided, SetupFormWrapper will not create its own form instance
   */
  formMethods?: UseFormReturn<TFormData>;
}

export interface FormState {
  isSubmitting: boolean;
  error: string | null;
}
