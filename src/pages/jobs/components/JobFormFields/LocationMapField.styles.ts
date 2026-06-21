import { styled, Box } from '@mui/material';

export const MapWrapper = styled(Box)(({ theme }) => ({
  height: 300,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));
