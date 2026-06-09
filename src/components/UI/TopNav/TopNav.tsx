import React from 'react';
import { TopNavOuterWrapper, TopNavWrapper, RightSection, LeftSection, CenterSection, SearchSection,LogoWrapper, SidebarToggleButton} from './TopNav.styles';
import type { TopNavProps } from './TopNav.types';
import { FloowLogo } from '../FloowLogo/FloowLogo';
import { SidebarCollapse } from './icon/SidebarCollapse';
import { SidebarExpand } from './icon/SidebarExpand';

/**
 * TopNav Component
 *
 * A responsive top navigation bar with logo on the left and right-side actions (notifications, user profile).
 * Matches the Floow design system specifications following the HeaderNav pattern.
 *
 * @example
 * ```tsx
 * <TopNav
 *   rightContent={
 *     <>
 *       <NotificationIcon />
 *       <UserProfile />
 *     </>
 *   }
 * />
 * ```
 */
export const TopNav: React.FC<TopNavProps> = ({
  searchContent,
  rightContent,
  onToggleSidebar,
  isCollapsed,
  className,
  sx,
}) => {
  return (
    <TopNavOuterWrapper
      className={className}
      sx={sx}
      role="banner"
      aria-label="Top navigation"
    >
      <TopNavWrapper>
        {/* Left Section - Sidebar Toggle (Mobile & Desktop) */}
        <LeftSection>
          <SidebarToggleButton
            onClick={onToggleSidebar}
            size="large"
            aria-label="Toggle sidebar menu"
            title="Toggle sidebar"
          >
            {isCollapsed ? <SidebarExpand /> : <SidebarCollapse />}
          </SidebarToggleButton>
        </LeftSection>

        {/* Center Section - Mobile Logo (shown only on mobile) */}
        <CenterSection>
          <LogoWrapper>
            <FloowLogo variant="white" iconOnly />
          </LogoWrapper>
        </CenterSection>

        {/* Right Content Section - Search Input + Notifications, User Profile, Actions */}
        <RightSection role="region" aria-label="User actions">
          {searchContent && (
            <SearchSection>
              {searchContent}
            </SearchSection>
          )}
          {rightContent}
        </RightSection>
      </TopNavWrapper>
    </TopNavOuterWrapper>
  );
};
