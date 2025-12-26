import { styled, Box, Typography } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
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
