import { describe, it, expect } from 'vitest';
import {
  notificationReducer,
  initialNotificationState,
  sumUnreadCount,
  type NotificationState,
} from './notificationReducer';
import type { NotificationResponse } from '../../workflow-api';

const makeNotification = (overrides: Partial<NotificationResponse> = {}): NotificationResponse => ({
  id: 1,
  type: 'VISIT_LOG_ADDED',
  title: 'Visit log added',
  message: 'A visit log was added',
  read: false,
  createdAt: '2026-08-24T10:00:00Z',
  ...overrides,
});

describe('sumUnreadCount', () => {
  it('sums all values in the count map', () => {
    expect(sumUnreadCount({ FORCE_LOGOUT: 1, VISIT_LOG_ADDED: 4 })).toBe(5);
  });

  it('returns 0 for an empty map', () => {
    expect(sumUnreadCount({})).toBe(0);
  });

  it('ignores non-finite values', () => {
    expect(sumUnreadCount({ a: 2, b: NaN })).toBe(2);
  });
});

describe('notificationReducer', () => {
  it('SET_INITIAL replaces state wholesale', () => {
    const recent = [makeNotification()];
    const state = notificationReducer(initialNotificationState, {
      type: 'SET_INITIAL',
      unreadCount: 3,
      recent,
    });
    expect(state).toEqual({ unreadCount: 3, recent });
  });

  it('PUSHED prepends a new unread notification and increments the count', () => {
    const state: NotificationState = { unreadCount: 2, recent: [makeNotification({ id: 1 })] };
    const pushed = makeNotification({ id: 2, title: 'New one' });

    const next = notificationReducer(state, { type: 'PUSHED', notification: pushed });

    expect(next.unreadCount).toBe(3);
    expect(next.recent[0]).toEqual(pushed);
    expect(next.recent).toHaveLength(2);
  });

  it('PUSHED does not increment the count for an already-read notification', () => {
    const state: NotificationState = { unreadCount: 2, recent: [] };
    const pushed = makeNotification({ id: 2, read: true });

    const next = notificationReducer(state, { type: 'PUSHED', notification: pushed });

    expect(next.unreadCount).toBe(2);
  });

  it('PUSHED dedupes by id instead of double-adding', () => {
    const existing = makeNotification({ id: 1 });
    const state: NotificationState = { unreadCount: 1, recent: [existing] };

    const next = notificationReducer(state, { type: 'PUSHED', notification: existing });

    expect(next).toEqual(state);
  });

  it('PUSHED caps recent at 20 items', () => {
    const recent = Array.from({ length: 20 }, (_, i) => makeNotification({ id: i + 1 }));
    const state: NotificationState = { unreadCount: 20, recent };
    const pushed = makeNotification({ id: 999 });

    const next = notificationReducer(state, { type: 'PUSHED', notification: pushed });

    expect(next.recent).toHaveLength(20);
    expect(next.recent[0]).toEqual(pushed);
    expect(next.recent.find((n) => n.id === 1)).toBeUndefined();
  });

  it('MARK_READ marks the matching item read and decrements the count once', () => {
    const state: NotificationState = {
      unreadCount: 2,
      recent: [makeNotification({ id: 1, read: false }), makeNotification({ id: 2, read: false })],
    };

    const next = notificationReducer(state, { type: 'MARK_READ', id: 1 });

    expect(next.unreadCount).toBe(1);
    expect(next.recent.find((n) => n.id === 1)?.read).toBe(true);
    expect(next.recent.find((n) => n.id === 2)?.read).toBe(false);
  });

  it('MARK_READ is a no-op for an already-read item', () => {
    const state: NotificationState = { unreadCount: 0, recent: [makeNotification({ id: 1, read: true })] };

    const next = notificationReducer(state, { type: 'MARK_READ', id: 1 });

    expect(next.unreadCount).toBe(0);
  });

  it('MARK_READ never drops the count below 0', () => {
    const state: NotificationState = { unreadCount: 0, recent: [makeNotification({ id: 1, read: false })] };

    const next = notificationReducer(state, { type: 'MARK_READ', id: 1 });

    expect(next.unreadCount).toBe(0);
  });

  it('MARK_ALL_READ zeroes the count and marks every item read', () => {
    const state: NotificationState = {
      unreadCount: 2,
      recent: [makeNotification({ id: 1, read: false }), makeNotification({ id: 2, read: false })],
    };

    const next = notificationReducer(state, { type: 'MARK_ALL_READ' });

    expect(next.unreadCount).toBe(0);
    expect(next.recent.every((n) => n.read)).toBe(true);
  });

  it('RECONCILE_UNREAD_COUNT overwrites only the count', () => {
    const recent = [makeNotification({ id: 1 })];
    const state: NotificationState = { unreadCount: 5, recent };

    const next = notificationReducer(state, { type: 'RECONCILE_UNREAD_COUNT', unreadCount: 1 });

    expect(next).toEqual({ unreadCount: 1, recent });
  });

  it('RESTORE replaces state wholesale (rollback of an optimistic update)', () => {
    const previous: NotificationState = { unreadCount: 3, recent: [makeNotification({ id: 1, read: false })] };
    const state: NotificationState = { unreadCount: 2, recent: [makeNotification({ id: 1, read: true })] };

    const next = notificationReducer(state, { type: 'RESTORE', state: previous });

    expect(next).toEqual(previous);
  });
});
