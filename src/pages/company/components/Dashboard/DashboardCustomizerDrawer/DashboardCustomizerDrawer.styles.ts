import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const DrawerContent = styled(Box)(({ theme }) => ({
  width: rem(320),
  padding: rem(24),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  boxSizing: 'border-box',
}));

export const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: rem(16),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  marginBottom: rem(16),
}));

export const DrawerTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const DrawerSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  marginBottom: rem(20),
}));

export const WidgetsList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  flex: 1,
  overflowY: 'auto',
}));

export const WidgetItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(12)} ${rem(16)}`,
  borderRadius: rem(10),
  border: `${rem(1)} solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[50],
  transition: 'border-color 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: '#fff',
  },
}));

export const WidgetInfoText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
  marginTop: rem(16),
  marginBottom: rem(8),
}));

export const Footer = styled(Box)(({ theme }) => ({
  paddingTop: rem(16),
  borderTop: `${rem(1)} solid ${theme.palette.divider}`,
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
}));

export const FooterButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'primary',
})<{ primary?: boolean }>(({ theme, primary }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(10)} ${rem(16)}`,
  borderRadius: rem(8),
  fontSize: rem(13),
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
  userSelect: 'none',
  transition: 'all 0.15s ease-in-out',
  border: primary ? 'none' : `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.paper,
  color: primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: primary ? theme.palette.primary.dark : theme.palette.grey[50],
  },
}));
