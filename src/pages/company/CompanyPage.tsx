import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Avatar, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import { TopNav } from '../../components/UI/TopNav';
import { Sidebar } from '../../components/UI/Sidebar';
import type { SidebarItem } from '../../components/UI/Sidebar';
import { floowColors } from '../../theme/colors';
import { rem } from '../../components/UI/Typography/utility';

const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PageRightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100vh',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: rem(32),
  overflow: 'auto',
  background: floowColors.grey[50],

  [theme.breakpoints.down('md')]: {
    padding: rem(20),
  },

  [theme.breakpoints.down('sm')]: {
    padding: rem(16),
  },
}));

const ContentBox = styled(Box)({
  background: floowColors.white,
  borderRadius: rem(16),
  padding: rem(32),
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.1)`,
  textAlign: 'center',
  maxWidth: '600px',
});

const LogoWrapper = styled(Box)({
  marginBottom: rem(24),
  display: 'flex',
  justifyContent: 'center',
});

const Title = styled(Typography)({
  fontSize: rem(32),
  fontWeight: 700,
  color: floowColors.black,
  marginBottom: rem(16),
});

const Subtitle = styled(Typography)({
  fontSize: rem(20),
  fontWeight: 600,
  color: floowColors.grey[600],
  marginBottom: rem(24),
});

const Message = styled(Typography)({
  fontSize: rem(16),
  color: floowColors.grey[600],
  lineHeight: 1.6,
  marginBottom: rem(16),
});

const MessageSecondary = styled(Typography)({
  fontSize: rem(14),
  color: floowColors.grey[500],
  lineHeight: 1.6,
  marginBottom: rem(16),
});

/**
 * Styled component for the right actions container
 */
const RightActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),

  [theme.breakpoints.down('md')]: {
    gap: rem(10),
  },

  [theme.breakpoints.down('sm')]: {
    gap: rem(8),
  },
}));

/**
 * Styled component for action buttons
 */
const ActionButton = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  color: floowColors.grey[300],
  fontSize: rem(20),
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s ease',

  '&:hover': {
    color: floowColors.grey[75],
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(18),
  },
}));

/**
 * Styled component for the divider
 */
const ActionDivider = styled(Box)({
  width: rem(1),
  height: rem(24),
  backgroundColor: floowColors.grey[650],
});

/**
 * Styled component for the user avatar
 */
const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  background: floowColors.white,
  cursor: 'pointer',
  fontSize: rem(14),
  color: floowColors.dark.slate,
  fontWeight: 600,
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.8,
  },

  [theme.breakpoints.down('sm')]: {
    width: rem(32),
    height: rem(32),
    fontSize: rem(12),
  },
}));

/**
 * RightActions Component
 *
 * Displays user-related actions in the top navigation:
 * - Notifications
 * - Settings
 * - User profile avatar
 */
const RightActions = () => (
  <RightActionsContainer>
    <ActionButton
      role="button"
      aria-label="Notifications"
      tabIndex={0}
    >
      <NotificationsIcon />
    </ActionButton>

    <ActionDivider aria-hidden={true} />

    <ActionButton
      role="button"
      aria-label="Settings"
      tabIndex={0}
    >
      <SettingsIcon />
    </ActionButton>

    <UserAvatar
      role="button"
      aria-label="User profile"
      tabIndex={0}
    >
      AH
    </UserAvatar>
  </RightActionsContainer>
);

export const CompanyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'workers', label: 'Workers', icon: <PeopleIcon /> },
    { id: 'jobs', label: 'Jobs', icon: <WorkIcon /> },
    { id: 'clients', label: 'Clients', icon: <BusinessIcon /> },
    { id: 'equipments', label: 'Equipments', icon: <BuildIcon /> },
    { id: 'customers', label: 'Customers', icon: <PersonIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <PageWrapper>
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItemId={activeTab}
        onItemClick={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Right Section: TopNav + MainContent */}
      <PageRightSection>
        {/* Top Navigation */}
        <TopNav
          rightContent={<RightActions />}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Main Content Area */}
        <MainContent>
          <ContentBox>
            <LogoWrapper>
              <Box sx={{ fontSize: rem(48) }}>🏢</Box>
            </LogoWrapper>
            <Title>Company Dashboard</Title>
            <Subtitle>Welcome to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Subtitle>
            <Message>
              We're working hard to bring you an amazing experience.
              The {activeTab} section is currently under construction and will be available soon.
            </Message>
            <MessageSecondary>
              Thank you for your patience!
            </MessageSecondary>
          </ContentBox>
        </MainContent>
      </PageRightSection>
    </PageWrapper>
  );
};
