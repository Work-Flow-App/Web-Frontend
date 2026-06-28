import { styled, Box } from '@mui/material';
import { rem } from '../../components/Typography/utility';

export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  padding: rem(40),
  gap: theme.spacing(3),
  textAlign: 'center',

  [theme.breakpoints.down('sm')]: {
    padding: rem(24),
  },
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  maxWidth: rem(480),
}));
