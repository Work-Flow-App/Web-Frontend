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
  onNotificationClick?: (notification: INotification) => void;

  /**
   * Callback when mail button is clicked
   */
  onMailClick?: (notificationId: string) => void;

  /**
   * Callback when view button is clicked
   */
  onViewClick?: (notification: INotification) => void;

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
  onMailClick?: (notificationId: string) => void;
  onViewClick?: (notification: INotification) => void;
}
