import type { SxProps } from '@mui/material';
import type { FieldError } from 'react-hook-form';

export interface ITextAreaStyles {
  input: SxProps;
  control?: SxProps;
  label?: SxProps;
  error?: SxProps;
}

export interface TextAreaProps {
  withRequiredBorder?: boolean;
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  styles?: ITextAreaStyles;
  label?: string;
  defaultValue?: any;
  value?: any;
  id?: string;
  className?: string;
  placeHolder?: string;
  placeholder?: string;
  error?: FieldError;
  dependency?: string;
  isDisabled?: boolean;
  dependentFields?: string[];
  hideErrorMessage?: boolean;
  shouldValidateOnChange?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>, dependentFields?: string[]) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLTextAreaElement>, dependentFields?: any[]) => void;
  onValueChange?: (value: any, dependentFields?: any[]) => void;
  disableResetFieldWhenDependencyValueIsCleared?: boolean;
  fullWidth?: boolean;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}
