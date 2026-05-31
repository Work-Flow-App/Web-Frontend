import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Collapse, Popover, List, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {
  SidebarWrapper,
  SidebarItemButton,
  SidebarParentItemButton,
  SidebarChildItemButton,
  IconWrapper,
  SidebarLogoSectionFlat,
  SidebarBackdrop,
  SidebarDesktopLogoRow,
  SidebarMobileHeader,
  SidebarMobileBrand,
  SidebarBrandTextStack,
  SidebarBrandName,
  SidebarBrandSubtitle,
  SidebarCloseButton,
  SidebarCollapsedLogoRow,
  SidebarNavItemWrapper,
  SidebarParentItemContent,
  SidebarChildItemsList,
  SidebarNavLink,
  SidebarPopoverContent,
  SidebarPopoverLabel,
  SidebarPopoverListItem,
  SidebarPopoverListIcon,
  SidebarCollapsedLogoSection,
  sidebarPopoverPaperProps,
  sidebarPopoverTextSlotProps,
} from './Sidebar.styles';
import type { SidebarProps, SidebarItem } from './Sidebar.types';
import { FloowLogo } from '../FloowLogo/FloowLogo';


export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  className,
  sx,
  subtitle,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [popoverAnchor, setPopoverAnchor] = useState<{ el: HTMLElement; item: SidebarItem } | null>(null);

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
    if (item.href) {
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

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

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

  const handleCollapsedParentClick = (event: React.MouseEvent<HTMLElement>, item: SidebarItem) => {
    setPopoverAnchor({ el: event.currentTarget, item });
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  return (
    <>
      {/* Mobile backdrop - click to close sidebar */}
      <SidebarBackdrop isVisible={!isCollapsed} onClick={onToggleCollapse} role="presentation" />

      <SidebarWrapper isCollapsed={isCollapsed} className={className} sx={sx}>
        {/* Logo Section - Desktop */}
        {!isCollapsed && (
          <SidebarDesktopLogoRow>
            <SidebarLogoSectionFlat>
              <FloowLogo variant="light" />
            </SidebarLogoSectionFlat>
          </SidebarDesktopLogoRow>
        )}

        {/* Mobile Header - Logo + Close Button */}
        {!isCollapsed && (
          <SidebarMobileHeader>
            <SidebarMobileBrand>
              <FloowLogo iconOnly />
              <SidebarBrandTextStack>
                <SidebarBrandName>Workfloww</SidebarBrandName>
                {subtitle && <SidebarBrandSubtitle>{subtitle}</SidebarBrandSubtitle>}
              </SidebarBrandTextStack>
            </SidebarMobileBrand>
            <SidebarCloseButton onClick={onToggleCollapse} title="Close Sidebar" aria-label="Close sidebar">
              <CloseIcon />
            </SidebarCloseButton>
          </SidebarMobileHeader>
        )}

        {/* Collapsed State - Show Icon Only */}
        {isCollapsed && (
          <SidebarCollapsedLogoRow>
            <SidebarCollapsedLogoSection>
              <FloowLogo iconOnly />
            </SidebarCollapsedLogoSection>
          </SidebarCollapsedLogoRow>
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
              <SidebarNavItemWrapper key={item.id}>
                {/* Parent item - only toggle expansion, no navigation */}
                <SidebarParentItemButton
                  className={isActiveOrChildActive ? 'active' : ''}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleItemClick(item.id);
                    item.onClick?.();
                    if (isCollapsed) {
                      handleCollapsedParentClick(e, item);
                    } else {
                      toggleExpanded(item.id);
                    }
                  }}
                  role="menuitem"
                  aria-label={item.label}
                  title={isCollapsed ? item.label : undefined}
                  tabIndex={0}
                >
                  <SidebarParentItemContent>
                    {item.icon && <IconWrapper>{item.icon}</IconWrapper>}
                    {!isCollapsed && <span>{item.label}</span>}
                  </SidebarParentItemContent>
                  {!isCollapsed &&
                    (isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                </SidebarParentItemButton>

                {/* Child items */}
                {!isCollapsed && (
                  <Collapse in={isExpanded}>
                    <SidebarChildItemsList>
                      {item.children?.map((child) => {
                        const childActive = isItemActive(child);
                        if (child.href) {
                          return (
                            <SidebarNavLink
                              key={child.id}
                              to={child.href}
                              onClick={() => {
                                handleItemClick(child.id);
                                child.onClick?.();
                              }}
                            >
                              <SidebarChildItemButton
                                className={childActive ? 'active' : ''}
                                role="menuitem"
                                aria-label={child.label}
                                aria-current={childActive ? 'page' : undefined}
                                tabIndex={0}
                              >
                                {child.icon && <IconWrapper>{child.icon}</IconWrapper>}
                                <span>{child.label}</span>
                              </SidebarChildItemButton>
                            </SidebarNavLink>
                          );
                        }
                        return (
                          <SidebarChildItemButton
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
                          >
                            {child.icon && <IconWrapper>{child.icon}</IconWrapper>}
                            <span>{child.label}</span>
                          </SidebarChildItemButton>
                        );
                      })}
                    </SidebarChildItemsList>
                  </Collapse>
                )}
              </SidebarNavItemWrapper>
            );
          }

          // Regular item without children
          if (item.href) {
            return (
              <SidebarNavLink
                key={item.id}
                to={item.href}
                onClick={() => {
                  handleItemClick(item.id);
                  item.onClick?.();
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
              </SidebarNavLink>
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

      {/* Collapsed sub-items popover */}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor?.el}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: sidebarPopoverPaperProps }}
      >
        {popoverAnchor?.item && (
          <SidebarPopoverContent>
            <SidebarPopoverLabel>{popoverAnchor.item.label}</SidebarPopoverLabel>
            <List disablePadding>
              {popoverAnchor.item.children?.map((child) => {
                const childActive = isItemActive(child);
                return (
                  <SidebarPopoverListItem
                    key={child.id}
                    component={child.href ? SidebarNavLink : 'div'}
                    {...(child.href ? { to: child.href } : {})}
                    selected={childActive}
                    onClick={() => {
                      handleItemClick(child.id);
                      child.onClick?.();
                      handlePopoverClose();
                    }}
                  >
                    {child.icon && (
                      <SidebarPopoverListIcon>{child.icon}</SidebarPopoverListIcon>
                    )}
                    <ListItemText
                      primary={child.label}
                      slotProps={sidebarPopoverTextSlotProps(childActive)}
                    />
                  </SidebarPopoverListItem>
                );
              })}
            </List>
          </SidebarPopoverContent>
        )}
      </Popover>
    </>
  );
};