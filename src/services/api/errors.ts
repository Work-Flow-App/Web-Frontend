import { AxiosError } from 'axios';

/**
 * Consistent API response and error types
 */

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  originalError?: Error;
}

/**
 * Transform axios error to consistent ApiError format
 */
export function transformAxiosError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 0;
    const data = error.response?.data as any;

    return {
      message:
        data?.message ||
        error.response?.statusText ||
        error.message ||
        'An error occurred',
      status,
      errors: data?.errors,
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
      originalError: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    status: 0,
  };
}

/**
 * Extract user-friendly error message
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = 'An unexpected error occurred'
): string {
  const apiError = transformAxiosError(error);
  return apiError.message || defaultMessage;
}
