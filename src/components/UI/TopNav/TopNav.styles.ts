import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

/**
 * Outer wrapper (follows HeaderNav pattern)
 */
export const TopNavOuterWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: rem(10),
  width: '100%',
  maxWidth: rem(1920),
  boxSizing: 'border-box',
  background: floowColors.grey[100],
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('xl')]: {
    padding: 0,
  },

  [theme.breakpoints.down('md')]: {
    padding: 0,
  },
}));

/**
 * Main top navigation inner container
 */
export const TopNavWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: `${rem(10)} ${rem(20)}`,
  gap: rem(12),
  width: '100%',
  height: rem(64),
  background: floowColors.dark.slate,
  borderRadius: 0,
  borderBottom: `${rem(1)} solid ${floowColors.grey[200]}`,
  boxSizing: 'border-box',
  flexShrink: 0,
  flexGrow: 0,

  [theme.breakpoints.down('xl')]: {
    padding: `${rem(10)} ${rem(16)}`,
    gap: rem(10),
    height: rem(60),
  },

  [theme.breakpoints.down('lg')]: {
    padding: `${rem(8)} ${rem(12)}`,
    gap: rem(8),
    height: rem(56),
  },

  [theme.breakpoints.down('md')]: {
    gap: rem(8),
    padding: `${rem(8)} ${rem(10)}`,
    height: rem(52),
  },

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(6)} ${rem(8)}`,
    height: rem(48),
    gap: rem(6),
  },
}));

/**
 * Left content section (mobile sidebar toggle)
 */
export const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: rem(12),
  flexShrink: 0,
  marginRight: 'auto',

  [theme.breakpoints.down('sm')]: {
    marginRight: 'auto',
  },
}));

/**
 * Center content section (mobile logo and text)
 */
export const CenterSection = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),
  flexShrink: 0,
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));

/**
 * Right content section (notification, user profile, actions, etc.)
 */
export const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: rem(12),
  flexShrink: 0,

  [theme.breakpoints.down('lg')]: {
    gap: rem(10),
  },

  [theme.breakpoints.down('md')]: {
    gap: rem(8),
  },

  [theme.breakpoints.down('sm')]: {
    gap: rem(6),
  },
}));
