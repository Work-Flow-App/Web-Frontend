import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { env } from '../config/env';
import { apiClient } from './api/client';
import type { NotificationResponse } from '../../workflow-api';

export interface NotificationSocketOptions {
  onMessage: (notification: NotificationResponse) => void;
  onError?: (error: unknown) => void;
}

const RECONNECT_DELAY_MS = 5000;
const NOTIFICATIONS_DESTINATION = '/user/queue/notifications';

export function buildConnectHeaders(): Record<string, string> {
  const token = apiClient.getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createNotificationSocket(options: NotificationSocketOptions): Client {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${env.apiBaseUrl}/ws-notifications`),
    reconnectDelay: RECONNECT_DELAY_MS,
    beforeConnect: () => {
      client.connectHeaders = buildConnectHeaders();
    },
    onConnect: () => {
      client.subscribe(NOTIFICATIONS_DESTINATION, (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body) as NotificationResponse;
          options.onMessage(notification);
        } catch (error) {
          options.onError?.(error);
        }
      });
    },
    onStompError: (frame) => {
      options.onError?.(frame);
    },
    onWebSocketError: (event) => {
      options.onError?.(event);
    },
  });

  return client;
}
