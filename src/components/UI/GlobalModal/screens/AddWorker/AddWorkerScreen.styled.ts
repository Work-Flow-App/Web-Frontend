import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const FormWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  width: '100%',
});

export const FieldWrapper = styled(Box)({
  width: '100%',
});

export const FieldRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  width: '100%',
});
