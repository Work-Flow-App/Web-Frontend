import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box, Avatar, Typography } from '@mui/material';
import { rem } from '../components/Typography/utility';

/**
 * Main page wrapper with sidebar and right section
 */
export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  width: '100%',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

/**
 * Right section containing TopNav and content area
 */
export const PageRightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100vh',
  overflow: 'hidden',

  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

/**
 * Main content area that scrolls independently
 */
export const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  background: theme.palette.colors.grey_50,

  [theme.breakpoints.down('sm')]: {
    overflow: 'visible',
  },
}));

/**
 * Right actions container for TopNav
 */
export const RightActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),

  [theme.breakpoints.down('md')]: {
    gap: rem(10),
  },

  [theme.breakpoints.down('sm')]: {
    gap: rem(8),
  },
}));

/**
 * Action button styling
 */
export const ActionButton = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.mode === 'dark'
    ? theme.palette.text.secondary
    : theme.palette.colors.grey_300,
  fontSize: rem(20),
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s ease',

  '&:hover': {
    color: theme.palette.mode === 'dark'
      ? theme.palette.text.primary
      : theme.palette.colors.grey_100,
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(18),
  },
}));

/**
 * Divider between action buttons
 */
export const ActionDivider = styled(Box)(({ theme }) => ({
  width: rem(1),
  height: rem(24),
  backgroundColor: theme.palette.mode === 'dark'
    ? theme.palette.text.disabled
    : theme.palette.colors.grey_600,
}));

/**
 * User avatar styling
 */
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: rem(32),
  height: rem(32),
  background: theme.palette.colors.white,
  cursor: 'pointer',
  fontSize: rem(12),
  color: theme.palette.colors.black,
  fontWeight: theme.typography.fontWeightBold,
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.8,
  },

  [theme.breakpoints.down('sm')]: {
    width: rem(28),
    height: rem(28),
    fontSize: rem(11),
  },
}));

/**
 * Menu styled wrapper
 */
// eslint-disable-next-line react-refresh/only-export-components
export const menuSx: SxProps<Theme> = {
  mt: 1.5,
  '& .MuiPaper-root': {
    minWidth: rem(180),
    boxShadow: (theme: Theme) => theme.palette.boxShadow.dropDownListShadow,
  },
};

/**
 * Yellow trial badge shown in TopNav right section
 */
export const TrialBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(4)} ${rem(8)}`,

  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const TrialBadgeIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(20),
  height: rem(20),
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FFB300 0%, #FF8C00 100%)',
  boxShadow: '0 2px 6px rgba(255, 140, 0, 0.5)',
  color: '#FFFFFF',
  fontSize: rem(11),
  fontWeight: 800,
  flexShrink: 0,
  lineHeight: 1,
  letterSpacing: '-0.5px',
}));

export const TrialUpgradeButton = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: `${rem(3)} ${rem(10)}`,
  borderRadius: rem(12),
  backgroundColor: 'transparent',
  border: `1px solid #FFA500`,
  color: '#FFD966',
  fontSize: rem(11),
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease',

  '&:hover': {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
  },
}));

export const TrialBadgeText = styled(Typography)(() => ({
  fontSize: rem(12),
  fontWeight: 700,
  color: '#FFD966',
  whiteSpace: 'nowrap',
}));

/**
 * Search container wrapper
 */
// eslint-disable-next-line react-refresh/only-export-components
export const searchContainerSx: SxProps<Theme> = {
  display: { xs: 'none', md: 'flex' },
};

/**
 * Search input styles
 */
// eslint-disable-next-line react-refresh/only-export-components
export const searchStyles = {
  input: {
    height: rem(36),
    padding: `${rem(8)} ${rem(12)}`,
  },
};
