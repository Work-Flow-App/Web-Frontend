import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { NotificationList, resolveNotificationTargetUrl } from '../../components/UI/NotificationList';
import type { INotification, NotificationFilterOption } from '../../components/UI/NotificationList';
import { mapNotificationToItem } from '../../components/UI/NotificationList/mapNotification';
import { getNotificationCategory } from '../../components/UI/NotificationList/notificationCategories';
import { FilterChip } from '../../components/UI/NotificationList/NotificationList.styles';
import { notificationService } from '../../services/api/notification';
import type { NotificationResponse } from '../../services/api/notification';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { isWorkerRole } from '../../utils/roles';
import { Button } from '../../components/UI/Button';

const PAGE_SIZE = 20;

type ReadFilter = 'all' | 'unread';

const READ_FILTER_OPTIONS: { id: ReadFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread only' },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showInfo } = useSnackbar();
  const { userRole } = useAuth();
  const { markAsRead, markAllAsRead, refresh } = useNotifications();
  const isWorker = isWorkerRole(userRole);

  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countsByType, setCountsByType] = useState<Record<string, number>>({});

  const loadCounts = useCallback(async () => {
    try {
      const { data } = await notificationService.getUnreadCount();
      setCountsByType(data ?? {});
    } catch {
      // best-effort — the group chip counters simply keep their last known values
    }
  }, []);

  const loadFirstPage = useCallback(
    async (unreadOnly: boolean) => {
      setLoading(true);
      try {
        const { data } = await notificationService.list({ unreadOnly, size: PAGE_SIZE });
        setItems(data.data ?? []);
        setCursor(data.nextCursor);
        setHasNext(!!data.hasNext);
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to load notifications'));
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  useEffect(() => {
    loadFirstPage(readFilter === 'unread');
    loadCounts();
  }, [readFilter, loadFirstPage, loadCounts]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await notificationService.list({
        unreadOnly: readFilter === 'unread',
        cursor,
        size: PAGE_SIZE,
      });
      setItems((prev) => [...prev, ...(data.data ?? [])]);
      setCursor(data.nextCursor);
      setHasNext(!!data.hasNext);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load more notifications'));
    } finally {
      setLoading(false);
    }
  }, [cursor, readFilter, showError]);

  const markLocalRead = (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleItemAction = (item: INotification) => {
    const source = items.find((n) => String(n.id) === item.id);
    if (source?.id === undefined) return;
    markAsRead(source.id);
    markLocalRead(source.id);
    refresh();
    loadCounts();

    const { url, unresolved } = resolveNotificationTargetUrl(source, isWorker);
    if (url) {
      navigate(url);
    } else if (unresolved) {
      showInfo("Marked as read — a direct link to this isn't available yet.");
    }
  };

  const handleMarkAsRead = (id: string) => {
    const source = items.find((n) => String(n.id) === id);
    if (source?.id === undefined) return;
    markAsRead(source.id);
    markLocalRead(source.id);
    refresh();
    loadCounts();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    refresh();
    loadCounts();
  };

  // Groups are derived client-side from notification `type`, combining every type
  // seen on the loaded page with every type that currently has unread items
  // (from the per-type unread-count map) so a group doesn't disappear just because
  // its notifications haven't been fetched into view yet.
  const groupFilters: NotificationFilterOption[] = useMemo(() => {
    const totals = new Map<string, { label: string; count: number }>();

    const addType = (type: string | undefined, unread: number) => {
      const category = getNotificationCategory(type);
      const existing = totals.get(category.id);
      if (existing) {
        existing.count += unread;
      } else {
        totals.set(category.id, { label: category.label, count: unread });
      }
    };

    Object.entries(countsByType).forEach(([type, count]) => addType(type, count ?? 0));
    items.forEach((item) => {
      if (!totals.has(getNotificationCategory(item.type).id)) {
        addType(item.type, 0);
      }
    });

    return [
      { id: 'all', label: 'All' },
      ...Array.from(totals.entries())
        .map(([id, { label, count }]) => ({ id, label, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [countsByType, items]);

  const visibleItems = useMemo(
    () => (groupFilter === 'all' ? items : items.filter((item) => getNotificationCategory(item.type).id === groupFilter)),
    [items, groupFilter]
  );

  return (
    <PageWrapper
      title="Notifications"
      description="Everything happening across your jobs, workforce, clients and account in one place."
      headerExtra={
        <Box display="flex" gap={1} role="tablist" aria-label="Filter by read state">
          {READ_FILTER_OPTIONS.map((option) => (
            <FilterChip
              key={option.id}
              active={readFilter === option.id}
              role="tab"
              aria-selected={readFilter === option.id}
              type="button"
              onClick={() => setReadFilter(option.id)}
            >
              {option.label}
            </FilterChip>
          ))}
        </Box>
      }
      actions={[{ label: 'Mark all as read', onClick: handleMarkAllAsRead, variant: 'outlined' }]}
    >
      <NotificationList
        variant="page"
        notifications={visibleItems.map(mapNotificationToItem)}
        showMarkAllRead={false}
        loading={loading}
        filters={groupFilters}
        activeFilterId={groupFilter}
        onFilterChange={setGroupFilter}
        onViewClick={handleItemAction}
        onMarkAsRead={handleMarkAsRead}
      />
      {hasNext && (
        <Box display="flex" justifyContent="center" my={2}>
          <Button variant="outlined" color="primary" onClick={loadMore} disabled={loading}>
            Load more
          </Button>
        </Box>
      )}
    </PageWrapper>
  );
};

export default NotificationsPage;
