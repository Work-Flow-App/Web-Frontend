import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const LogoBox = styled(Box)(({ theme }) => ({
  width: rem(88),
  height: rem(88),
  minWidth: rem(88),
  borderRadius: rem(16),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  position: 'relative',
  flex: 'none',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

export const LogoEditButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  right: rem(-6),
  bottom: rem(-6),
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  background: theme.palette.primary.main,
  border: `3px solid ${theme.palette.colors?.white || theme.palette.background.paper}`,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
  '& svg': {
    fontSize: rem(14),
  },
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));
