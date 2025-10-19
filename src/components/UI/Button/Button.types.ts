import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Icon to display before the button text
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after the button text
   */
  endIcon?: ReactNode;

  /**
   * If true, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * If true, the button will be disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles using MUI sx prop
   */
  sx?: SxProps<Theme>;
}
