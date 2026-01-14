import { styled, Box, Typography } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2, 2, 2),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
  },
}));

export const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: Bold._600,
  marginBottom: theme.spacing(2),
  fontSize: rem(16),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),

  '&:last-child': {
    marginBottom: 0,
  },
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.primary,
  fontWeight: Bold._400,
}));

export const BreadcrumbContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: `${rem(14)} !important`,
  fontWeight: `${Bold._500} !important`,
  lineHeight: '1.5',
  margin: '0 !important',
}));

export const BreadcrumbLink = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 0.8,
  },
}));

export const BreadcrumbSeparator = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  userSelect: 'none',
  margin: '0 2px',
}));

export const BreadcrumbCurrent = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
}));
