import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const MetricsContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: rem(16),
  width: '100%',
  marginBottom: rem(24),
  [theme.breakpoints.down('xl')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentColor',
})<{ accentColor?: string }>(({ theme, accentColor }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  borderLeft: `${rem(4)} solid ${accentColor || theme.palette.primary.main}`,
  padding: rem(20),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

export const InfoSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
}));

export const ValueText = styled(Typography)(({ theme }) => ({
  fontSize: rem(32),
  fontWeight: 800,
  color: theme.palette.text.primary,
  lineHeight: 1.1,
}));

export const TrendSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  marginTop: rem(4),
}));

export const TrendText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isPositive',
})<{ isPositive?: boolean }>(({ theme, isPositive }) => ({
  fontSize: rem(11),
  fontWeight: 600,
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
}));

export const IconSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'iconColor',
})<{ bgColor?: string; iconColor?: string }>(({ theme, bgColor, iconColor }) => ({
  width: rem(44),
  height: rem(44),
  borderRadius: '50%',
  backgroundColor: bgColor || theme.palette.primary.light,
  color: iconColor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));
