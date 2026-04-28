import React from 'react';
import { IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { TopNavOuterWrapper, TopNavWrapper, RightSection, LeftSection, CenterSection, SearchSection } from './TopNav.styles';
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
  searchContent,
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
        {/* Left Section - Sidebar Toggle (Mobile & Desktop) */}
        <LeftSection>
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: floowColors.grey[300],
            }}
            aria-label="Toggle sidebar menu"
            title="Toggle sidebar"
          >
            <MenuIcon />
          </IconButton>
        </LeftSection>

        {/* Center Section - Mobile Logo (shown only on mobile) */}
        <CenterSection>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& > div': {
              gap: 0,
            },
            '& img': {
              height: rem(28),
              width: 'auto',
              maxWidth: '120px',
              objectFit: 'contain',
              display: 'block',
            },
          }}>
            <FloowLogo variant="white" iconOnly />
          </Box>
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
