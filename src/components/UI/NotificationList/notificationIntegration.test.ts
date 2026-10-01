import { describe, it, expect } from 'vitest';
import {
  NotificationResponseTypeEnum,
  NotificationResponsePriorityEnum,
  type NotificationResponse,
} from '../../../../workflow-api';
import { getNotificationCategory } from './notificationCategories';
import { resolveNotificationTargetUrl } from './notificationTargetUrl';
import { mapNotificationToItem } from './mapNotification';
import {
  notificationReducer,
  initialNotificationState,
  getPushToastVariant,
} from '../../../contexts/notificationReducer';
import { mergePushedNotifications } from '../../../pages/notifications/mergePushedNotifications';
import { buildGroupFilters } from '../../../pages/notifications/buildGroupFilters';

const EXPECTED_CATEGORY: Record<string, string> = {
  FORCE_LOGOUT: 'security',
  VISIT_LOG_ADDED: 'jobs',
  STEP_STATUS_CHANGED: 'jobs',
  STEP_COMPLETED: 'jobs',
  STEP_COMMENT_ADDED: 'jobs',
  STEP_ATTACHMENT_ADDED: 'jobs',
  STEP_COMMENT_UPDATED: 'jobs',
  STEP_ATTACHMENT_UPDATED: 'jobs',
  WORKER_ASSIGNED: 'workforce',
  ASSET_SLA_BREACHED: 'assets',
  STEP_SLA_BREACHED: 'jobs',
  USER_MENTIONED: 'mentions',
  MENTION_SENT: 'mentions',
};

const ALL_TYPES = Object.values(NotificationResponseTypeEnum);

describe('notification type coverage', () => {
  it('has an expected category for every type in the API enum', () => {
    // Fails when the backend adds a type, forcing a conscious decision about its group.
    expect(ALL_TYPES.filter((type) => !(type in EXPECTED_CATEGORY))).toEqual([]);
  });

  it.each(ALL_TYPES)('%s maps to its category, never the General fallback', (type) => {
    const category = getNotificationCategory(type);
    expect(category.id).toBe(EXPECTED_CATEGORY[type]);
    expect(category.id).not.toBe('general');
  });

  it.each(ALL_TYPES)('%s maps every response field onto the list item', (type) => {
    const item = mapNotificationToItem({
      id: 7,
      type,
      title: 'Title',
      message: 'Message',
      priority: NotificationResponsePriorityEnum.High,
      createdAt: '2026-09-26T10:00:00Z',
      read: false,
    });
    expect(item).toMatchObject({
      id: '7',
      type,
      title: 'Title',
      subtitle: 'Message',
      priority: 'HIGH',
      isRead: false,
    });
    expect(item.timestamp?.toISOString()).toBe('2026-09-26T10:00:00.000Z');
  });

  it.each(ALL_TYPES)('%s pushed over the socket is added and counted as unread', (type) => {
    const state = notificationReducer(initialNotificationState, {
      type: 'PUSHED',
      notification: { id: 1, type, read: false },
    });
    expect(state.recent).toHaveLength(1);
    expect(state.unreadCount).toBe(1);
  });
});

describe('resolveNotificationTargetUrl', () => {
  const visits = '/job-workflow-steps/245/visits';

  it('sends workers on a visit-log link to the step page', () => {
    expect(resolveNotificationTargetUrl({ targetUrl: visits }, true)).toEqual({ url: '/worker/steps/245' });
  });

  it('sends company users to the job page when metadata carries a jobId', () => {
    expect(resolveNotificationTargetUrl({ targetUrl: visits, metadata: { jobId: 12 } }, false)).toEqual({
      url: '/company/jobs/12/details',
    });
    expect(resolveNotificationTargetUrl({ targetUrl: visits, metadata: { jobId: '12' } }, false)).toEqual({
      url: '/company/jobs/12/details',
    });
  });

  it('reports a visit-log link as unresolved for company users without a usable jobId', () => {
    expect(resolveNotificationTargetUrl({ targetUrl: visits }, false)).toEqual({ unresolved: true });
    expect(resolveNotificationTargetUrl({ targetUrl: visits, metadata: { jobId: 'abc' } }, false)).toEqual({
      unresolved: true,
    });
  });

  it('passes other target URLs through unchanged', () => {
    expect(resolveNotificationTargetUrl({ targetUrl: '/company/jobs/3/details' }, false)).toEqual({
      url: '/company/jobs/3/details',
    });
  });

  // Real dev-API payloads (notification #7 and #3 on company 6), captured 2026-09-26.
  const realNew = {
    targetUrl: '/company/jobs/58/details',
    metadata: { jobId: 58, action: 'OPEN_VISIT_LOGS', stepId: 245, workerId: 5, visitLogId: 48, jobWorkflowId: 49 },
  };
  const realOld = {
    targetUrl: '/job-workflow-steps/245/visits',
    metadata: { jobId: 58, action: 'OPEN_VISIT_LOGS', stepId: 245, workerId: 5, visitLogId: 47 },
  };

  it('opens real dev-API visit-log payloads on the job page for company users', () => {
    expect(resolveNotificationTargetUrl(realNew, false)).toEqual({ url: '/company/jobs/58/details' });
    expect(resolveNotificationTargetUrl(realOld, false)).toEqual({ url: '/company/jobs/58/details' });
  });

  it('opens real dev-API visit-log payloads on the step page for workers', () => {
    expect(resolveNotificationTargetUrl(realNew, true)).toEqual({ url: '/worker/steps/245' });
    expect(resolveNotificationTargetUrl(realOld, true)).toEqual({ url: '/worker/steps/245' });
  });

  it('falls back to the worker job-workflow page, or unresolved, for company links without a stepId', () => {
    expect(
      resolveNotificationTargetUrl({ targetUrl: '/company/jobs/1/details', metadata: { jobWorkflowId: 49 } }, true)
    ).toEqual({ url: '/worker/job-workflows/49' });
    expect(resolveNotificationTargetUrl({ targetUrl: '/company/jobs/1/details' }, true)).toEqual({ unresolved: true });
  });

  it('returns nothing when there is no target URL', () => {
    expect(resolveNotificationTargetUrl({}, false)).toEqual({});
  });
});

