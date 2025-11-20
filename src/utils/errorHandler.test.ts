import { describe, it, expect } from 'vitest';
import { extractErrorMessage } from './errorHandler';

describe('extractErrorMessage', () => {
  it('should extract message from API error response', () => {
    const error = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    };
    expect(extractErrorMessage(error)).toBe('Invalid credentials');
  });

  it('should extract message from error object with message property', () => {
    const error = {
      message: 'Network error',
    };
    expect(extractErrorMessage(error)).toBe('Network error');
  });

  it('should extract message from Error instance', () => {
    const error = new Error('Something went wrong');
    expect(extractErrorMessage(error)).toBe('Something went wrong');
  });

  it('should handle string errors', () => {
    const error = 'Simple error message';
    expect(extractErrorMessage(error)).toBe('Simple error message');
  });

  it('should return default message for null or undefined', () => {
    expect(extractErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
    expect(extractErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
  });

  it('should return custom default message', () => {
    const customDefault = 'Custom error message';
    expect(extractErrorMessage(null, customDefault)).toBe(customDefault);
  });

  it('should return default message for unknown error types', () => {
    const error = { unknownProperty: 'value' };
    expect(extractErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });
});
