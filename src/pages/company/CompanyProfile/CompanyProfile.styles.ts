import { Box, Typography, Tabs, Tab, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const SectionsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  alignItems: 'start',
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

interface FieldValueProps {
  $empty?: boolean;
}

export const FieldValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$empty',
})<FieldValueProps>(({ theme, $empty }) => ({
  fontSize: rem(15),
  fontWeight: 400,
  fontStyle: $empty ? 'italic' : 'normal',
  color: $empty
    ? theme.palette.colors?.grey_400 || theme.palette.text.disabled
    : theme.palette.colors?.grey_900 || theme.palette.text.primary,
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
  },
}));

export const EmptySectionState = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
  padding: `${rem(12)} 0 ${rem(4)}`,
}));

export const EmptySectionText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_400 || theme.palette.text.disabled,
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

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.divider}`,
  marginBottom: rem(32),
  '@media (max-width: 1366px)': {
    marginBottom: rem(24),
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: rem(44),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: rem(2),
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 500,
  fontSize: rem(14),
  textTransform: 'none',
  minHeight: rem(44),
  padding: `0 ${rem(4)}`,
  marginRight: rem(28),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  '&.Mui-selected': {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

export const TabContent = styled(Box)(() => ({
  width: '100%',
}));
