import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem', // 8px spacing between buttons
  padding: 0,
}));

export const EllipsisContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem 0.75rem',
  color: theme.palette.colors.grey_600,
  fontSize: '0.875rem',
  fontFamily: 'Manrope, sans-serif',
  userSelect: 'none',
}));
