import type { NotificationResponse } from '../../../../workflow-api';
import type { INotification } from './INotificationList';

export function mapNotificationToItem(notification: NotificationResponse): INotification {
  return {
    id: String(notification.id ?? ''),
    title: notification.title ?? '',
    subtitle: notification.message,
    isRead: notification.read ?? false,
    timestamp: notification.createdAt ? new Date(notification.createdAt) : undefined,
    type: notification.type,
    priority: notification.priority,
  };
}
