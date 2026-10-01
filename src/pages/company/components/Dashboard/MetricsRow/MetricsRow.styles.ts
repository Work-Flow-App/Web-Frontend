import { Box, Typography, Skeleton, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const MetricsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: rem(16),
  width: '100%',
  marginBottom: rem(24),
  [theme.breakpoints.down('lg')]: {
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
  minHeight: rem(96),
  boxSizing: 'border-box',
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.03)`,
  transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: `translateY(${rem(-2)})`,
    boxShadow: `0 ${rem(4)} ${rem(12)} rgba(0, 0, 0, 0.08)`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${rem(14)} ${rem(14)}`,
  },
}));

export const InfoSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  minWidth: 0,
}));

export const LabelWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const ValueText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'valueColor',
})<{ valueColor?: string }>(({ theme, valueColor }) => ({
  fontSize: rem(26),
  fontWeight: 800,
  color: valueColor || theme.palette.text.primary,
  lineHeight: 1.1,
  marginTop: rem(2),
  [theme.breakpoints.down('xl')]: {
    fontSize: rem(24),
  },
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

export const LoadingInfoSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '60%',
  gap: rem(4),
}));

export const MetricSkeletonTitle = styled(Skeleton)(() => ({
  width: '50%',
  height: rem(14),
  borderRadius: rem(3),
}));

export const MetricSkeletonValue = styled(Skeleton)(() => ({
  width: '80%',
  height: rem(38),
  borderRadius: rem(4),
  marginTop: rem(4),
}));

export const MetricSkeletonTrend = styled(Skeleton)(() => ({
  width: '60%',
  height: rem(14),
  borderRadius: rem(3),
  marginTop: rem(6),
}));

export const MetricSkeletonCircle = styled(Skeleton)(() => ({
  width: rem(44),
  height: rem(44),
  flexShrink: 0,
}));

// Backward compatibility exports
export const MetricsWrapper = Box;
export const MetricsContainer = MetricsGrid;
export const FinancialMetricsContainer = MetricsGrid;
export const FinancialCardContainer = CardContainer;
export const FinancialCardHeader = LabelWrapper;
export const FinancialCardLabel = LabelText;
export const FinancialCardValue = ValueText;
export const FinancialSkeletonWrapper = LoadingInfoSection;
export const FinancialSkeletonLabel = MetricSkeletonTitle;
export const FinancialSkeletonValue = MetricSkeletonValue;

