import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const ColumnHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  minWidth: 'max-content',
}));

export const ColumnSearchRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  minWidth: 'max-content',
}));

export const HeaderCellWrapper = styled(Box)<{ width?: string }>(({ width }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: width || 'auto',
  minWidth: width || 'auto',
  maxWidth: width || 'none',
  flex: width ? `0 0 ${width}` : '0 0 auto',
}));

export const ColumnSearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiOutlinedInput-root': {
    fontSize: '0.75rem',
    fontFamily: 'Manrope, sans-serif',
    background: theme.palette.colors.white,

    '& fieldset': {
      borderColor: theme.palette.colors.grey_200,
    },

    '&:hover fieldset': {
      borderColor: theme.palette.colors.grey_300,
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.colors.black,
    },
  },

  '& .MuiOutlinedInput-input': {
    padding: '0.375rem 0.5rem',
  },
}));

export const SearchCellWrapper = styled(Box)<{ width?: string }>(({ width }) => ({
  padding: '0.375rem 1.25rem',
  width: width || 'auto',
  minWidth: width || 'auto',
  maxWidth: width || 'none',
  boxSizing: 'border-box',
  flex: width ? `0 0 ${width}` : '0 0 auto',
}));
