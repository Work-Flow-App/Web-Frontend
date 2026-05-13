import { Box, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const UsernameRow = styled(Box)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 400,
  color: theme.palette.colors.grey_600,
  lineHeight: rem(20),
}));

export const UsernameValue = styled('span')(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));
