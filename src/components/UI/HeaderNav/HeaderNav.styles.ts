import { styled, Box, Avatar } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

// Main container - Frame 2095585045
export const HeaderNavWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: rem(20),
  gap: rem(10),
  width: '100%',
  maxWidth: rem(1920),
  height: rem(124),
  boxSizing: 'border-box',
  background: floowColors.grey[100], // Light background
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('xl')]: {
    padding: rem(16),
    height: 'auto',
  },

  [theme.breakpoints.down('md')]: {
    padding: rem(12),
  },
}));

// Seller HeadNav container
export const HeaderNavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${rem(10)} ${rem(20)}`,
  gap: rem(12),
  width: '100%',
  height: rem(84),
  background: floowColors.black,
  borderRadius: rem(12),
  boxSizing: 'border-box',
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('xl')]: {
    padding: `${rem(10)} ${rem(16)}`,
    gap: rem(10),
    height: rem(80),
  },

  [theme.breakpoints.down('lg')]: {
    padding: `${rem(8)} ${rem(12)}`,
    gap: rem(8),
    height: rem(72),
  },

  [theme.breakpoints.down('md')]: {
    gap: rem(8),
    padding: `${rem(8)} ${rem(10)}`,
    height: rem(64),
  },

  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    height: 'auto',
    minHeight: rem(60),
    gap: rem(8),
  },
}));

// Logo section - Frame 1605 / Asset 1 2
export const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '0px',
  gap: rem(8),
  height: rem(44),
  flexShrink: 0,
  flexGrow: 0,
  minWidth: 'fit-content',

  // Override FloowLogo default styles
  '& > div': {
    gap: `${rem(8)} !important`,
  },

  '& img': {
    width: `${rem(36)} !important`,
    height: `${rem(36)} !important`,
    maxHeight: rem(36),
    objectFit: 'contain',
  },

  '& > div > div': {
    fontSize: `${rem(28)} !important`,
    lineHeight: `${rem(36)} !important`,
    fontWeight: '500 !important',
  },

  [theme.breakpoints.down('md')]: {
    height: rem(36),
    '& img': {
      width: `${rem(32)} !important`,
      height: `${rem(32)} !important`,
    },
    '& > div > div': {
      fontSize: `${rem(24)} !important`,
      lineHeight: `${rem(32)} !important`,
    },
  },

  [theme.breakpoints.down('sm')]: {
    height: rem(32),
    '& img': {
      width: `${rem(28)} !important`,
      height: `${rem(28)} !important`,
    },
    '& > div > div': {
      fontSize: `${rem(20)} !important`,
      lineHeight: `${rem(28)} !important`,
    },
  },
}));

// Controls section (right side icons + user profile)
export const ControlsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '20px',
  height: '44px',
  flexShrink: 0,

  [theme.breakpoints.down('md')]: {
    gap: '12px',
  },

  [theme.breakpoints.down('sm')]: {
    gap: '8px',
  },
}));

// Icon Button (wrapper for icons with their own backgrounds)
export const IconButtonStyled = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  width: 'auto',
  height: '44px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  flexShrink: 0,

  '& svg': {
    width: 'auto',
    height: '100%',
  },

  '&:hover': {
    opacity: 0.8,
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  [theme.breakpoints.down('md')]: {
    height: '40px',
  },
}));

// Notification badge
export const NotificationBadge = styled(Box)(() => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '8px',
  height: '8px',
  background: floowColors.error.main,
  borderRadius: '50%',
  border: `2px solid ${floowColors.black}`,
}));

// Notification count badge
export const NotificationCount = styled(Box)(() => ({
  position: 'absolute',
  top: '6px',
  right: '6px',
  minWidth: '18px',
  height: '18px',
  padding: '0 4px',
  background: floowColors.error.main,
  borderRadius: '9px',
  border: `2px solid ${floowColors.black}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 700,
  color: floowColors.white,
  fontFamily: 'Manrope, sans-serif',
}));

// User profile section - Frame 5
export const UserProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: '10px',
  width: '180px',
  height: '44px',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.3s ease',
  flexShrink: 0,
  flexGrow: 0,

  '&:hover': {
    background: floowColors.grey[900],
  },

  [theme.breakpoints.down('md')]: {
    width: 'auto',
    gap: '8px',
    height: '40px',
  },

  [theme.breakpoints.down('sm')]: {
    width: 'auto',
    gap: '6px',
  },
}));

// User avatar - Rectangle 2
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: '44px',
  height: '44px',
  background: floowColors.grey[900],
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('md')]: {
    width: '40px',
    height: '40px',
    fontSize: '14px',
  },
}));

// User info container - Frame 4
export const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '0px',
  width: '126px',
  height: '44px',
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('md')]: {
    width: 'auto',
    height: '40px',
  },

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

// User name
export const UserName = styled(Box)(() => ({
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.white,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
}));

// Subscription name
export const SubscriptionName = styled(Box)(() => ({
  fontSize: '12px',
  fontWeight: 400,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[400],
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
}));

// Logout button (uses IconButtonStyled as base)
export const LogoutButton = styled(IconButtonStyled)(() => ({
  // Inherits all styles from IconButtonStyled
  // The LogoutIcon component already has the red color styling
}));
