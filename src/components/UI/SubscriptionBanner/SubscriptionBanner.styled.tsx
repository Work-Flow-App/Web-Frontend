import { styled, Box, Alert } from '@mui/material';
import { rem } from '../Typography/utility';

export const BannerWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2, 0),
}));

export const StyledAlert = styled(Alert)(() => ({
  borderRadius: rem(8),
}));
