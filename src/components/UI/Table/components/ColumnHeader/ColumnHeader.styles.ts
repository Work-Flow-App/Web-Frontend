import { styled } from '@mui/material/styles';
import { TableRow, TableCell, TextField } from '@mui/material';

export const ColumnHeaderRow = styled(TableRow)(({ theme }) => ({
  background: theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const ColumnSearchRow = styled(TableRow)(({ theme }) => ({
  background: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
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

export const SearchCellWrapper = styled(TableCell)<{ width?: string }>(({ width }) => ({
  padding: '0.375rem 1.25rem',
  width: width || 'auto',
  borderBottom: 'none',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
}));
