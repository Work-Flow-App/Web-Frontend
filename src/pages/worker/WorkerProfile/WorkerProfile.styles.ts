import { Box, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: rem(16),
}));
