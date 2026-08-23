import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { SidebarProps, SidebarItem } from './Sidebar.types';
import {
  BottomTabContainer,
  BottomTabButtonsWrapper,
  TabButton,
  TabButtonLink,
  TabIconWrapper,
  TabLabel,
  ArrowButtonOuter,
  Backdrop,
  PopupCard,
  PopupTriangle,
  PopupGrid,
  PopupItemLink,
  PopupItemButton,
  PopupItemIcon,
  PopupItemLabel,
} from './BottomTab.styles';

export const BottomTab: React.FC<SidebarProps> = ({
  items,
  activeItemId,
  onItemClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState<'workers' | 'jobs' | 'arrow' | null>(null);

  /**
   * Determine if a navigation item is active
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
   * Determine if an item or any of its children is active
   */
  const isItemOrChildActive = (item: SidebarItem): boolean => {
    if (isItemActive(item)) return true;
    if (item.children) {
      return item.children.some((child) => isItemOrChildActive(child));
    }
    return false;
  };

  const isCompanyView = items.length > 4;

  // Extract core company items if in company view
  const dashboardItem = items.find((i) => i.id === 'dashboard');
  const workersItem = items.find((i) => i.id === 'workers');
  const jobsItem = items.find((i) => i.id === 'jobs');
  const lineItemsItem = items.find((i) => i.id === 'line-items');

  // Remaining items to show under the arrow button
  const arrowItemIds = ['clients', 'assets', 'maps', 'customers'];
  const arrowItems = items.filter((item) => arrowItemIds.includes(item.id));
  const isAnyArrowItemActive = arrowItems.some((item) => isItemOrChildActive(item));

  // Helper to render popup sub-items
  const renderPopupItem = (item: SidebarItem) => {
    const active = isItemActive(item);
    const itemClassName = active ? 'active' : '';

    const handleItemClick = () => {
      onItemClick?.(item.id);
      item.onClick?.();
      setActivePopup(null);
      if (item.href) {
        navigate(item.href);
      }
    };

    const isLeaveRequests = item.label === 'Leave Requests';
    const labelContent = isLeaveRequests ? (
      <>
        Leave
        <br />
        Requests
      </>
    ) : (
      item.label
    );

    if (item.href) {
      return (
        <PopupItemLink
          key={item.id}
          to={item.href}
          onClick={handleItemClick}
          className={itemClassName}
        >
          {item.icon && <PopupItemIcon>{item.icon}</PopupItemIcon>}
          <PopupItemLabel sx={isLeaveRequests ? { whiteSpace: 'normal' } : undefined}>
            {labelContent}
          </PopupItemLabel>
        </PopupItemLink>
      );
    }

    return (
      <PopupItemButton
        key={item.id}
        onClick={handleItemClick}
        className={itemClassName}
      >
        {item.icon && <PopupItemIcon>{item.icon}</PopupItemIcon>}
        <PopupItemLabel sx={isLeaveRequests ? { whiteSpace: 'normal' } : undefined}>
          {labelContent}
        </PopupItemLabel>
      </PopupItemButton>
    );
  };

  // Helper to render main tab items
  const renderTabItem = (item: SidebarItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isItemOrChildActive(item);
    const itemClassName = active ? 'active' : '';

    const handleTabClick = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        if (item.id === 'workers') {
          setActivePopup((prev) => (prev === 'workers' ? null : 'workers'));
        } else if (item.id === 'jobs') {
          setActivePopup((prev) => (prev === 'jobs' ? null : 'jobs'));
        }
      } else {
        onItemClick?.(item.id);
        item.onClick?.();
        setActivePopup(null);
        if (item.href) {
          navigate(item.href);
        }
      }
    };

    if (item.href && !hasChildren) {
      return (
        <TabButton key={item.id} className={itemClassName}>
          <TabButtonLink to={item.href} onClick={handleTabClick}>
            {item.icon && <TabIconWrapper>{item.icon}</TabIconWrapper>}
            <TabLabel>{item.label}</TabLabel>
          </TabButtonLink>
        </TabButton>
      );
    }

    return (
      <TabButton key={item.id} onClick={handleTabClick} className={itemClassName}>
        {item.icon && <TabIconWrapper>{item.icon}</TabIconWrapper>}
        <TabLabel>{item.label}</TabLabel>
      </TabButton>
    );
  };

  return (
    <>
      {/* Click-away backdrop to close popups */}
      {activePopup && <Backdrop onClick={() => setActivePopup(null)} role="presentation" />}

      {/* Workers Popup */}
      <PopupCard isOpen={activePopup === 'workers'} positionType="workers">
        <PopupTriangle positionType="workers" />
        <PopupGrid>
          {workersItem?.children?.map((child) => renderPopupItem(child))}
        </PopupGrid>
      </PopupCard>

      {/* Jobs Popup */}
      <PopupCard isOpen={activePopup === 'jobs'} positionType="jobs">
        <PopupTriangle positionType="jobs" />
        <PopupGrid>
          {jobsItem?.children?.map((child) => renderPopupItem(child))}
        </PopupGrid>
      </PopupCard>

      {/* Arrow Popup */}
      <PopupCard isOpen={activePopup === 'arrow'} positionType="arrow">
        <PopupTriangle positionType="arrow" />
        <PopupGrid>
          {arrowItems.map((item) => renderPopupItem(item))}
        </PopupGrid>
      </PopupCard>

      {/* Main Bottom Tab Bar */}
      <BottomTabContainer>
        <BottomTabButtonsWrapper role="navigation" aria-label="Mobile navigation bar">
          {isCompanyView ? (
            <>
              {dashboardItem && renderTabItem(dashboardItem)}
              {workersItem && renderTabItem(workersItem)}
              {jobsItem && renderTabItem(jobsItem)}
              {lineItemsItem && renderTabItem(lineItemsItem)}

              {/* Toggleable Arrow Button */}
              <ArrowButtonOuter
                onClick={() => setActivePopup((prev) => (prev === 'arrow' ? null : 'arrow'))}
                className={isAnyArrowItemActive || activePopup === 'arrow' ? 'active' : ''}
                role="button"
                aria-haspopup="true"
                aria-expanded={activePopup === 'arrow'}
                aria-label="More navigation items"
              >
                {activePopup === 'arrow' ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowUpIcon />
                )}
              </ArrowButtonOuter>
            </>
          ) : (
            // For views with 4 or fewer items (e.g. Worker View)
            items.slice(0, 4).map((item) => renderTabItem(item))
          )}
        </BottomTabButtonsWrapper>
      </BottomTabContainer>
    </>
  );
};
