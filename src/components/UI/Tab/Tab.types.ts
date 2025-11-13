import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

export type TabVariant = 'default' | 'active';

export type TabSize = 'small' | 'medium' | 'large';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabProps {
  /**
   * Tab label text
   */
  label: string;

  /**
   * Tab icon (optional)
   */
  icon?: ReactNode;

  /**
   * Whether the tab is active
   */
  active?: boolean;

  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;

  /**
   * Size of the tab
   * @default 'medium'
   */
  size?: TabSize;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}

export interface TabMenuProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];

  /**
   * Currently active tab id
   */
  activeTab: string;

  /**
   * Callback when tab changes
   */
  onChange: (tabId: string) => void;

  /**
   * Size of all tabs
   * @default 'medium'
   */
  size?: TabSize;

  /**
   * Custom className for the menu container
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}
