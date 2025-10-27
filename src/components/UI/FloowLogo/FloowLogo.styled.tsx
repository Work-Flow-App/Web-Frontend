import { styled, Box } from '@mui/material';
import type { FloowLogoVariant } from './FloowLogo.types';

interface ContainerProps {
  variant?: FloowLogoVariant;
}

interface LogoTextProps {
  variant?: FloowLogoVariant;
}

export const Container = styled(Box)<ContainerProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

export const LogoIcon = styled('img')(() => ({
  width: '66px',
  height: '66px',
  flexShrink: 0,
}));

export const LogoText = styled(Box)<LogoTextProps>(({ variant = 'light' }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '60px',
  fontWeight: 500,
  lineHeight: '72px',
  fontFamily: "'Safiro', 'Manrope', Arial, sans-serif",
  whiteSpace: 'nowrap',
  ...(variant === 'white' ? {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } : {
    color: '#000000',
  }),
}));
