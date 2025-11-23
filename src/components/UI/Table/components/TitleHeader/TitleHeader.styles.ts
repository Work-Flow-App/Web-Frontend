import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const TitleHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.25rem',
  background: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  gap: '1rem',
}));

export const TitleSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
}));

export const Title = styled(Box)(({ theme }) => ({
  fontSize: '1.125rem', // 18px
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: theme.palette.colors.grey_800,
}));

export const SearchInput = styled(TextField)(({ theme }) => ({
  minWidth: '250px',

  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem',
    fontFamily: 'Manrope, sans-serif',
    background: theme.palette.colors.white,

    '& fieldset': {
      borderColor: theme.palette.colors.grey_300,
    },

    '&:hover fieldset': {
      borderColor: theme.palette.colors.grey_400,
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.colors.black,
    },
  },

  '& .MuiOutlinedInput-input': {
    padding: '0.5rem 0.75rem',
  },
}));

export const ActionsSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.5rem',
}));
