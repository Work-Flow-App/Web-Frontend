import type { Meta, StoryObj } from '@storybook/react';
import { HeaderNav } from './HeaderNav';
import { Box } from '@mui/material';
import { useState } from 'react';
import { NotificationDropdown, CalendarExceededIcon, ChecklistIcon, DocumentIcon } from '../NotificationList';
import { NotificationIcon, SearchIcon, SettingsIcon, LogoutIcon } from './icons';
import {
  IconButtonStyled,
  ControlsSection,
  UserProfileSection,
  UserAvatar,
  UserInfo,
  UserName,
  SubscriptionName,
  LogoutButton,
  HeaderNavWrapper,
  HeaderNavContainer,
  LogoSection,
} from './HeaderNav.styles';
import { TabMenu } from '../Tab';
import { FloowLogo } from '../FloowLogo/FloowLogo';

// Navigation icons
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      fill="currentColor"
    />
  </svg>
);

const JobsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
      fill="currentColor"
    />
  </svg>
);

const WorkersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="currentColor"
    />
  </svg>
);

const ResourcesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
      fill="currentColor"
    />
  </svg>
);

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
  { id: 'workers', label: 'Workers', icon: <WorkersIcon /> },
  { id: 'resources', label: 'Resources', icon: <ResourcesIcon /> },
];

const user = {
  name: 'Alex Halls',
  subscriptionName: 'Subscription Name',
};

const meta = {
  title: 'UI/HeaderNav',
  component: HeaderNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete navigation header component that matches the Figma design. Includes logo, tab navigation, control icons, and user profile section.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['dashboard', 'jobs', 'workers', 'resources'],
      description: 'Currently active tab id',
    },
    hasNotifications: {
      control: 'boolean',
      description: 'Show notification badge',
    },
    notificationCount: {
      control: 'number',
      description: 'Number of notifications',
    },
    showLogo: {
      control: 'boolean',
      description: 'Show Floow logo',
    },
  },
} satisfies Meta<typeof HeaderNav>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default HeaderNav
export const Default: Story = {
  args: {
    tabs,
    activeTab: 'jobs',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasNotifications={true}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
      </Box>
    );
  },
};

// With notification count
export const WithNotificationCount: Story = {
  args: {
    tabs,
    activeTab: 'dashboard',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={5}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
      </Box>
    );
  },
};

// With large notification count
export const WithLargeNotificationCount: Story = {
  args: {
    tabs,
    activeTab: 'workers',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={15}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
      </Box>
    );
  },
};

// Without notifications
export const WithoutNotifications: Story = {
  args: {
    tabs,
    activeTab: 'resources',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
      </Box>
    );
  },
};

// With user avatar
export const WithUserAvatar: Story = {
  args: {
    tabs,
    activeTab: 'jobs',
    onTabChange: () => {},
    user: {
      name: 'Alex Halls',
      subscriptionName: 'Premium Plan',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasNotifications={true}
          notificationCount={3}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
      </Box>
    );
  },
};

// Interactive example with content
export const WithPageContent: Story = {
  args: {
    tabs,
    activeTab: 'dashboard',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    const getPageContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return 'Dashboard Page Content';
        case 'jobs':
          return 'Jobs Page Content';
        case 'workers':
          return 'Workers Page Content';
        case 'resources':
          return 'Resources Page Content';
        default:
          return '';
      }
    };

    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasNotifications={true}
          notificationCount={7}
          onNotificationClick={() => alert('Notifications clicked')}
          onSearchClick={() => alert('Search clicked')}
          onSettingsClick={() => alert('Settings clicked')}
          onProfileClick={() => alert('Profile clicked')}
          onLogoutClick={() => alert('Logout clicked')}
        />
        <Box
          sx={{
            padding: '40px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 600,
          }}
        >
          {getPageContent()}
        </Box>
      </Box>
    );
  },
};

