import { styled, Box } from '@mui/material';
import { rem } from '../Typography/utility';

interface PageContainerProps {
  maxWidth?: string | number;
}

export const PageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<PageContainerProps>(({ theme, maxWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: maxWidth || '100%',
  margin: '0 auto',
  padding: theme.spacing(1),

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.75),
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  },
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2.5),
  gap: theme.spacing(1.5),
  background: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: '8px 8px 0px 0px',
  width: '100%',
  boxSizing: 'border-box',

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: rem(12),
  width: '100%',

  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    gap: rem(10),
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: rem(10),
  },
}));

export const HeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  flex: 1,
  minWidth: 0, // allows text children to truncate

  [theme.breakpoints.down('md')]: {
    flex: '1 1 0',
    minWidth: rem(160),
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flex: 'none',
  },
}));

export const HeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexShrink: 0,
  flexWrap: 'wrap',

  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1),
    justifyContent: 'flex-end',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
  },
}));

export const Title = styled('h1')(({ theme }) => ({
  margin: `${rem(-2)} 0`,
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(24),
  lineHeight: rem(33),
  letterSpacing: '0.005em',
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',

  [theme.breakpoints.down('md')]: {
    fontSize: rem(20),
    lineHeight: rem(28),
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(18),
    lineHeight: rem(24),
  },
}));

export const Description = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(16),
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',

  [theme.breakpoints.down('md')]: {
    fontSize: rem(14),
    lineHeight: rem(20),
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(13),
    lineHeight: rem(18),
  },
}));

export const FilterButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(48),
  height: rem(48),
  borderRadius: rem(6),
  border: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: theme.palette.colors?.white || theme.palette.background.paper,
  flexShrink: 0,

  '&:hover': {
    borderColor: theme.palette.colors?.grey_200 || theme.palette.grey[200],
    background: theme.palette.colors?.grey_50 || theme.palette.grey[50],
  },

  '&:active': {
    transform: 'scale(0.98)',
  },

  [theme.breakpoints.down('sm')]: {
    width: rem(40),
    height: rem(40),
  },
}));

export const PageContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  background: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: '0px 0px 8px 8px',
  minHeight: rem(200),
  padding: `0 ${theme.spacing(2.5)}`,
  paddingBottom: theme.spacing(2.5),
  boxSizing: 'border-box',

  [theme.breakpoints.down('md')]: {
    padding: `0 ${theme.spacing(2)}`,
    paddingBottom: theme.spacing(2),
  },

  [theme.breakpoints.down('sm')]: {
    padding: `0 ${theme.spacing(1.5)}`,
    paddingBottom: theme.spacing(1.5),
  },
}));

export const DropdownWrapper = styled(Box)(({ theme }) => ({
  minWidth: rem(200),
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    minWidth: rem(160),
    width: '100%',
  },
}));
