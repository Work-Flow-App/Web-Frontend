import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box, Avatar } from '@mui/material';
import { rem } from '../components/UI/Typography/utility';

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
  color: theme.palette.colors.grey_300,
  fontSize: rem(20),
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s ease',

  '&:hover': {
    color: theme.palette.colors.grey_100,
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
  backgroundColor: theme.palette.colors.grey_600,
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
