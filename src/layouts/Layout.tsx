import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
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
import LogoutIcon from '@mui/icons-material/Logout';
import { Search } from '../components/UI/Search';
import { floowColors } from '../theme/colors';
import { rem } from '../components/UI/Typography/utility';
import { authService } from '../services/api/auth';
import { getRoleFromToken } from '../utils/jwt';

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
    color: floowColors.grey[100],
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
  backgroundColor: floowColors.grey[600],
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
  color: floowColors.black,
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
 * Right actions component with profile menu
 */
const RightActions = ({ userInitials = 'U', onLogout }: { userInitials?: string; onLogout: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  return (
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
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        tabIndex={0}
        onClick={handleClick}
      >
        {userInitials}
      </UserAvatar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1.5,
          '& .MuiPaper-root': {
            minWidth: 180,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </RightActionsContainer>
  );
};

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
  const navigate = useNavigate();

  // Get user initials from in-memory token
  const userInitials = useMemo(() => {
    const token = authService.getAccessToken();
    if (!token) return 'U';

    const role = getRoleFromToken(token);
    if (!role) return 'U';

    // Extract initials from role (e.g., ROLE_COMPANY -> CO, ROLE_WORKER -> WO)
    return role.replace('ROLE_', '').substring(0, 2).toUpperCase();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear tokens and redirect
      navigate('/login');
    }
  };

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
              <Search
                placeholder="Search..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => {
                  console.log('Search:', query);
                }}
                width="300px"
                styles={{
                  input: {
                    height: '36px',
                    padding: '8px 12px',
                  },
                }}
              />
            </Box>
          }
          rightContent={<RightActions userInitials={userInitials} onLogout={handleLogout} />}
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
