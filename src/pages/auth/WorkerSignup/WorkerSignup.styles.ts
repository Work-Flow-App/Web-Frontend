import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const SignupContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  overflow: 'hidden',
  padding: `${rem(20)} ${rem(40)}`,
  gap: rem(20),
  '@media (max-width: 1920px)': {
    padding: `${rem(16)} ${rem(32)}`,
    gap: rem(16),
  },
  '@media (max-width: 1536px)': {
    padding: `${rem(12)} ${rem(24)}`,
    gap: rem(12),
  },
  '@media (max-width: 1366px)': {
    padding: `${rem(10)} ${rem(20)}`,
    gap: rem(10),
  },
});

export const LeftSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: `${rem(40)} ${rem(40)} ${rem(30)} ${rem(40)}`,
  gap: rem(16),
  minWidth: rem(380),
  maxWidth: rem(550),
  width: '100%',
  maxHeight: '100%',
  flex: '0 0 auto',
  order: 0,
  alignSelf: 'stretch',
  backgroundColor: '#FFFFFF',
  overflow: 'auto',
  borderRadius: rem(16),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08), 0px 2px 8px rgba(0, 0, 0, 0.04)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  '@media (min-width: 1921px)': {
    padding: `${rem(50)} ${rem(50)} ${rem(40)} ${rem(50)}`,
    gap: rem(24),
    maxWidth: rem(625),
    borderRadius: rem(20),
  },
  '@media (max-width: 1536px)': {
    padding: `${rem(32)} ${rem(32)} ${rem(24)} ${rem(32)}`,
    gap: rem(14),
    minWidth: rem(360),
    maxWidth: rem(480),
    borderRadius: rem(14),
  },
  '@media (max-width: 1366px)': {
    padding: `${rem(28)} ${rem(24)} ${rem(20)} ${rem(24)}`,
    gap: rem(12),
    minWidth: rem(340),
    maxWidth: rem(420),
    borderRadius: rem(12),
  },
});

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: rem(16),
  width: '100%',
  maxWidth: rem(420),
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  '@media (min-width: 1921px)': {
    gap: rem(24),
    maxWidth: rem(465),
  },
  '@media (max-width: 1536px)': {
    gap: rem(14),
    maxWidth: rem(400),
  },
  '@media (max-width: 1366px)': {
    gap: rem(12),
    maxWidth: rem(360),
  },
});

export const HeaderSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${rem(20)} ${rem(16)} ${rem(16)} ${rem(16)}`,
  gap: rem(8),
  width: '100%',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  marginBottom: rem(8),
  '@media (min-width: 1921px)': {
    gap: rem(12),
    padding: `${rem(24)} ${rem(20)} ${rem(20)} ${rem(20)}`,
    marginBottom: rem(12),
  },
  '@media (max-width: 1536px)': {
    gap: rem(6),
    padding: `${rem(16)} ${rem(14)} ${rem(14)} ${rem(14)}`,
  },
  '@media (max-width: 1366px)': {
    gap: rem(6),
    padding: `${rem(14)} ${rem(12)} ${rem(12)} ${rem(12)}`,
  },
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: 700,
  color: theme.palette.grey[900],
  lineHeight: '1.3',
  textAlign: 'center',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  position: 'relative',
  padding: `${rem(8)} 0`,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: rem(60),
    height: rem(3),
    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
    borderRadius: rem(2),
  },
  '@media (min-width: 1921px)': {
    fontSize: rem(28),
    '&::after': {
      width: rem(70),
      height: rem(4),
    },
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(22),
    '&::after': {
      width: rem(55),
    },
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(20),
    '&::after': {
      width: rem(50),
    },
  },
}));

export const Subtitle = styled(Typography)(() => ({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(13),
  lineHeight: rem(18),
  textAlign: 'center',
  letterSpacing: '0.01em',
  color: '#64748b',
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,
  marginTop: rem(8),
  '@media (min-width: 1921px)': {
    fontSize: rem(14),
    lineHeight: rem(20),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(12),
    lineHeight: rem(17),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(11),
    lineHeight: rem(16),
  },
}));

export const FormWrapper = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  width: '100%',
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

export const DividerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  width: '100%',
  margin: `${rem(4)} 0`,
  '@media (min-width: 1921px)': {
    gap: rem(18),
    margin: `${rem(6)} 0`,
  },
  '@media (max-width: 1536px)': {
    gap: rem(14),
    margin: `${rem(3)} 0`,
  },
  '@media (max-width: 1366px)': {
    gap: rem(12),
    margin: `${rem(2)} 0`,
  },
});

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: rem(1),
  background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
}));

export const DividerText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 500,
  color: '#94a3b8',
  letterSpacing: '0.02em',
  '@media (min-width: 1921px)': {
    fontSize: rem(14),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(11),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(10),
  },
}));

export const SignInLink = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 500,
  color: '#64748b',
  textAlign: 'center',
  '& a': {
    color: '#1976d2',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#2196f3',
      textDecoration: 'none',
    },
  },
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
  },
}));

export const ErrorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(40),
  gap: rem(20),
  textAlign: 'center',
  width: '100%',
});

export const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: 700,
  color: '#ef4444',
  lineHeight: '1.3',
  letterSpacing: '-0.02em',
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 500,
  color: '#64748b',
  lineHeight: '1.6',
  maxWidth: rem(400),
}));
