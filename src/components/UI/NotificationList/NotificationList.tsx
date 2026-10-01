import React from 'react';
import { Skeleton } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import type { INotificationList, INotification } from './INotificationList';
import { NotificationItem } from './NotificationItem';
import {
  NotificationListContainer,
  NotificationHeader,
  NotificationTitleGroup,
  NotificationTitle,
  UnreadCountBadge,
  MarkAllReadButton,
  FilterBar,
  FilterChip,
  FilterChipCount,
  NotificationItems,
  NotificationDivider,
  EmptyState,
  EmptyStateTitle,
  EmptyStateSubtitle,
  SkeletonRow,
  NotificationFooter,
} from './NotificationList.styles';

export const NotificationList: React.FC<INotificationList> = ({
  notifications,
  title = 'Notifications',
  variant = 'dropdown',
  showMarkAllRead = true,
  onMarkAllRead,
  filters,
  activeFilterId = 'all',
  onFilterChange,
  onNotificationClick,
  onMarkAsRead,
  onViewClick,
  loading = false,
  footer,
  className,
  sx,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleViewClick = (notification: INotification) => {
    onNotificationClick?.(notification);
    onViewClick?.(notification);
  };

  return (
    <NotificationListContainer variant={variant} className={className} sx={sx}>
      <NotificationHeader>
        <NotificationTitleGroup>
          <NotificationTitle>{title}</NotificationTitle>
          {unreadCount > 0 && <UnreadCountBadge>{unreadCount > 99 ? '99+' : unreadCount}</UnreadCountBadge>}
        </NotificationTitleGroup>
        {showMarkAllRead && onMarkAllRead && (
          <MarkAllReadButton onClick={onMarkAllRead} disabled={unreadCount === 0} type="button">
            Mark all as read
          </MarkAllReadButton>
        )}
      </NotificationHeader>

      {filters && filters.length > 0 && (
        <FilterBar role="tablist" aria-label="Filter notifications by group">
          {filters.map((filter) => {
            const active = filter.id === activeFilterId;
            return (
              <FilterChip
                key={filter.id}
                active={active}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => onFilterChange?.(filter.id)}
              >
                {filter.label}
                {typeof filter.count === 'number' && filter.count > 0 && (
                  <FilterChipCount active={active}>{filter.count}</FilterChipCount>
                )}
              </FilterChip>
            );
          })}
        </FilterBar>
      )}

      <NotificationItems>
        {loading && notifications.length === 0 ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonRow key={`skeleton-${index}`}>
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={18} animation="wave" />
                <Skeleton variant="text" width="60%" height={14} animation="wave" />
              </div>
            </SkeletonRow>
          ))
        ) : notifications.length === 0 ? (
          <EmptyState>
            <NotificationsNoneOutlinedIcon />
            <EmptyStateTitle>You're all caught up</EmptyStateTitle>
            <EmptyStateSubtitle>No notifications here right now.</EmptyStateSubtitle>
          </EmptyState>
        ) : (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id || index}>
              <NotificationItem notification={notification} onMarkAsRead={onMarkAsRead} onViewClick={handleViewClick} />
              {index < notifications.length - 1 && <NotificationDivider />}
            </React.Fragment>
          ))
        )}
      </NotificationItems>

      {footer && <NotificationFooter>{footer}</NotificationFooter>}
    </NotificationListContainer>
  );
};
