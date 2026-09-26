import { Box, styled } from '@mui/material';
import { rem } from '../../../../../../components/UI/Typography/utility';

export const FormWrapper = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  width: '100%',
}));

export const FormActions = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: rem(8),
}));
