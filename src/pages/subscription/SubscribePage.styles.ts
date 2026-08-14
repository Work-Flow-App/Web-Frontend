import { styled, Box } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';

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

export const CardsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: theme.spacing(3),
  width: '100%',
}));

export const StepperField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const stepperInputSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
};
