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

export const CellStack = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
}));

export const CellPrimaryText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const CellSecondaryText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));
