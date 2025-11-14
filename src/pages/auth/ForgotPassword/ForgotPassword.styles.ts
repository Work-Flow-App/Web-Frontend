import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const ForgotPasswordContainer = styled(Box)({
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

export const RightSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `${rem(30)} ${rem(20)}`,
  gap: rem(40),
  flex: '1 1 auto',
  minWidth: 0,
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(/futuristic-demo.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#000000',
  borderRadius: rem(16),
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 1536px)': {
    padding: `${rem(24)} ${rem(16)}`,
    gap: rem(32),
  },
  '@media (max-width: 1366px)': {
    padding: `${rem(20)} ${rem(12)}`,
    gap: rem(28),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent ${rem(2)},
        rgba(255, 255, 255, 0.03) ${rem(2)},
        rgba(255, 255, 255, 0.03) ${rem(4)}
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent ${rem(2)},
        rgba(255, 255, 255, 0.03) ${rem(2)},
        rgba(255, 255, 255, 0.03) ${rem(4)}
      )
    `,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

export const RightContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  gap: rem(40),
  width: '100%',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  position: 'relative',
  zIndex: 1,
  '@media (max-width: 1536px)': {
    gap: rem(32),
  },
  '@media (max-width: 1366px)': {
    gap: rem(28),
  },
});

export const BrandSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(20),
  width: '100%',
  maxWidth: rem(800),
});

export const Tagline = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: 600,
  color: theme.palette.common.white,
  textAlign: 'center',
  lineHeight: '1.4',
  '@media (max-width: 1536px)': {
    fontSize: rem(20),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(18),
  },
}));

export const FeaturesGrid = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  isolation: 'isolate',
  width: '100%',
  maxWidth: rem(1083),
  height: rem(416),
  flex: 'none',
  order: 1,
  flexGrow: 0,
  zIndex: 1,
  justifyContent: 'center',
  '@media (max-width: 1536px)': {
    maxWidth: rem(900),
    height: rem(360),
    transform: 'scale(0.9)',
  },
  '@media (max-width: 1366px)': {
    maxWidth: rem(780),
    height: rem(320),
    transform: 'scale(0.8)',
  },
  '& > div': {
    flex: '0 0 auto',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  '& > div.card-left': {
    order: 0,
    zIndex: 1,
    marginRight: rem(-80),
    opacity: 0.7,
    transform: 'scale(1)',
  },
  '& > div.card-center': {
    order: 1,
    zIndex: 2,
    transform: 'scale(1.05)',
    opacity: 1,
  },
  '& > div.card-right': {
    order: 2,
    zIndex: 1,
    marginLeft: rem(-80),
    opacity: 0.7,
    transform: 'scale(1)',
  },
});
