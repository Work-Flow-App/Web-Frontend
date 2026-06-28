import { styled, Box, Paper } from '@mui/material';
import { rem } from '../../components/Typography/utility';

export const SectionWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: rem(32),
  gap: theme.spacing(3),
  borderRadius: rem(16),

  [theme.breakpoints.down('sm')]: {
    padding: rem(24),
  },
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minHeight: rem(36),
}));

export const LabelText = styled(Box)(() => ({
  minWidth: rem(180),
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  paddingTop: theme.spacing(1),
}));
