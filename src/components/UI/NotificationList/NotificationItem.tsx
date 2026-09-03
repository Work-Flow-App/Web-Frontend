import React from 'react';
import type { INotificationItem } from './INotificationList';
import { getNotificationCategory } from './notificationCategories';
import { formatRelativeTime } from '../../../utils/formatRelativeTime';
import { floowColors } from '../../../theme/colors';
import {
  NotificationItemContainer,
  NotificationIconCircle,
  NotificationAvatar,
  NotificationTextContent,
  NotificationTopRow,
  NotificationMainText,
  NotificationSubText,
  NotificationMetaRow,
  CategoryLabel,
  MetaDot,
  MetaTime,
  UrgentTag,
  UnreadDot,
  MarkReadButton,
} from './NotificationList.styles';

const PRIORITY_ACCENT: Record<string, string> = {
  URGENT: floowColors.error.main,
  HIGH: floowColors.warning.main,
};

export const NotificationItem: React.FC<INotificationItem> = ({ notification, onMarkAsRead, onViewClick }) => {
  const unread = !notification.isRead;
  const category = getNotificationCategory(notification.type);
  const accentColor = notification.priority ? PRIORITY_ACCENT[notification.priority] : undefined;
  const timeAgo = notification.timestamp ? formatRelativeTime(notification.timestamp.toISOString()) : undefined;

  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleActivate = () => {
    onViewClick?.(notification);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead?.(notification.id);
  };

  return (
    <NotificationItemContainer
      unread={unread}
      accentColor={accentColor}
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-label={notification.title}
    >
      {notification.avatar || notification.user ? (
        <NotificationAvatar src={notification.avatar} alt={notification.user || 'User'}>
          {notification.user ? getInitials(notification.user) : 'U'}
        </NotificationAvatar>
      ) : (
        <NotificationIconCircle color={category.color} bg={category.bg}>
          {notification.icon ?? category.icon}
        </NotificationIconCircle>
      )}

      <NotificationTextContent>
        <NotificationTopRow>
          <NotificationMainText unread={unread}>{notification.title}</NotificationMainText>
          {unread && <UnreadDot aria-label="Unread" />}
        </NotificationTopRow>

        {notification.subtitle && <NotificationSubText>{notification.subtitle}</NotificationSubText>}

        <NotificationMetaRow>
          <CategoryLabel color={category.color}>{category.label}</CategoryLabel>
          {timeAgo && (
            <>
              <MetaDot />
              <MetaTime>{timeAgo}</MetaTime>
            </>
          )}
          {notification.priority === 'URGENT' && <UrgentTag>Urgent</UrgentTag>}
          {unread && onMarkAsRead && (
            <MarkReadButton className="notification-mark-read" onClick={handleMarkAsRead} type="button">
              Mark as read
            </MarkReadButton>
          )}
        </NotificationMetaRow>
      </NotificationTextContent>
    </NotificationItemContainer>
  );
};
