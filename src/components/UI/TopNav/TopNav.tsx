import React from 'react';
import { IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TopNavOuterWrapper, TopNavWrapper, RightSection, LeftSection, CenterSection } from './TopNav.styles';
import type { TopNavProps } from './TopNav.types';
import { FloowLogo } from '../FloowLogo/FloowLogo';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

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
  onToggleSidebar,
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
        {/* Left Section - Mobile Sidebar Toggle */}
        <LeftSection>
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: floowColors.grey[300],
              display: { xs: 'flex', sm: 'none' },
            }}
            aria-label="Toggle sidebar menu"
            title="Open sidebar"
          >
            <MenuIcon />
          </IconButton>
        </LeftSection>

        {/* Center Section - Mobile Logo (shown only on mobile) */}
        <CenterSection>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: rem(8),
            '& img': {
              width: rem(28),
              height: rem(28),
            },
            '& > div > div': {
              fontSize: rem(18),
              lineHeight: rem(18),
              color: floowColors.white,
            },
          }}>
            <FloowLogo variant="light" showText={true} />
          </Box>
        </CenterSection>

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