describe('getPushToastVariant', () => {
  it.each([
    ['LOW', 'info'],
    ['MEDIUM', 'info'],
    ['HIGH', 'warning'],
    ['URGENT', 'warning'],
  ] as const)('%s priority shows a %s toast', (priority, variant) => {
    expect(getPushToastVariant({ title: 'Hi', priority, read: false })).toBe(variant);
  });

  it('defaults to info when priority is missing', () => {
    expect(getPushToastVariant({ title: 'Hi' })).toBe('info');
  });

  it('shows nothing for already-read or untitled pushes', () => {
    expect(getPushToastVariant({ title: 'Hi', read: true })).toBeNull();
    expect(getPushToastVariant({ read: false })).toBeNull();
  });
});

describe('mergePushedNotifications', () => {
  const n = (id: number, createdAt: string, read = false): NotificationResponse => ({ id, createdAt, read });
  const loaded = [n(2, '2026-09-26T10:00:00Z'), n(1, '2026-09-26T09:00:00Z')];

  it('prepends pushed notifications newer than the newest loaded one', () => {
    const merged = mergePushedNotifications(loaded, [n(3, '2026-09-26T11:00:00Z'), ...loaded], false);
    expect(merged.map((x) => x.id)).toEqual([3, 2, 1]);
  });

  it('returns the same array when nothing is new, so no re-render happens', () => {
    expect(mergePushedNotifications(loaded, loaded, false)).toBe(loaded);
  });

  it('ignores older items the page simply has not paged to yet', () => {
    expect(mergePushedNotifications(loaded, [n(0, '2026-09-26T08:00:00Z')], false)).toBe(loaded);
  });

  it('skips read items while the page is filtered to unread only', () => {
    const merged = mergePushedNotifications(
      loaded,
      [n(4, '2026-09-26T12:00:00Z', true), n(3, '2026-09-26T11:00:00Z')],
      true
    );
    expect(merged.map((x) => x.id)).toEqual([3, 2, 1]);
  });

  it('fills an empty page from the pushed list', () => {
    expect(mergePushedNotifications([], [n(5, '2026-09-26T12:00:00Z')], false).map((x) => x.id)).toEqual([5]);
  });
});

describe('buildGroupFilters', () => {
  const items: NotificationResponse[] = [
    { id: 1, type: 'VISIT_LOG_ADDED', read: false },
    { id: 2, type: 'USER_MENTIONED', read: true },
  ];

  it('ignores the total-only unread-count shape the backend returns ({ unreadCount })', () => {
    const filters = buildGroupFilters({ unreadCount: 3 }, items);
    expect(filters.map((f) => f.id)).toEqual(['all', 'jobs', 'mentions']);
    expect(filters.find((f) => f.id === 'jobs')?.count).toBe(1);
    expect(filters.find((f) => f.id === 'mentions')?.count).toBe(0);
  });

  it('uses per-type counts when the backend sends them, keeping groups not loaded yet', () => {
    const filters = buildGroupFilters({ VISIT_LOG_ADDED: 4, WORKER_ASSIGNED: 2 }, items);
    expect(filters.find((f) => f.id === 'jobs')?.count).toBe(4);
    expect(filters.find((f) => f.id === 'workforce')?.count).toBe(2);
    expect(filters.find((f) => f.id === 'mentions')?.count).toBe(0);
  });

  it('shows only All when nothing is loaded', () => {
    expect(buildGroupFilters({ unreadCount: 0 }, [])).toEqual([{ id: 'all', label: 'All' }]);
  });
});
