import { Box, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { rem } from '../../../components/UI/Typography/utility';

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
}));

export const TopBar = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(14)} ${rem(24)}`,
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
}));

export const BrandLink = styled(Link)(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: 700,
  color: theme.palette.primary.main,
  textDecoration: 'none',
}));

export const SignInButtonLink = styled(Link)(({ theme }) => ({
  padding: `${rem(8)} ${rem(18)}`,
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  fontSize: rem(13),
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}0D`,
  },
}));

export const Content = styled(Box)(() => ({
  maxWidth: rem(680),
  margin: '0 auto',
  padding: `${rem(24)} ${rem(16)} ${rem(64)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
}));

export const ProfileCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(16),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  overflow: 'hidden',
}));

export const CoverBanner = styled(Box)(({ theme }) => ({
  height: rem(96),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
}));

export const ProfileHeaderRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(16),
  padding: `0 ${rem(24)} ${rem(24)}`,
}));

export const LogoCircle = styled(Box)(({ theme }) => ({
  width: rem(84),
  height: rem(84),
  minWidth: rem(84),
  borderRadius: '50%',
  border: `4px solid ${theme.palette.colors?.white || theme.palette.background.paper}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  marginTop: rem(-42),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

export const LogoImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const LogoInitials = styled(Typography)(({ theme }) => ({
  fontSize: rem(26),
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

export const ProfileInfo = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  paddingTop: rem(12),
  minWidth: 0,
}));

export const CompanyName = styled(Typography)(({ theme }) => ({
  fontSize: rem(22),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const Tagline = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
}));

export const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(16),
  fontSize: rem(13),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  '& svg': {
    fontSize: rem(15),
    verticalAlign: 'middle',
    marginRight: rem(4),
  },
}));

export const MetaLink = styled('a')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const Description = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  marginTop: rem(4),
}));

export const FeedSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const DocumentList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
}));

export const DocumentRow = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  padding: rem(16),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const DocumentIconWrap = styled(Box)(({ theme }) => ({
  width: rem(40),
  height: rem(40),
  minWidth: rem(40),
  borderRadius: rem(10),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `${theme.palette.primary.main}1A`,
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: rem(20),
  },
}));

export const DocumentInfo = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  flex: 1,
  minWidth: 0,
}));

export const DocumentTitleRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexWrap: 'wrap',
}));

export const DocumentTitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const DocumentMetaText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: rem(140),
  borderRadius: rem(12),
  border: `1px dashed ${theme.palette.colors?.grey_200 || theme.palette.grey[300]}`,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(14),
}));

export const NotFoundState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(15),
  textAlign: 'center',
  padding: rem(24),
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(160),
}));
