import React from 'react';
import type { NotificationItemProps } from './NotificationList.types';
import { MailIcon } from './icons';
import {
  NotificationItemContainer,
  NotificationContent,
  NotificationIconContainer,
  NotificationAvatar,
  NotificationTextContent,
  NotificationMainText,
  NotificationSubText,
  UserProfileSection,
  UserProfileAvatar,
  UserProfileName,
  NotificationActions,
  MailButton,
  ViewButton,
  NotificationDivider,
} from './NotificationList.styles';

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMailClick,
  onViewClick,
}) => {
  const handleMailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMailClick) {
      onMailClick(notification.id);
    }
  };

  const handleViewClick = () => {
    if (onViewClick) {
      onViewClick(notification);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <NotificationItemContainer>
        <NotificationContent>
          {/* Icon or Avatar */}
          {notification.icon ? (
            <NotificationIconContainer>
              {notification.icon}
            </NotificationIconContainer>
          ) : notification.avatar ? (
            <NotificationAvatar
              src={notification.avatar}
              alt={notification.user || 'User'}
            >
              {notification.user ? getInitials(notification.user) : 'U'}
            </NotificationAvatar>
          ) : (
            <NotificationAvatar>
              {notification.user ? getInitials(notification.user) : 'N'}
            </NotificationAvatar>
          )}

          {/* Text Content */}
          <NotificationTextContent>
            <NotificationMainText>
              {notification.title}
            </NotificationMainText>
            {(notification.subtitle || notification.jobId) && (
              <NotificationSubText>
                {notification.jobId && <span>Job ID {notification.jobId}</span>}
                {!notification.jobId && notification.subtitle && (
                  <span>{notification.subtitle}</span>
                )}
              </NotificationSubText>
            )}
          </NotificationTextContent>
        </NotificationContent>

        {/* Actions */}
        <NotificationActions>
          <MailButton onClick={handleMailClick} role="button" aria-label="Send mail">
            {notification.user ? (
              <UserProfileSection>
                {notification.avatar ? (
                  <UserProfileAvatar
                    src={notification.avatar}
                    alt={notification.user}
                  >
                    {getInitials(notification.user)}
                  </UserProfileAvatar>
                ) : (
                  <UserProfileAvatar>
                    {getInitials(notification.user)}
                  </UserProfileAvatar>
                )}
                <UserProfileName>{notification.user}</UserProfileName>
              </UserProfileSection>
            ) : (
              <MailIcon />
            )}
          </MailButton>
          <ViewButton onClick={handleViewClick} role="button">
            View
          </ViewButton>
        </NotificationActions>
      </NotificationItemContainer>
      <NotificationDivider />
    </>
  );
};
