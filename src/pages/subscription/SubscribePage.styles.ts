import { styled, Box, Table } from '@mui/material';
import { rem } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

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

export const ControlsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  width: '100%',
}));

export const HeadcountField = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
}));

export const ComparisonSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '1150px',
}));

export const ComparisonTable = styled(Table)(({ theme }) => ({
  '& th, & td': {
    borderColor: floowColors.blackAlpha[8],
    padding: theme.spacing(1.5),
  },
  '& thead th': {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
  },
  '& tbody td:first-of-type': {
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    color: floowColors.blackAlpha[60],
  },
}));
