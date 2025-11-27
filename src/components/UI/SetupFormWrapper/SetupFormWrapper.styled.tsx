import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}));

export const StandaloneForm = styled('form')({
  width: '100%',
});

export const SubmitButtonWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  justifyContent: 'flex-end',
}));
