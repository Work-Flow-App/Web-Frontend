import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface INotification {
  id: string;
  title: string;
  subtitle?: string;
  jobId?: string;
  user?: string;
  avatar?: string;
  icon?: ReactNode;
  isRead?: boolean;
  timestamp?: Date;
  /** Raw notification type from the API, e.g. 'VISIT_LOG_ADDED' — used to derive the group/category. */
  type?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | string;
}

export interface NotificationFilterOption {
  id: string;
  label: string;
  /** Optional count badge, e.g. unread count for this group. */
  count?: number;
}

export interface INotificationList {
  /**
   * Array of notifications
   */
  notifications: INotification[];

  /**
   * Title of the notification list
   * @default 'Notifications'
   */
  title?: string;

  /**
   * Visual density/sizing — 'dropdown' is the compact popover used from the bell icon,
   * 'page' fills its container width for the standalone Notifications page.
   * @default 'dropdown'
   */
  variant?: 'dropdown' | 'page';

  /**
   * Show "Mark all as read" action in the header
   * @default true
   */
  showMarkAllRead?: boolean;

  /**
   * Callback when "Mark all as read" is clicked
   */
  onMarkAllRead?: () => void;

  /**
   * Optional group/category filter chips rendered under the header, e.g. All / Jobs / Billing.
   * Omit to hide the filter bar entirely (used for the compact dropdown).
   */
  filters?: NotificationFilterOption[];

  /**
   * Currently selected filter id (should match one of `filters[].id`, or 'all').
   */
  activeFilterId?: string;

  /**
   * Callback when a filter chip is selected
   */
  onFilterChange?: (id: string) => void;

  /**
   * Callback when a notification is clicked
   */
  onNotificationClick?: (notification: INotification) => void;

  /**
   * Callback when the explicit "mark as read" affordance on a row is clicked
   */
  onMarkAsRead?: (notificationId: string) => void;

  /**
   * Callback when a notification row is activated (click or Enter/Space)
   */
  onViewClick?: (notification: INotification) => void;

  /**
   * Shown while the first page is loading
   */
  loading?: boolean;

  /**
   * Optional content rendered below the list, e.g. a "View all notifications" link in the dropdown
   */
  footer?: ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}

export interface INotificationItem {
  notification: INotification;
  onMarkAsRead?: (notificationId: string) => void;
  onViewClick?: (notification: INotification) => void;
}
