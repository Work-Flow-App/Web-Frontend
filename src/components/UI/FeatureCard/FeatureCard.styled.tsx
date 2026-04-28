import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

interface CardWrapperProps {
  background?: string;
  borderColor?: string;
}

export const CardWrapper = styled(Box)<CardWrapperProps>(({ background, borderColor }) => {
  const bgColor = background || floowColors.glass.background;
  const borderClr = borderColor || floowColors.glass.border;

  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${rem(30)} ${rem(20)}`,
    gap: rem(20),
    width: rem(379),
    minHeight: rem(416),
    background: bgColor,
    border: `${rem(3)} solid ${borderClr}`,
    boxShadow: `0 ${rem(16)} ${rem(24)} ${floowColors.blackAlpha[50]}`,
    backdropFilter: `blur(${rem(20)})`,
    WebkitBackdropFilter: `blur(${rem(20)})`,
    borderRadius: rem(16),
    cursor: 'default',
    transition: 'all 0.3s ease-in-out',

    '&:hover': {
      transform: `translateY(${rem(-4)})`,
      boxShadow: `0 ${rem(20)} ${rem(32)} ${floowColors.blackAlpha[60]}`,
    },

    '@media (max-width: 1536px)': {
      width: rem(320),
      minHeight: rem(370),
      padding: `${rem(24)} ${rem(16)}`,
      gap: rem(16),
    },
    '@media (max-width: 1366px)': {
      width: rem(270),
      minHeight: rem(320),
      padding: `${rem(20)} ${rem(14)}`,
      gap: rem(14),
    },
    '@media (max-width: 1024px)': {
      width: rem(260),
      minHeight: rem(300),
      padding: `${rem(20)} ${rem(14)}`,
      gap: rem(14),
      borderRadius: rem(12),
      border: `${rem(2)} solid ${borderClr}`,
    },
  };
});

export const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: rem(10),

  '& svg': {
    fontSize: rem(48),
    color: floowColors.white,
  },

  '& img': {
    width: rem(48),
    height: rem(48),
  },
}));

export const Title = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: rem(30),
  lineHeight: rem(41),
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: floowColors.white,
  width: 'auto',
  maxWidth: '100%',
  '@media (max-width: 1536px)': {
    fontSize: rem(24),
    lineHeight: rem(33),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(20),
    lineHeight: rem(28),
  },
  '@media (max-width: 1024px)': {
    fontSize: rem(20),
    lineHeight: rem(28),
  },
}));

export const Description = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: rem(24),
  lineHeight: rem(33),
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: floowColors.white,
  alignSelf: 'stretch',
  whiteSpace: 'pre-line',
  '@media (max-width: 1536px)': {
    fontSize: rem(18),
    lineHeight: rem(26),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(15),
    lineHeight: rem(22),
  },
  '@media (max-width: 1024px)': {
    fontSize: rem(14),
    lineHeight: rem(20),
  },
}));
