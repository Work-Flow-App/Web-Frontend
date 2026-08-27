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

export const ActionLink = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
  },
}));

export const AnnouncementsList = styled(Box)(() => ({
  width: '100%',
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: rem(14),
}));

export const AnnouncementItem = styled(Box)(({ theme }) => ({
  borderRadius: rem(12),
  border: `${rem(1)} solid ${theme.palette.grey[100]}`,
  padding: rem(16),
  backgroundColor: theme.palette.grey[50],
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.grey[200],
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
  },
}));

export const ItemHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: rem(12),
}));

export const ItemTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ItemMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

export const ItemContent = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
  lineHeight: 1.4,
}));
