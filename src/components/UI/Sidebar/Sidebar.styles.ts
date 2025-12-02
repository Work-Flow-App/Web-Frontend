import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

interface SidebarWrapperProps {
  isCollapsed?: boolean;
}

/**
 * Main sidebar container
 */
export const SidebarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})<SidebarWrapperProps>(({ theme, isCollapsed }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: isCollapsed ? rem(80) : rem(250),
  height: '100vh',
  padding: rem(16),
  gap: rem(8),
  backgroundColor: floowColors.grey[50],
  borderRight: `${rem(1)} solid ${floowColors.grey[200]}`,
  overflow: 'auto',
  boxSizing: 'border-box',
  flexShrink: 0,
  transition: 'width 0.3s ease',

  [theme.breakpoints.down('lg')]: {
    width: isCollapsed ? rem(75) : rem(220),
    padding: rem(14),
  },

  [theme.breakpoints.down('md')]: {
    width: isCollapsed ? rem(70) : rem(200),
    padding: rem(12),
  },

  [theme.breakpoints.down('sm')]: {
    // Mobile drawer overlay
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: rem(250),
    height: '100vh',
    padding: rem(16),
    zIndex: 1200,
    display: 'flex',
    transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, visibility',
    visibility: isCollapsed ? 'hidden' : 'visible',
  },
}));

/**
 * Individual sidebar item button
 */
export const SidebarItemButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: `${rem(8)} ${rem(12)}`,
  gap: rem(12),
  width: '100%',
  minHeight: rem(40),
  backgroundColor: 'transparent',
  borderRadius: rem(8),
  cursor: 'pointer',
  border: 'none',
  fontSize: rem(14),
  fontWeight: 500,
  color: floowColors.grey[700],
  userSelect: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',

  '&:hover': {
    backgroundColor: floowColors.grey[100],
    color: floowColors.black,
  },

  '&.active': {
    backgroundColor: floowColors.grey[200],
    color: floowColors.black,
    fontWeight: 600,
  },

  [theme.breakpoints.down('lg')]: {
    padding: `${rem(7)} ${rem(11)}`,
    minHeight: rem(38),
    fontSize: rem(13),
  },

  [theme.breakpoints.down('md')]: {
    padding: `${rem(6)} ${rem(10)}`,
    minHeight: rem(36),
  },

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(8)} ${rem(10)}`,
    minHeight: rem(36),
    fontSize: rem(12),
    gap: rem(8),
  },
}));

/**
 * Icon wrapper for sidebar items
 */
export const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: rem(20),
  height: rem(20),

  '& svg': {
    width: '100%',
    height: '100%',
    fill: 'currentColor',
  },
}));

interface SidebarBackdropProps {
  isVisible?: boolean;
}

/**
 * Mobile sidebar backdrop/overlay
 */
export const SidebarBackdrop = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<SidebarBackdropProps>(({ theme, isVisible }) => ({
  display: 'none',

  [theme.breakpoints.down('sm')]: {
    display: isVisible ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1100,
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    willChange: 'opacity',
  },
}));

/**
 * Logo section at top of sidebar
 */
export const SidebarLogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  paddingBottom: rem(16),
  borderBottom: `${rem(1)} solid ${floowColors.grey[200]}`,
  boxSizing: 'border-box',
  width: '100%',

  '& img': {
    width: rem(32),
    height: rem(32),
  },

  '& > div': {
    gap: rem(4),
  },

  '& > div > div': {
    fontSize: rem(24),
    lineHeight: rem(24),
    fontWeight: 600,
    color: floowColors.black,
  },

  [theme.breakpoints.down('lg')]: {
    gap: rem(10),
    paddingBottom: rem(14),

    '& img': {
      width: rem(28),
      height: rem(28),
    },

    '& > div > div': {
      fontSize: rem(20),
      lineHeight: rem(20),
    },
  },

  [theme.breakpoints.down('md')]: {
    gap: rem(8),
    paddingBottom: rem(12),

    '& img': {
      width: rem(24),
      height: rem(24),
    },

    '& > div > div': {
      fontSize: rem(18),
      lineHeight: rem(18),
    },
  },

  [theme.breakpoints.down('sm')]: {
    gap: rem(6),
    paddingBottom: rem(10),

    '& img': {
      width: rem(20),
      height: rem(20),
    },

    '& > div > div': {
      fontSize: rem(14),
      lineHeight: rem(14),
    },
  },
}));
