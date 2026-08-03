import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(16),
  padding: rem(20),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.background.paper,
  flexWrap: 'wrap',
}));

export const MainCol = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
});

export const LabelRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
});

export const Label = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.4),
}));

export const HoursValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  '& span': {
    fontSize: rem(14),
    fontWeight: 500,
    color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
    marginLeft: rem(6),
  },
}));

export const WeekRangeRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
});

export const WeekRangeLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
}));

export const NavButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  border: 'none',
  background: 'transparent',
  color: theme.palette.colors?.grey_600 || theme.palette.text.secondary,
  cursor: 'pointer',
  padding: 0,
  '& svg': {
    fontSize: rem(16),
  },
  '&:hover': {
    background: theme.palette.colors?.grey_100 || theme.palette.action.hover,
  },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
}));
