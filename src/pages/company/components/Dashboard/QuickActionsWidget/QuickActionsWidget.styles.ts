import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  padding: rem(20),
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  boxSizing: 'border-box',
  marginTop: rem(24),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
  marginBottom: rem(16),
}));

export const ActionsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: rem(16),
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  padding: `${rem(12)} ${rem(16)}`,
  borderRadius: rem(12),
  border: `${rem(1)} solid ${theme.palette.grey[200]}`,
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.grey[50],
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.02)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorType',
})<{ colorType?: 'info' | 'success' | 'warning' | 'error' | 'primary' }>(({ colorType }) => {
  let bg = '#E0F2FE';
  let fg = '#0284C7';
  if (colorType === 'success') {
    bg = '#D1FAE5';
    fg = '#059669';
  } else if (colorType === 'warning') {
    bg = '#FEF3C7';
    fg = '#D97706';
  } else if (colorType === 'error') {
    bg = '#FEE2E2';
    fg = '#EF4444';
  } else if (colorType === 'primary') {
    bg = '#E0E7FF';
    fg = '#4F46E5';
  }
  return {
    width: rem(36),
    height: rem(36),
    borderRadius: rem(8),
    backgroundColor: bg,
    color: fg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': {
      fontSize: rem(18),
    },
  };
});

export const TextWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  flex: 1,
}));

export const ActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ActionSubLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(10),
  color: theme.palette.text.secondary,
}));
