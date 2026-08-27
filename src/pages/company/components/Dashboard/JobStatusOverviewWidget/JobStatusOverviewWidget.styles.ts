import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  padding: rem(20),
  display: 'flex',
  flexDirection: 'column',
  height: rem(380),
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  boxSizing: 'border-box',
}));

export const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: rem(16),
  flexShrink: 0,
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  flex: 1,
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: rem(20),
  },
}));

export const ChartContainer = styled(Box)(() => ({
  width: rem(160),
  height: rem(160),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const LegendContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
}));

export const LegendItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(24),
  width: rem(180),
}));

export const LegendLabel = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const ColorDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  width: rem(10),
  height: rem(10),
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
}));

export const StatusName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
}));

export const StatusValueText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const StatusPercentage = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginLeft: rem(4),
}));
