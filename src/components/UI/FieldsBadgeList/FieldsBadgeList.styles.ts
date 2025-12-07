import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { rem } from '../Typography/utility';

export const FieldsContainer = styled(Box)({
  display: 'flex',
  gap: rem(8),
  alignItems: 'center',
  flexWrap: 'wrap',
});
