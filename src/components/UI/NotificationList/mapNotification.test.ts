import { describe, it, expect } from 'vitest';
import { mapNotificationToItem } from './mapNotification';
import type { NotificationResponse } from '../../../../workflow-api';

describe('mapNotificationToItem', () => {
  it('maps a full NotificationResponse to an INotification', () => {
    const notification: NotificationResponse = {
      id: 42,
      type: 'VISIT_LOG_ADDED',
      title: 'Visit log added',
      message: 'A worker added a visit log',
      targetUrl: '/company/jobs/1/details',
      priority: 'MEDIUM',
      read: false,
      createdAt: '2026-08-24T10:00:00.000Z',
    };

    expect(mapNotificationToItem(notification)).toEqual({
      id: '42',
      title: 'Visit log added',
      subtitle: 'A worker added a visit log',
      isRead: false,
      timestamp: new Date('2026-08-24T10:00:00.000Z'),
      type: 'VISIT_LOG_ADDED',
      priority: 'MEDIUM',
    });
  });

  it('defaults missing fields safely', () => {
    const notification: NotificationResponse = {};

    expect(mapNotificationToItem(notification)).toEqual({
      id: '',
      title: '',
      subtitle: undefined,
      isRead: false,
      timestamp: undefined,
      type: undefined,
      priority: undefined,
    });
  });
});
