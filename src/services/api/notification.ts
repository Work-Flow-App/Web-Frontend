import { NotificationsApi, Configuration } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

import type { NotificationPreferencesUpdateRequest } from '../../../workflow-api';

export type {
  NotificationResponse,
  CursorPagedResponseNotificationResponse,
  NotificationPreferenceResponse,
  NotificationPreferenceUpdateRequest,
  NotificationPreferencesUpdateRequest,
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

  /** One entry per notification type; types the user never changed are all on. */
  async getPreferences() {
    return await getNotificationApi().notificationGetPreferences();
  },

  /** Saves the listed types (fields left out stay as they are) and returns the full list. */
  async updatePreferences(request: NotificationPreferencesUpdateRequest) {
    return await getNotificationApi().notificationUpdatePreferences(request);
  },
};
