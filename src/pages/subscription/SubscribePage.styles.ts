import { styled, Box } from '@mui/material';
import { rem } from '../../components/Typography/utility';

export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100%',
  padding: rem(40),
  gap: theme.spacing(4),

  [theme.breakpoints.down('sm')]: {
    padding: rem(24),
  },
}));

export const HeadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  maxWidth: rem(480),
  textAlign: 'center',
}));
