import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const BannerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(24)} ${rem(32)}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  marginBottom: rem(24),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: rem(20),
    padding: rem(20),
  },
}));

export const LeftSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(20),
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  width: rem(56),
  height: rem(56),
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  border: `${rem(1)} solid ${theme.palette.grey[200]}`,
}));

export const LogoImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const FallbackLogo = styled(Box)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

export const TextContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const CompanyNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(22),
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
}));

export const CompanyTaglineText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  lineHeight: 1.3,
}));

export const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));

export const ActionButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'primary',
})<{ primary?: boolean }>(({ theme, primary }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),
  padding: `${rem(10)} ${rem(18)}`,
  borderRadius: rem(10),
  fontSize: rem(14),
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  userSelect: 'none',
  border: primary ? 'none' : `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: primary ? theme.palette.primary.main : theme.palette.background.paper,
  color: primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: primary ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
  '&:hover': {
    backgroundColor: primary ? theme.palette.primary.dark : theme.palette.grey[50],
    transform: 'translateY(-1px)',
    boxShadow: primary ? '0 6px 16px rgba(99, 102, 241, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    flex: 1,
    textAlign: 'center',
  },
}));
