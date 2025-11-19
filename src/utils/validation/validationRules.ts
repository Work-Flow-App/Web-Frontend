/**
 * Functional validation rules for form fields
 * These can be composed together for complex validation scenarios
 */

export const required = (value: any) => (value ? null : 'Required');

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `Must be ${max} characters or less` : null;

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be at least ${min} characters or more` : null;

export const number = (value: any) => (value && isNaN(Number(value)) ? 'Must be a number' : null);

export const textOnly = (value: string) => (value && !/^[A-Za-z]+$/i.test(value) ? 'Must be text only' : null);

export const minValue = (min: number) => (value: number) =>
  value && value < min ? `Must be at least ${min}` : null;

export const maxValue = (max: number) => (value: number) =>
  value && value > max ? `Must be at most ${max}` : null;

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? 'Invalid email address' : null;

export const username = (value: string) =>
  value && !/^[a-zA-Z0-9_-]{3,20}$/i.test(value) ? 'Username must be 3-20 characters (letters, numbers, - or _)' : null;

export const alphaNumeric = (value: string) =>
  value && !/^[a-zA-Z0-9]+$/i.test(value) ? 'Must contain only letters and numbers' : null;

export const phoneNumber = (value: string) =>
  value && !/^[\d\s()+-]+$/i.test(value) ? 'Invalid phone number' : null;

export const url = (value: string) =>
  value && !/^https?:\/\/.+\..+/i.test(value) ? 'Invalid URL' : null;

export const matchField = (fieldName: string, fieldValue: any) => (value: any) =>
  value !== fieldValue ? `Must match ${fieldName}` : null;

export const strongPassword = (value: string) => {
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
  const isLongEnough = value.length >= 8;

  if (!isLongEnough) return 'Password must be at least 8 characters';
  if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
  if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
  if (!hasNumber) return 'Password must contain at least one number';
  if (!hasSpecialChar) return 'Password must contain at least one special character';

  return null;
};

export const dateFormat = (format: string = 'YYYY-MM-DD') => (value: string) => {
  if (!value) return null;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (format === 'YYYY-MM-DD' && !dateRegex.test(value)) {
    return 'Date must be in YYYY-MM-DD format';
  }

  return null;
};

export const futureDate = (value: string) => {
  if (!value) return null;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today ? 'Date must be in the future' : null;
};

export const pastDate = (value: string) => {
  if (!value) return null;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate > today ? 'Date must be in the past' : null;
};

export const minAge = (age: number) => (value: string) => {
  if (!value) return null;
  const birthDate = new Date(value);
  const today = new Date();
  const userAge = today.getFullYear() - birthDate.getFullYear();

  return userAge < age ? `Must be at least ${age} years old` : null;
};

export const fileSize = (maxSizeMB: number) => (file: File) => {
  if (!file) return null;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  return file.size > maxSizeBytes ? `File size must be less than ${maxSizeMB}MB` : null;
};

export const fileType = (allowedTypes: string[]) => (file: File) => {
  if (!file) return null;

  return !allowedTypes.includes(file.type)
    ? `File type must be one of: ${allowedTypes.join(', ')}`
    : null;
};

export const arrayMinLength = (min: number) => (value: any[]) =>
  value && value.length < min ? `Must have at least ${min} items` : null;

export const arrayMaxLength = (max: number) => (value: any[]) =>
  value && value.length > max ? `Must have at most ${max} items` : null;

/**
 * Compose multiple validators together
 * Returns the first error encountered, or null if all pass
 */
export const composeValidators = (...validators: Array<(value: any) => string | null>) => (value: any) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

/**
 * Validation Rules object for easy importing
 */
export const ValidationRules = {
  required,
  maxLength,
  minLength,
  number,
  textOnly,
  minValue,
  maxValue,
  email,
  username,
  alphaNumeric,
  phoneNumber,
  url,
  matchField,
  strongPassword,
  dateFormat,
  futureDate,
  pastDate,
  minAge,
  fileSize,
  fileType,
  arrayMinLength,
  arrayMaxLength,
  composeValidators,
};
