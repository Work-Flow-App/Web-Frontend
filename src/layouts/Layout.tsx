import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { Box, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { TopNav } from '../components/UI/TopNav';
import { Sidebar } from '../components/UI/Sidebar';
import type { SidebarItem } from '../components/UI/Sidebar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Search } from '../components/UI/Search';
import { Loader } from '../components/UI/Loader';
import { authService } from '../services/api/auth';
import { getRoleFromToken } from '../utils/jwt';
import { useSessionRestore } from '../hooks/useSessionRestore';
import * as S from './Layout.styles';
import { Place } from '@mui/icons-material';

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
    <S.RightActionsContainer>
      <S.ActionButton role="button" aria-label="Notifications" tabIndex={0}>
        <NotificationsIcon />
      </S.ActionButton>

      <S.ActionDivider aria-hidden={true} />

      <S.ActionButton role="button" aria-label="Settings" tabIndex={0}>
        <SettingsIcon />
      </S.ActionButton>

      <S.UserAvatar
        role="button"
        aria-label="User profile"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        tabIndex={0}
        onClick={handleClick}
      >
        {userInitials}
      </S.UserAvatar>

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
        sx={S.menuSx}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </S.RightActionsContainer>
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

  // Wait for session restoration before rendering protected content
  const { isRestoring, hasSession } = useSessionRestore();

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
    {
      id: 'workers',
      label: 'Workers',
      icon: <PeopleIcon />,
      href: '/company/workers',
      children: [
        { id: 'invitations', label: 'Invitations', icon: <MailOutlineIcon />, href: '/company/invitations' },
      ],
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: <WorkIcon />,
      href: '/company/jobs',
      children: [
        { id: 'templates', label: 'Templates', icon: <DescriptionIcon />, href: '/company/jobs/templates' },
      ],
    },
    { id: 'clients', label: 'Clients', icon: <BusinessIcon />, href: '/company/clients' },
    {
      id: 'assets',
      label: 'Assets',
      icon: <BuildIcon />,
      href: '/company/assets',
      children: [
        {
          id: 'maps',
          label: 'Maps',
          icon: <Place />,
          href: '/company/assets/maps',
        },
      ],
    },
    { id: 'customers', label: 'Customers', icon: <PersonIcon />, href: '/company/customers' },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, href: '/company/settings' },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Show loader while restoring session
  if (isRestoring) {
    return <Loader />;
  }

  // Redirect to login if no session after restoration
  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  return (
    <S.PageWrapper>
      {/* Persistent Sidebar */}
      <Sidebar items={sidebarItems} isCollapsed={isSidebarCollapsed} onToggleCollapse={handleToggleSidebar} />

      {/* Right Section: TopNav + MainContent */}
      <S.PageRightSection>
        {/* Persistent TopNav */}
        <TopNav
          searchContent={
            <Box sx={S.searchContainerSx}>
              <Search
                placeholder="Search..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => {
                  console.log('Search:', query);
                }}
                width="300px"
                styles={S.searchStyles}
              />
            </Box>
          }
          rightContent={<RightActions userInitials={userInitials} onLogout={handleLogout} />}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Dynamic Content Area - Changes based on route */}
        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.PageRightSection>
    </S.PageWrapper>
  );
};

export default Layout;
