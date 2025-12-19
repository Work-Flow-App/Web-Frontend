import { styled, Box, Typography } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';

export const PageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: `calc(100vh - ${rem(64)})`,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

export const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(32),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const ContentSection = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `1fr ${rem(350)}`,
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const MapSection = styled(Box)({
  width: '100%',
});

export const SidePanel = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    order: -1,
  },
}));

export const LocationChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const LocationInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: `${rem(1)} solid ${theme.palette.divider}`,
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.primary,
  lineHeight: 1.5,
}));
