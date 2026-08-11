import { styled } from '@mui/material/styles';
import { Box, Typography, OutlinedInput } from '@mui/material';

export const ReviewTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.25rem',
});

export const ReviewSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: '0.25rem',
}));

export const ReviewFieldsGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '0.5rem',
});

export const ReviewFieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: '0.375rem',
}));

export const ReviewFieldInput = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: '0.5rem',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));
