/**
 * Error handler utility for extracting user-friendly error messages
 */

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      validationErrors?: Record<string, string> | string[];
    };
  };
  message?: string;
}

/**
 * Extracts a user-friendly error message from various error types.
 * Handles API message, validationErrors, and generic Error instances.
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred. Please try again.'
): string => {
  if (!error) return defaultMessage;

  if (typeof error === 'object') {
    const apiError = error as ApiErrorResponse;

    if (
      apiError.response &&
      typeof apiError.response === 'object' &&
      apiError.response.data &&
      typeof apiError.response.data === 'object'
    ) {
      const { message, validationErrors } = apiError.response.data;
      const baseMessage = message || defaultMessage;

      if (validationErrors) {
        let errors: string[] = [];

        if (Array.isArray(validationErrors)) {
          errors = validationErrors.filter(Boolean);
        } else if (typeof validationErrors === 'object') {
          errors = Object.values(validationErrors).filter(Boolean) as string[];
        }

        if (errors.length > 0) {
          // Deduplicate errors that are the same as the base message
          const unique = errors.filter((e) => e !== baseMessage);
          return unique.length > 0 ? `${baseMessage}\n${unique.join('\n')}` : baseMessage;
        }
      }

      if (typeof message === 'string') return message;
    }

    if ('message' in apiError && typeof apiError.message === 'string') {
      return apiError.message;
    }

    if (error instanceof Error) {
      return error.message;
    }
  }

  if (typeof error === 'string') return error;

  return defaultMessage;
};
