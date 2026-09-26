import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../../components/UI/Typography/utility';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  width: '100%',
}));

export const AddRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const GroupList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
}));

export const GroupRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(8),
  minHeight: rem(48),
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
}));

export const GroupName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 500,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const GroupActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  flexShrink: 0,
}));

export const ConfirmText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
}));

export const EmptyText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  textAlign: 'center',
  padding: `${rem(16)} 0`,
}));
