import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  width: '100%',
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  padding: rem(40),
  '@media (max-width: 1536px)': {
    padding: rem(32),
  },
  '@media (max-width: 1366px)': {
    padding: rem(24),
  },
}));

export const DashboardHeader = styled(Box)(() => ({
  marginBottom: rem(32),
}));

export const DashboardGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: rem(24),
  width: '100%',
  marginBottom: rem(32),
  '@media (max-width: 1366px)': {
    gap: rem(20),
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  },
}));

export const ChartsContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: rem(24),
  width: '100%',
  '@media (max-width: 1366px)': {
    gap: rem(20),
    gridTemplateColumns: '1fr',
  },
}));

export const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  padding: rem(24),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  '@media (max-width: 1366px)': {
    padding: rem(20),
  },
}));

export const ChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  padding: rem(24),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  '@media (max-width: 1366px)': {
    padding: rem(20),
  },
}));

export const ChartTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  marginBottom: rem(20),
  '@media (max-width: 1366px)': {
    fontSize: rem(16),
    marginBottom: rem(16),
  },
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(40),
  fontWeight: 700,
  color: theme.palette.primary.main,
  lineHeight: 1.2,
  marginBottom: rem(8),
  '@media (max-width: 1536px)': {
    fontSize: rem(36),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(32),
  },
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
  },
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(200),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(32),
  fontWeight: theme.typography.fontWeightBold || 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  lineHeight: 1.2,
  '@media (max-width: 1536px)': {
    fontSize: rem(28),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(26),
  },
}));
