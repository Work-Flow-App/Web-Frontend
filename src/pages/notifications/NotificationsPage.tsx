import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { NotificationList } from '../../components/UI/NotificationList';
import type { INotification } from '../../components/UI/NotificationList';
import { mapNotificationToItem } from '../../components/UI/NotificationList/mapNotification';
import { notificationService } from '../../services/api/notification';
import type { NotificationResponse } from '../../services/api/notification';
import { useNotifications } from '../../contexts/NotificationContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { Button } from '../../components/UI/Button';

const PAGE_SIZE = 20;

type Filter = 'all' | 'unread';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const { markAsRead, markAllAsRead } = useNotifications();

  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

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
    loadFirstPage(filter === 'unread');
  }, [filter, loadFirstPage]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await notificationService.list({
        unreadOnly: filter === 'unread',
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
  }, [cursor, filter, showError]);

  const markLocalRead = (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleItemAction = (item: INotification) => {
    const source = items.find((n) => String(n.id) === item.id);
    if (source?.id === undefined) return;
    markAsRead(source.id);
    markLocalRead(source.id);
    if (source.targetUrl) {
      navigate(source.targetUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <PageWrapper
      title="Notifications"
      dropdownOptions={[
        { value: 'all', label: 'All' },
        { value: 'unread', label: 'Unread only' },
      ]}
      dropdownValue={filter}
      onDropdownChange={(value) => setFilter(value as Filter)}
      actions={[{ label: 'Mark all as read', onClick: handleMarkAllAsRead, variant: 'outlined' }]}
    >
      <NotificationList
        notifications={items.map(mapNotificationToItem)}
        showClearAll={false}
        onViewClick={handleItemAction}
        onMailClick={(id) => {
          const source = items.find((n) => String(n.id) === id);
          if (source?.id === undefined) return;
          markAsRead(source.id);
          markLocalRead(source.id);
        }}
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
