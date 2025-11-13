import React from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import { SidebarWrapper, SidebarItemButton, IconWrapper, SidebarLogoSection, SidebarBackdrop } from './Sidebar.styles';
import type { SidebarProps } from './Sidebar.types';
import { FloowLogo } from '../FloowLogo/FloowLogo';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

/**
 * Sidebar Component
 *
 * A responsive sidebar navigation component with support for icons, labels, and collapse toggle.
 * Matches the Floow design system specifications.
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
 *   { id: 'workers', label: 'Workers', icon: <PeopleIcon /> },
 *   { id: 'jobs', label: 'Jobs', icon: <WorkIcon /> },
 *   { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
 * ];
 *
 * <Sidebar
 *   items={items}
 *   activeItemId="dashboard"
 *   onItemClick={(id) => console.log(id)}
 *   isCollapsed={false}
 *   onToggleCollapse={() => console.log('toggle')}
 * />
 * ```
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  className,
  sx,
}) => {
  // Handle menu item click
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  return (
    <>
      {/* Mobile backdrop - click to close sidebar */}
      <SidebarBackdrop
        isVisible={!isCollapsed}
        onClick={onToggleCollapse}
        role="presentation"
      />

      <SidebarWrapper isCollapsed={isCollapsed} className={className} sx={sx}>
      {/* Logo Section with Toggle Button - Desktop */}
      {!isCollapsed && (
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', width: '100%', gap: rem(8) }}>
          <SidebarLogoSection sx={{ flex: 1, margin: 0, padding: 0, border: 'none' }}>
            <FloowLogo variant="light" showText={true} />
          </SidebarLogoSection>
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              padding: rem(4),
              minWidth: rem(40),
              minHeight: rem(40),
              flexShrink: 0,
              marginTop: rem(-8),
              color: floowColors.dark.slate,
              '&:hover': {
                backgroundColor: floowColors.grey[75],
              },
            }}
            title="Collapse Sidebar"
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
      )}

      {/* Mobile Close Button - Top Right */}
      {!isCollapsed && (
        <Box sx={{
          display: { xs: 'flex', sm: 'none' },
          width: '100%',
          justifyContent: 'flex-end',
          marginBottom: rem(8),
        }}>
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              padding: rem(4),
              minWidth: rem(40),
              minHeight: rem(40),
              color: floowColors.dark.slate,
              '&:hover': {
                backgroundColor: floowColors.grey[75],
              },
            }}
            title="Close Sidebar"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Collapsed Toggle Button */}
      {isCollapsed && (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <IconButton
            onClick={onToggleCollapse}
            sx={{
              padding: rem(4),
              minWidth: rem(40),
              minHeight: rem(40),
              color: floowColors.dark.slate,
              '&:hover': {
                backgroundColor: floowColors.grey[75],
              },
            }}
            title="Expand Sidebar"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Navigation Items */}
      {items.map((item) => (
        <SidebarItemButton
          key={item.id}
          className={activeItemId === item.id ? 'active' : ''}
          onClick={() => {
            handleItemClick(item.id);
            item.onClick?.();
          }}
          role="menuitem"
          aria-label={item.label}
          aria-current={activeItemId === item.id ? 'page' : undefined}
          title={isCollapsed ? item.label : undefined}
          tabIndex={0}
        >
          {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
          {!isCollapsed && <span>{item.label}</span>}
        </SidebarItemButton>
      ))}
      </SidebarWrapper>
    </>
  );
};
