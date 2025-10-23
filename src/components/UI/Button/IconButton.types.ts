import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type IconButtonVariant = 'contained' | 'outlined' | 'text';
export type IconButtonColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
export type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonProps {
  /**
   * Icon to display
   */
  children: ReactNode;

  /**
   * Button variant style
   * @default 'contained'
   */
  variant?: IconButtonVariant;

  /**
   * Button color
   * @default 'primary'
   */
  color?: IconButtonColor;

  /**
   * Button size
   * @default 'medium'
   */
  size?: IconButtonSize;

  /**
   * If true, the button will be disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows loading spinner
   * @default false
   */
  loading?: boolean;

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

  /**
   * Aria label for accessibility
   */
  'aria-label'?: string;
}
