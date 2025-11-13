import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

/**
 * Props for the TopNav component
 */
export interface TopNavProps {
  /**
   * Right-side content/actions (notification, user profile, settings, etc.)
   */
  rightContent?: ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}
