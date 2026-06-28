import type { SxProps } from '@mui/material';
import type { FieldError } from 'react-hook-form';

export interface IInputStyles {
  input: SxProps;
  control?: SxProps;
  label?: SxProps;
  error?: SxProps;
}

export interface IAdornment {
  disabled?: boolean;
  icon?: string;
}

export interface InputProps {
  withRequiredBorder?: boolean;
  name: string;
  loading?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  styles?: IInputStyles;
  label?: string;
  defaultValue?: any;
  value?: any;
  id?: string;
  type?: string;
  className?: string;
  placeHolder?: string;
  placeholder?: string;
  endAdornment?: any;
  startAdornment?: any;
  startIcon?: string;
  endIcon?: string;
  error?: FieldError;
  dependency?: string;
  disableWithKey?: boolean;
  isDisabled?: boolean;
  isParentOnlyDependency?: boolean;
  dependentFields?: string[];
  dynamicValueCallback?: () => any;
  hideErrorMessage?: boolean;
  dataSource?: string;
  decimalLimit?: number;
  inputProps?: any;
  shouldValidateOnChange?: boolean;
  shouldNotSkipHiddenTypeReset?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, dependentFields?: string[]) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e?: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, dependentFields?: any[]) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  onValueChange?: (value: any, dependentFields?: any[]) => void;
  disableResetFieldWhenDependencyValueIsCleared?: boolean;
  variant?: string[] | ((value: string) => string[]);
  showToolTip?: boolean;
  fullWidth?: boolean;
}
