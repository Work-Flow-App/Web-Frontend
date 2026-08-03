import { Box, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: rem(16),
}));

export const PaginationWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: rem(16),
}));
