import { describe, it, expect, vi, beforeEach } from 'vitest';

const notificationGetNotifications = vi.fn();
const notificationGetUnreadCount = vi.fn();
const notificationMarkAsRead = vi.fn();
const notificationMarkAllAsRead = vi.fn();

vi.mock('../../../workflow-api', () => ({
  Configuration: vi.fn(),
  NotificationsApi: vi.fn().mockImplementation(() => ({
    notificationGetNotifications,
    notificationGetUnreadCount,
    notificationMarkAsRead,
    notificationMarkAllAsRead,
  })),
}));

vi.mock('./axiosConfig', () => ({ axiosInstance: {} }));
vi.mock('../../config/env', () => ({ env: { apiBaseUrl: 'https://api.test' } }));

import { notificationService } from './notification';

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list() forwards unreadOnly/cursor/size and returns the response', async () => {
    const response = { data: { data: [], nextCursor: undefined, hasNext: false } };
    notificationGetNotifications.mockResolvedValue(response);

    const result = await notificationService.list({ unreadOnly: true, cursor: 5, size: 10 });

    expect(notificationGetNotifications).toHaveBeenCalledWith(true, 5, 10);
    expect(result).toBe(response);
  });

  it('list() with no params forwards all as undefined', async () => {
    notificationGetNotifications.mockResolvedValue({ data: { data: [] } });

    await notificationService.list();

    expect(notificationGetNotifications).toHaveBeenCalledWith(undefined, undefined, undefined);
  });

  it('getUnreadCount() calls through and returns the response', async () => {
    const response = { data: { total: 3 } };
    notificationGetUnreadCount.mockResolvedValue(response);

    const result = await notificationService.getUnreadCount();

    expect(notificationGetUnreadCount).toHaveBeenCalledWith();
    expect(result).toBe(response);
  });

  it('markAsRead(id) forwards the id', async () => {
    notificationMarkAsRead.mockResolvedValue({ data: undefined });

    await notificationService.markAsRead(42);

    expect(notificationMarkAsRead).toHaveBeenCalledWith(42);
  });

  it('markAllAsRead() calls through with no args', async () => {
    notificationMarkAllAsRead.mockResolvedValue({ data: undefined });

    await notificationService.markAllAsRead();

    expect(notificationMarkAllAsRead).toHaveBeenCalledWith();
  });
});
