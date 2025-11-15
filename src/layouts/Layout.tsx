import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Avatar } from '@mui/material';
import { TopNav } from '../components/UI/TopNav';
import { Sidebar } from '../components/UI/Sidebar';
import type { SidebarItem } from '../components/UI/Sidebar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import { SearchInput } from '../components/UI/SearchInput';
import { floowColors } from '../theme/colors';
import { rem } from '../components/UI/Typography/utility';

/**
 * Main page wrapper with sidebar and right section
 */
const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

/**
 * Right section containing TopNav and content area
 */
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

/**
 * Main content area that scrolls independently
 */
const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  background: floowColors.grey[50],

  [theme.breakpoints.down('sm')]: {
    overflow: 'visible',
  },
}));

/**
 * Right actions container for TopNav
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
 * Action button styling
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
 * Divider between action buttons
 */
const ActionDivider = styled(Box)({
  width: rem(1),
  height: rem(24),
  backgroundColor: floowColors.grey[650],
});

/**
 * User avatar styling
 */
const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: rem(32),
  height: rem(32),
  background: floowColors.white,
  cursor: 'pointer',
  fontSize: rem(12),
  color: floowColors.dark.slate,
  fontWeight: 600,
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.8,
  },

  [theme.breakpoints.down('sm')]: {
    width: rem(28),
    height: rem(28),
    fontSize: rem(11),
  },
}));

/**
 * Right actions component
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

/**
 * Layout Component
 *
 * Persistent layout wrapper that contains:
 * - Sidebar navigation (persists across route changes)
 * - TopNav with search and actions (persists across route changes)
 * - Outlet for page content (changes based on route)
 *
 * This component uses React Router's Outlet to render child pages
 * without reloading the sidebar or topnav.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * <Routes>
 *   <Route element={<Layout />}>
 *     <Route path="/company" element={<DashboardPage />} />
 *     <Route path="/company/workers" element={<WorkersPage />} />
 *     <Route path="/company/jobs" element={<JobsPage />} />
 *   </Route>
 * </Routes>
 * ```
 */
export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Sidebar items with their icons
   * Links are handled in Sidebar component using React Router Link
   */
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, href: '/company' },
    { id: 'workers', label: 'Workers', icon: <PeopleIcon />, href: '/company/workers' },
    { id: 'jobs', label: 'Jobs', icon: <WorkIcon />, href: '/company/jobs' },
    { id: 'clients', label: 'Clients', icon: <BusinessIcon />, href: '/company/clients' },
    { id: 'equipments', label: 'Equipments', icon: <BuildIcon />, href: '/company/equipments' },
    { id: 'customers', label: 'Customers', icon: <PersonIcon />, href: '/company/customers' },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/company/settings' },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <PageWrapper>
      {/* Persistent Sidebar */}
      <Sidebar
        items={sidebarItems}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Right Section: TopNav + MainContent */}
      <PageRightSection>
        {/* Persistent TopNav */}
        <TopNav
          searchContent={
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SearchInput
                variant="dark"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(query) => {
                  console.log('Search:', query);
                }}
                aria-label="Search"
              />
            </Box>
          }
          rightContent={<RightActions />}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Dynamic Content Area - Changes based on route */}
        <MainContent>
          <Outlet />
        </MainContent>
      </PageRightSection>
    </PageWrapper>
  );
};

export default Layout;
