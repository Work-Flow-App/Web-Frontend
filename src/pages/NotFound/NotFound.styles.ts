import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '100%',
  backgroundColor: theme.palette.common.white,
  padding: rem(40),
  '@media (max-width: 1536px)': {
    padding: rem(32),
  },
  '@media (max-width: 1366px)': {
    padding: rem(24),
  },
}));

export const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(32),
  maxWidth: rem(600),
  textAlign: 'center',
  '@media (min-width: 1921px)': {
    gap: rem(40),
    maxWidth: rem(700),
  },
  '@media (max-width: 1536px)': {
    gap: rem(28),
    maxWidth: rem(550),
  },
  '@media (max-width: 1366px)': {
    gap: rem(24),
    maxWidth: rem(500),
  },
});

export const ImageWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: rem(400),
    objectFit: 'contain',
  },
  '@media (min-width: 1921px)': {
    '& img': {
      maxHeight: rem(500),
    },
  },
  '@media (max-width: 1536px)': {
    '& img': {
      maxHeight: rem(350),
    },
  },
  '@media (max-width: 1366px)': {
    '& img': {
      maxHeight: rem(300),
    },
  },
});

export const TextWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(12),
  '@media (min-width: 1921px)': {
    gap: rem(16),
  },
  '@media (max-width: 1536px)': {
    gap: rem(10),
  },
  '@media (max-width: 1366px)': {
    gap: rem(8),
  },
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(32),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.grey[900],
  lineHeight: '1.2',
  '@media (min-width: 1921px)': {
    fontSize: rem(40),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(28),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(26),
  },
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(16),
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  color: theme.palette.grey[700],
  maxWidth: rem(400),
  '@media (min-width: 1921px)': {
    fontSize: rem(18),
    lineHeight: rem(28),
    maxWidth: rem(500),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(15),
    lineHeight: rem(22),
    maxWidth: rem(380),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
    lineHeight: rem(20),
    maxWidth: rem(350),
  },
}));

export const ButtonWrapper = styled(Box)({
  display: 'flex',
  gap: rem(16),
  marginTop: rem(8),
  '@media (min-width: 1921px)': {
    gap: rem(20),
    marginTop: rem(12),
  },
  '@media (max-width: 1536px)': {
    gap: rem(14),
    marginTop: rem(6),
  },
  '@media (max-width: 1366px)': {
    gap: rem(12),
    marginTop: rem(4),
  },
});
