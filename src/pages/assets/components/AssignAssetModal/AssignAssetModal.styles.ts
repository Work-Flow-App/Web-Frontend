import { Box, Typography, styled } from '@mui/material';

export const LocationFieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const LocationHint = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));
