import React from 'react';
import type { NotificationListProps } from './NotificationList.types';
import { NotificationItem } from './NotificationItem';
import {
  NotificationListContainer,
  NotificationHeader,
  NotificationTitle,
  ClearAllButton,
  NotificationItems,
} from './NotificationList.styles';

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  title = 'Notifications',
  showClearAll = true,
  onClearAll,
  onNotificationClick,
  onMailClick,
  onViewClick,
  className,
  sx,
}) => {
  const handleNotificationClick = (notification: any) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <NotificationListContainer className={className} sx={sx}>
      {/* Header */}
      <NotificationHeader>
        <NotificationTitle>{title}</NotificationTitle>
        {showClearAll && notifications.length > 0 && (
          <ClearAllButton onClick={handleClearAll} role="button">
            Clear all
          </ClearAllButton>
        )}
      </NotificationHeader>

      {/* Notification Items */}
      <NotificationItems>
        {notifications.length === 0 ? (
          <NotificationTitle sx={{ textAlign: 'center', width: '100%', py: 2 }}>
            No notifications
          </NotificationTitle>
        ) : (
          notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id || index}
              notification={notification}
              onMailClick={onMailClick}
              onViewClick={(notif) => {
                handleNotificationClick(notif);
                if (onViewClick) {
                  onViewClick(notif);
                }
              }}
            />
          ))
        )}
      </NotificationItems>
    </NotificationListContainer>
  );
};
