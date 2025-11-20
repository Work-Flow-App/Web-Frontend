/**
 * Error handler utility for extracting user-friendly error messages
 */

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Extracts a user-friendly error message from various error types
 * @param error - The error object (can be any type)
 * @param defaultMessage - Default message to return if no specific message is found
 * @returns A user-friendly error message string
 */
export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred. Please try again.'
): string => {
  // Handle null or undefined
  if (!error) {
    return defaultMessage;
  }

  // Type guard for object type
  if (typeof error === 'object') {
    const apiError = error as ApiErrorResponse;

    // Check for API error response structure (axios-style)
    if (
      apiError.response &&
      typeof apiError.response === 'object' &&
      apiError.response.data &&
      typeof apiError.response.data === 'object' &&
      typeof apiError.response.data.message === 'string'
    ) {
      return apiError.response.data.message;
    }

    // Check for direct message property
    if ('message' in apiError && typeof apiError.message === 'string') {
      return apiError.message;
    }

    // Check for Error instance
    if (error instanceof Error) {
      return error.message;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Return default message if no specific message found
  return defaultMessage;
};
