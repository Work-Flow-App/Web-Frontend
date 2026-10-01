import { NotificationsApi, Configuration } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  NotificationResponse,
  CursorPagedResponseNotificationResponse,
} from '../../../workflow-api';
export {
  NotificationResponseTypeEnum,
  NotificationResponsePriorityEnum,
} from '../../../workflow-api';

export interface NotificationListParams {
  unreadOnly?: boolean;
  cursor?: number;
  size?: number;
}

function getNotificationApi(): NotificationsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new NotificationsApi(config, env.apiBaseUrl, axiosInstance);
}

export const notificationService = {
  async list(params: NotificationListParams = {}) {
    return await getNotificationApi().notificationGetNotifications(
      params.unreadOnly,
      params.cursor,
      params.size
    );
  },

  async getUnreadCount() {
    return await getNotificationApi().notificationGetUnreadCount();
  },

  async markAsRead(id: number) {
    return await getNotificationApi().notificationMarkAsRead(id);
  },

  async markAllAsRead() {
    return await getNotificationApi().notificationMarkAllAsRead();
  },
};
