import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const SignupContainer = styled(Box)({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#FFFFFF',
  overflow: 'hidden',
  padding: `${rem(20)} ${rem(20)} ${rem(20)} 0`,
});

// Frame 20 - Left Section
// From Figma: width: 625px, height: 1040px, padding: 40px 80px, gap: 60px
export const LeftSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: `${rem(40)} ${rem(80)}`,
  gap: rem(60),
  width: rem(625),
  height: rem(1040),
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  backgroundColor: '#FFFFFF',
});

// Frame 1604
export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: rem(40),
  width: rem(465),
  height: rem(878),
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 1,
});

export const HeaderSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: rem(16),
  width: '100%',
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
});

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(36),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.grey[900],
  lineHeight: '1.2',
  textAlign: 'center',
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
}));

export const Subtitle = styled(Typography)(() => ({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: rem(16),
  lineHeight: rem(24),
  textAlign: 'center',
  letterSpacing: '0.005em',
  color: '#525252',
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,
}));

export const FormWrapper = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
  width: '100%',
});

export const DividerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  width: '100%',
  margin: `${rem(8)} 0`,
});

export const DividerLine = styled(Box)(({ theme }) => ({
  flex: 1,
  height: rem(1),
  backgroundColor: theme.palette.grey[300],
}));

export const DividerText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[500],
}));

export const SignInLink = styled(Box)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[700],
  textAlign: 'center',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

// Frame 1627 - Right Section
// From Figma: width: 1245px, height: 1040px, padding: 0px, gap: 40px
export const RightSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `${rem(30)} 0`,
  gap: rem(40),
  width: rem(1245),
  flex: 1,
  background: `linear-gradient(0deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(/futuristic-demo.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#000000',
  borderRadius: rem(16),
  position: 'relative',
  overflow: 'hidden',
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

// Frame 1628
export const RightContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `0 ${rem(60)}`,
  gap: rem(50),
  width: '100%',
  maxWidth: rem(1245),
  flex: 'none',
  order: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
  position: 'relative',
  zIndex: 1,
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
}));

// Frame 1624 - Features Container with overlapping cards
export const FeaturesGrid = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  isolation: 'isolate',
  width: rem(1083),
  height: rem(416),
  flex: 'none',
  order: 1,
  flexGrow: 0,
  zIndex: 1,
  justifyContent: 'center',
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

export const FooterText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[500],
  textAlign: 'center',
  marginTop: rem(24),
  '& a': {
    color: '#FB2C36',
    textDecoration: 'none',
    fontWeight: 600,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export const GoogleButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  width: '100%',
  height: rem(51),
  padding: `${rem(12)} ${rem(16)}`,
  backgroundColor: theme.palette.common.white,
  border: `${rem(1)} solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.grey[900],
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.grey[400],
  },
  '& svg': {
    width: rem(20),
    height: rem(20),
  },
}));
