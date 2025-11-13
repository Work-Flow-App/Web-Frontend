import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

export interface Notification {
  id: string;
  title: string;
  subtitle?: string;
  jobId?: string;
  user?: string;
  avatar?: string;
  icon?: ReactNode;
  isRead?: boolean;
  timestamp?: Date;
}

export interface NotificationListProps {
  /**
   * Array of notifications
   */
  notifications: Notification[];

  /**
   * Title of the notification list
   * @default 'Notifications'
   */
  title?: string;

  /**
   * Show clear all button
   * @default true
   */
  showClearAll?: boolean;

  /**
   * Callback when clear all is clicked
   */
  onClearAll?: () => void;

  /**
   * Callback when a notification is clicked
   */
  onNotificationClick?: (notification: Notification) => void;

  /**
   * Callback when mail button is clicked
   */
  onMailClick?: (notificationId: string) => void;

  /**
   * Callback when view button is clicked
   */
  onViewClick?: (notification: Notification) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom sx props for Material-UI styling
   */
  sx?: SxProps<Theme>;
}

export interface NotificationItemProps {
  notification: Notification;
  onMailClick?: (notificationId: string) => void;
  onViewClick?: (notification: Notification) => void;
}
