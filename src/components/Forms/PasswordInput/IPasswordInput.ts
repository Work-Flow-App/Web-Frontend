import type { InputProps } from '../Input/Input.types';

export interface IPasswordInput extends Omit<InputProps, 'type' | 'endAdornment'> {
  /**
   * Show password toggle button
   * @default true
   */
  showToggle?: boolean;
}