// Responsive preview
export const ResponsivePreview: Story = {
  args: {
    tabs,
    activeTab: 'jobs',
    onTabChange: () => {},
    user,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);
    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh' }}>
        <HeaderNav
          {...args}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          notificationCount={3}
          onNotificationClick={() => console.log('Notifications clicked')}
          onSearchClick={() => console.log('Search clicked')}
          onSettingsClick={() => console.log('Settings clicked')}
          onProfileClick={() => console.log('Profile clicked')}
          onLogoutClick={() => console.log('Logout clicked')}
        />
        <Box sx={{ padding: '20px', color: '#fff' }}>
          <p>Resize the browser window to see the responsive behavior</p>
        </Box>
      </Box>
    );
  },
};

// With Notification Dropdown - Interactive example showing notification list
export const WithNotificationDropdown: Story = {
  args: {
    tabs,
    activeTab: 'dashboard',
    onTabChange: () => {},
    user: {
      name: 'Alex Halls',
      subscriptionName: 'Premium Plan',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState(args.activeTab);

    const sampleNotifications = [
      {
        id: '1',
        title: 'Due date exceeded, action required',
        jobId: 'J-0001',
        user: 'Esther Howard',
        icon: <CalendarExceededIcon />,
        isRead: false,
      },
      {
        id: '2',
        title: 'Job completed successfully',
        jobId: 'J-0002',
        user: 'Wade Warren',
        icon: <ChecklistIcon />,
        isRead: false,
      },
      {
        id: '3',
        title: 'Workflow needs your approval',
        jobId: 'J-0003',
        user: 'Robert Fox',
        icon: <DocumentIcon />,
        isRead: true,
      },
      {
        id: '4',
        title: 'New task assigned to you',
        jobId: 'J-0004',
        user: 'Jane Cooper',
        icon: <DocumentIcon />,
        isRead: false,
      },
    ];

    const getInitials = (name: string) => {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    return (
      <Box sx={{ background: '#0A0A0A', minHeight: '100vh', padding: '20px' }}>
        <HeaderNavWrapper>
          <HeaderNavContainer>
            {/* Logo Section */}
            <LogoSection>
              <FloowLogo variant="white" showText={true} />
            </LogoSection>

            {/* Tab Menu Section */}
            <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />

            {/* Controls Section */}
            <ControlsSection>
              {/* Notification Dropdown - Click to see notifications */}
              <NotificationDropdown
                trigger={
                  <IconButtonStyled role="button" aria-label="Notifications">
                    <NotificationIcon />
                  </IconButtonStyled>
                }
                notifications={sampleNotifications}
                position="bottom-right"
                title="Notifications"
                showClearAll={true}
                onClearAll={() => console.log('Clear all notifications')}
                onMailClick={(id: string) => console.log('Mail clicked:', id)}
                onViewClick={(notif: any) => console.log('View notification:', notif)}
              />

              {/* Search Icon */}
              <IconButtonStyled onClick={() => console.log('Search')} role="button" aria-label="Search">
                <SearchIcon />
              </IconButtonStyled>

              {/* Settings Icon */}
              <IconButtonStyled onClick={() => console.log('Settings')} role="button" aria-label="Settings">
                <SettingsIcon />
              </IconButtonStyled>

              {/* User Profile */}
              <UserProfileSection onClick={() => console.log('Profile')} role="button" aria-label="User profile">
                <UserAvatar src={args.user.avatar} alt={args.user.name}>
                  {!args.user.avatar && getInitials(args.user.name)}
                </UserAvatar>
                <UserInfo>
                  <UserName>{args.user.name}</UserName>
                  {args.user.subscriptionName && <SubscriptionName>{args.user.subscriptionName}</SubscriptionName>}
                </UserInfo>
              </UserProfileSection>

              {/* Logout Icon */}
              <LogoutButton onClick={() => console.log('Logout')} role="button" aria-label="Logout">
                <LogoutIcon />
              </LogoutButton>
            </ControlsSection>
          </HeaderNavContainer>
        </HeaderNavWrapper>

        <Box sx={{ padding: '40px 0', color: '#fff', fontSize: '1.2rem' }}>
          <p><strong>Click the notification icon</strong> to see the NotificationList dropdown!</p>
          <p style={{ marginTop: '20px', color: '#888' }}>
            The dropdown shows notifications with user profiles, mail buttons, and view buttons.
            Click outside or press ESC to close it.
          </p>
        </Box>
      </Box>
    );
  },
};
