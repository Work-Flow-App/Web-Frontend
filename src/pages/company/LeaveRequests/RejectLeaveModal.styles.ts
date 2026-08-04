import { Typography, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const IntroText = styled(Typography)(({ theme }) => ({
  marginBottom: rem(8),
  color: theme.palette.text.secondary,
}));
