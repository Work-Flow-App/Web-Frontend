import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

/**
 * Props for the TopNav component
 */
export interface TopNavProps {
  /**
   * Search input content (displayed before rightContent)
   */
  searchContent?: ReactNode;

  /**
   * Right-side content/actions (notification, user profile, settings, etc.)
   */
  rightContent?: ReactNode;

  /**
   * Whether the sidebar is currently collapsed
   */
  isCollapsed?: boolean;

  /**
   * Callback to toggle sidebar (mobile only)
   */
  onToggleSidebar?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}
