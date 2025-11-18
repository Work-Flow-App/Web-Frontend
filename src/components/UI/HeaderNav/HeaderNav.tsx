import React from 'react';
import {
  HeaderNavWrapper,
  HeaderNavContainer,
  LogoSection,
  ControlsSection,
  IconButtonStyled,
  UserProfileSection,
  UserAvatar,
  UserInfo,
  UserName,
  SubscriptionName,
  LogoutButton,
} from './HeaderNav.styles';
import { TabMenu } from '../Tab';
import { FloowLogo } from '../FloowLogo/FloowLogo';
import { NotificationIcon, SearchIcon, SettingsIcon, LogoutIcon } from './icons';
import type { IHeaderNav } from './IHeaderNav';

/**
 * HeaderNav Component
 *
 * A complete navigation header with logo, tabs, controls, and user profile.
 * Matches the Figma design specifications exactly.
 *
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
 *   { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
 *   { id: 'workers', label: 'Workers', icon: <WorkersIcon /> },
 *   { id: 'resources', label: 'Resources', icon: <ResourcesIcon /> },
 * ];
 *
 * const user = {
 *   name: 'Alex Halls',
 *   subscriptionName: 'Subscription Name',
 *   avatar: '/path/to/avatar.jpg',
 * };
 *
 * <HeaderNav
 *   tabs={tabs}
 *   activeTab="jobs"
 *   onTabChange={(id) => console.log(id)}
 *   user={user}
 *   hasNotifications={true}
 *   notificationCount={3}
 * />
 * ```
 */
export const HeaderNav: React.FC<IHeaderNav> = ({
  tabs,
  activeTab,
  onTabChange,
  user,
  showLogo = true,
  customLogo,
  onNotificationClick,
  onSearchClick,
  onSettingsClick,
  onProfileClick,
  onLogoutClick,
  className,
  sx,
}) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <HeaderNavWrapper className={className} sx={sx}>
      <HeaderNavContainer>
        {/* Logo Section */}
        {showLogo && (
          <LogoSection>
            {customLogo || <FloowLogo variant="white" showText={true} />}
          </LogoSection>
        )}

        {/* Tab Menu Section */}
        <TabMenu tabs={tabs} activeTab={activeTab} onChange={onTabChange} size="medium" />

        {/* Controls Section */}
        <ControlsSection>
          {/* Notification Icon */}
          <IconButtonStyled onClick={onNotificationClick} role="button" aria-label="Notifications">
            <NotificationIcon />
          </IconButtonStyled>

          {/* Search Icon */}
          <IconButtonStyled onClick={onSearchClick} role="button" aria-label="Search">
            <SearchIcon />
          </IconButtonStyled>

          {/* Settings Icon */}
          <IconButtonStyled onClick={onSettingsClick} role="button" aria-label="Settings">
            <SettingsIcon />
          </IconButtonStyled>

          {/* User Profile */}
          <UserProfileSection onClick={onProfileClick} role="button" aria-label="User profile">
            <UserAvatar src={user.avatar} alt={user.name}>
              {!user.avatar && getInitials(user.name)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user.name}</UserName>
              {user.subscriptionName && <SubscriptionName>{user.subscriptionName}</SubscriptionName>}
            </UserInfo>
          </UserProfileSection>

          {/* Logout Icon */}
          <LogoutButton onClick={onLogoutClick} role="button" aria-label="Logout">
            <LogoutIcon />
          </LogoutButton>
        </ControlsSection>
      </HeaderNavContainer>
    </HeaderNavWrapper>
  );
};
