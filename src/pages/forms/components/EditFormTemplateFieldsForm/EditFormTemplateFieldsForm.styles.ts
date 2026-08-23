import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const FormBody = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
}));
