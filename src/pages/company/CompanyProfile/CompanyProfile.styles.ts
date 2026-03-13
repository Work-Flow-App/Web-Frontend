import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

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

export const PageHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: rem(32),
  '@media (max-width: 1366px)': {
    marginBottom: rem(24),
  },
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

export const HeaderActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const SectionsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  gap: rem(24),
  width: '100%',
  '@media (max-width: 1366px)': {
    gap: rem(20),
    gridTemplateColumns: '1fr',
  },
}));

export const SectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  padding: rem(28),
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
  '@media (max-width: 1366px)': {
    padding: rem(20),
    gap: rem(16),
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  paddingBottom: rem(12),
  borderBottom: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  '@media (max-width: 1366px)': {
    fontSize: rem(15),
    paddingBottom: rem(10),
  },
}));

export const FieldRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: 400,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
  },
}));

export const FieldsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: rem(16),
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(300),
}));
