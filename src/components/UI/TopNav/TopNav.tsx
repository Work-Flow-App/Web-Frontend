import React from 'react';
import { TopNavOuterWrapper, TopNavWrapper, RightSection } from './TopNav.styles';
import type { TopNavProps } from './TopNav.types';

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
  rightContent,
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
        {/* Right Content Section - Notifications, User Profile, Actions */}
        {rightContent && (
          <RightSection role="region" aria-label="User actions">
            {rightContent}
          </RightSection>
        )}
      </TopNavWrapper>
    </TopNavOuterWrapper>
  );
};
