import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const TabHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: rem(16),
  marginBottom: rem(20),
  flexWrap: 'wrap',
}));

export const TabHeaderText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const TabTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const TabDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));

export const ComposeBox = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  width: '100%',
  padding: rem(12),
  marginBottom: rem(20),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(24),
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(14),
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  },
  '& svg': {
    marginLeft: 'auto',
    color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
    flexShrink: 0,
  },
}));

export const ComposeAvatar = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  minWidth: rem(36),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: rem(13),
  fontWeight: 700,
  flexShrink: 0,
}));

export const FeedList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: rem(160),
  borderRadius: rem(12),
  border: `1px dashed ${theme.palette.colors?.grey_200 || theme.palette.grey[300]}`,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(14),
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(160),
}));
