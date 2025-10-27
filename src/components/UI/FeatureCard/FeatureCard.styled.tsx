import { styled, Box } from '@mui/material';

interface CardWrapperProps {
  background?: string;
  borderColor?: string;
}

export const CardWrapper = styled(Box)<CardWrapperProps>(({ background, borderColor }) => {
  const bgColor = background || 'rgba(255, 255, 255, 0.02)';
  const borderClr = borderColor || 'rgba(255, 255, 255, 0.25)';

  return {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px',
    gap: '20px',
    width: '379px',
    minHeight: '416px',
    background: bgColor,
    border: `3px solid ${borderClr}`,
    boxShadow: '0px 16px 24px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)', // Safari support
    borderRadius: '16px',
    cursor: 'default',
    transition: 'all 0.3s ease-in-out',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0px 20px 32px rgba(0, 0, 0, 0.6)',
    },
  };
});

export const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',

  '& svg': {
    fontSize: '48px',
    color: '#FFFFFF',
  },

  '& img': {
    width: '48px',
    height: '48px',
  },
}));

export const Title = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '30px',
  lineHeight: '41px',
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: '#FFFFFF',
  width: 'auto',
  maxWidth: '100%',
}));

export const Description = styled(Box)(() => ({
  fontFamily: "'Manrope', sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '24px',
  lineHeight: '33px',
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: '#FFFFFF',
  alignSelf: 'stretch',
  whiteSpace: 'pre-line', // Preserves line breaks from \n
}));
