import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, IconButton, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { SidebarWrapper, SidebarItemButton, IconWrapper, SidebarLogoSection, SidebarBackdrop } from './Sidebar.styles';
import type { SidebarProps, SidebarItem } from './Sidebar.types';
import { FloowLogo } from '../FloowLogo/FloowLogo';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  className,
  sx,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand parent items when child is active (but allow manual collapse)
  React.useEffect(() => {
    setExpandedItems((prevExpanded) => {
      const newExpanded = new Set(prevExpanded);
      items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some((child) => child.href === location.pathname);
          // Only auto-expand when navigating to a child page, don't force expansion for parent page
          if (hasActiveChild) {
            newExpanded.add(item.id);
          }
        }
      });
      return newExpanded;
    });
  }, [location.pathname, items]);

  /**
   * Determine if a sidebar item is active based on:
   * 1. activeItemId prop (for controlled behavior)
   * 2. Current route pathname (for automatic detection)
   */
  const isItemActive = (item: SidebarItem): boolean => {
    if (activeItemId) {
      return activeItemId === item.id;
    }
    // Auto-detect active item based on current route
    if (item.href) {
      // Exact match for the href
      return location.pathname === item.href;
    }
    return false;
  };

  /**
   * Check if item or any of its children is active
   */
  const isItemOrChildActive = (item: SidebarItem): boolean => {
    if (isItemActive(item)) return true;
    if (item.children) {
      return item.children.some((child) => isItemOrChildActive(child));
    }
    return false;
  };

  // Handle menu item click
  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  // Toggle submenu expansion
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Mobile backdrop - click to close sidebar */}
      <SidebarBackdrop isVisible={!isCollapsed} onClick={onToggleCollapse} role="presentation" />

      <SidebarWrapper isCollapsed={isCollapsed} className={className} sx={sx}>
        {/* Logo Section - Desktop (without toggle button) */}
        {!isCollapsed && (
          <Box
            sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center', width: '100%' }}
          >
            <SidebarLogoSection sx={{ flex: 1, margin: 0, padding: 0, border: 'none' }}>
              <FloowLogo variant="light" />
            </SidebarLogoSection>
          </Box>
        )}

        {/* Mobile Close Button - Top Right */}
        {!isCollapsed && (
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: '100%',
              justifyContent: 'flex-end',
              marginBottom: rem(8),
            }}
          >
            <IconButton
              onClick={onToggleCollapse}
              sx={{
                padding: rem(4),
                minWidth: rem(40),
                minHeight: rem(40),
                color: floowColors.grey[700],
                '&:hover': {
                  backgroundColor: floowColors.grey[100],
                  color: floowColors.grey[800],
                },
              }}
              title="Close Sidebar"
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {/* Collapsed State - Show Logo Only */}
        {isCollapsed && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: rem(16) }}>
            <SidebarLogoSection sx={{ margin: 0, padding: 0, border: 'none' }}>
              <FloowLogo variant="light" showText={false} />
            </SidebarLogoSection>
          </Box>
        )}

        {/* Navigation Items */}
        {items.map((item) => {
          const active = isItemActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isActiveOrChildActive = isItemOrChildActive(item);

          // Item with children (parent menu)
          if (hasChildren) {
            return (
              <Box key={item.id} sx={{ width: '100%' }}>
                {/* Parent item - only toggle expansion, no navigation */}
                <SidebarItemButton
                  className={isActiveOrChildActive ? 'active' : ''}
                  onClick={() => {
                    handleItemClick(item.id);
                    item.onClick?.();
                    toggleExpanded(item.id);
                  }}
                  role="menuitem"
                  aria-label={item.label}
                  title={isCollapsed ? item.label : undefined}
                  tabIndex={0}
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(12) }}>
                    {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Box>
                  {!isCollapsed &&
                    (isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                </SidebarItemButton>

                {/* Child items */}
                {!isCollapsed && (
                  <Collapse in={isExpanded}>
                    <Box sx={{ pl: rem(32), pt: rem(8) }}>
                      {item.children?.map((child) => {
                        const childActive = isItemActive(child);
                        if (child.href) {
                          return (
                            <Link
                              key={child.id}
                              to={child.href}
                              onClick={() => {
                                handleItemClick(child.id);
                                child.onClick?.();
                              }}
                              style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'block',
                                width: '100%',
                              }}
                            >
                              <SidebarItemButton
                                className={childActive ? 'active' : ''}
                                role="menuitem"
                                aria-label={child.label}
                                aria-current={childActive ? 'page' : undefined}
                                tabIndex={0}
                                sx={{ fontSize: rem(13) }}
                              >
                                {child.icon && <IconWrapper>{child.icon}</IconWrapper>}
                                <span>{child.label}</span>
                              </SidebarItemButton>
                            </Link>
                          );
                        }
                        return (
                          <SidebarItemButton
                            key={child.id}
                            className={childActive ? 'active' : ''}
                            onClick={() => {
                              handleItemClick(child.id);
                              child.onClick?.();
                            }}
                            role="menuitem"
                            aria-label={child.label}
                            aria-current={childActive ? 'page' : undefined}
                            tabIndex={0}
                            sx={{ fontSize: rem(13) }}
                          >
                            {child.icon && <IconWrapper>{child.icon}</IconWrapper>}
                            <span>{child.label}</span>
                          </SidebarItemButton>
                        );
                      })}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          }

          // Regular item without children
          if (item.href) {
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => {
                  handleItemClick(item.id);
                  item.onClick?.();
                }}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  width: '100%',
                }}
              >
                <SidebarItemButton
                  className={active ? 'active' : ''}
                  role="menuitem"
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  title={isCollapsed ? item.label : undefined}
                  tabIndex={0}
                >
                  {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                  {!isCollapsed && <span>{item.label}</span>}
                </SidebarItemButton>
              </Link>
            );
          }

          // Fallback for items without href
          return (
            <SidebarItemButton
              key={item.id}
              className={active ? 'active' : ''}
              onClick={() => {
                handleItemClick(item.id);
                item.onClick?.();
              }}
              role="menuitem"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
              tabIndex={0}
            >
              {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
              {!isCollapsed && <span>{item.label}</span>}
            </SidebarItemButton>
          );
        })}
      </SidebarWrapper>
    </>
  );
};
