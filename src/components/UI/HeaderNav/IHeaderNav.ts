import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import type { ITabItem } from '../Tab/ITab';

export interface IUserProfile {
  name: string;
  subscriptionName?: string;
  avatar?: string;
}

export interface IHeaderNav {
  /**
   * Array of navigation tabs
   */
  tabs: ITabItem[];

  /**
   * Currently active tab id
   */
  activeTab: string;

  /**
   * Callback when tab changes
   */
  onTabChange: (tabId: string) => void;

  /**
   * User profile information
   */
  user: IUserProfile;

  /**
   * Show logo (uses FloowLogo by default)
   * @default true
   */
  showLogo?: boolean;

  /**
   * Custom logo component (optional, defaults to FloowLogo)
   */
  customLogo?: ReactNode;

  /**
   * Show notification badge
   */
  hasNotifications?: boolean;

  /**
   * Notification count
   */
  notificationCount?: number;

  /**
   * Callback when notification icon is clicked
   */
  onNotificationClick?: () => void;

  /**
   * Callback when search icon is clicked
   */
  onSearchClick?: () => void;

  /**
   * Callback when settings icon is clicked
   */
  onSettingsClick?: () => void;

  /**
   * Callback when user profile is clicked
   */
  onProfileClick?: () => void;

  /**
   * Callback when logout icon is clicked
   */
  onLogoutClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}
