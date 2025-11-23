import { styled } from '@mui/material/styles';
import { Box, TextField } from '@mui/material';

export const ColumnHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const ColumnSearchRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const HeaderCellWrapper = styled(Box)<{ width?: string }>(({ width }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: width || 'auto',
  minWidth: 0,
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

export const SearchCellWrapper = styled(Box)<{ width?: string }>(({ theme, width }) => ({
  padding: '0.375rem 1.25rem',
  width: width || 'auto',
  minWidth: 0,

  // First column sticky - positioned after checkbox
  '&:first-of-type': {
    position: 'sticky',
    left: '5.5rem', // 88px - after checkbox width
    zIndex: 2,
    background: theme.palette.colors.white,
  },

  // Second column sticky - positioned after checkbox + first column
  '&:nth-of-type(2)': {
    position: 'sticky',
    left: 'calc(5.5rem + 200px + 2.5rem)', // checkbox (88px) + first column width (200px) + first column padding (40px = 2.5rem)
    zIndex: 2,
    background: theme.palette.colors.white,

    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '1px',
      background: theme.palette.colors.grey_100,
    },
  },
}));
