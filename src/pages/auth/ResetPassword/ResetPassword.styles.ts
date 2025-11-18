import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const ResetPasswordContainer = styled(Box)({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
  padding: rem(20),
  gap: rem(20),
  '@media (max-width: 1920px)': {
    padding: rem(16),
    gap: rem(16),
  },
  '@media (max-width: 1536px)': {
    padding: rem(12),
    gap: rem(12),
  },
  '@media (max-width: 1366px)': {
    padding: rem(10),
    gap: rem(10),
  },
});

export const LeftSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: `${rem(30)} ${rem(50)}`,
  gap: rem(24),
  minWidth: rem(380),
  maxWidth: rem(550),
  width: '100%',
  flex: '0 0 auto',
  order: 0,
  alignSelf: 'stretch',
  backgroundColor: '#FFFFFF',
  overflowY: 'auto',
  '@media (min-width: 1921px)': {
    padding: `${rem(40)} ${rem(60)}`,
    gap: rem(40),
    maxWidth: rem(625),
  },
  '@media (max-width: 1536px)': {
    padding: `${rem(24)} ${rem(36)}`,
    gap: rem(20),
    minWidth: rem(360),
    maxWidth: rem(480),
  },
  '@media (max-width: 1366px)': {
    padding: `${rem(20)} ${rem(28)}`,
    gap: rem(16),
    minWidth: rem(340),
    maxWidth: rem(420),
  },
});

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: rem(20),
  width: '100%',
  maxWidth: rem(420),
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  '@media (min-width: 1921px)': {
    gap: rem(32),
    maxWidth: rem(465),
  },
  '@media (max-width: 1536px)': {
    gap: rem(18),
    maxWidth: rem(400),
  },
  '@media (max-width: 1366px)': {
    gap: rem(16),
    maxWidth: rem(360),
  },
});

export const HeaderSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: rem(12),
  width: '100%',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
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
  fontSize: rem(28),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.grey[900],
  lineHeight: '1.2',
  textAlign: 'center',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
  '@media (min-width: 1921px)': {
    fontSize: rem(36),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(26),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(24),
  },
}));

export const Subtitle = styled(Typography)(() => ({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(14),
  lineHeight: rem(20),
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: '#525252',
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
    lineHeight: rem(24),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
    lineHeight: rem(19),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
    lineHeight: rem(18),
  },
}));

export const FormWrapper = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(14),
  width: '100%',
  '@media (min-width: 1921px)': {
    gap: rem(20),
  },
  '@media (max-width: 1536px)': {
    gap: rem(12),
  },
  '@media (max-width: 1366px)': {
    gap: rem(10),
  },
});

export const BackToLoginLink = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.primary.main,
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: rem(8),
  '&:hover': {
    textDecoration: 'underline',
  },
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
    marginTop: rem(12),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
    marginTop: rem(6),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
    marginTop: rem(4),
  },
}));
