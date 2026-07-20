import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const LogoRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(20),
  flexWrap: 'wrap',
}));

export const LogoPreview = styled(Box)(({ theme }) => ({
  width: rem(88),
  height: rem(88),
  minWidth: rem(88),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

export const LogoImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const LogoInitials = styled(Typography)(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: 700,
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
}));

export const LogoActions = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
}));

export const LogoButtonRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const LogoHint = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));
