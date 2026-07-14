import { styled, Box } from '@mui/material';

export const MapWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));
