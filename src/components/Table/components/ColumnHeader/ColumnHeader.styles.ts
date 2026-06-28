import { styled } from '@mui/material/styles';
import { TableRow, TableCell, TextField, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

export const ColumnHeaderRow = styled(TableRow)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? theme.palette.colors.grey_200 : theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.colors.grey_300 : theme.palette.colors.grey_100}`,
}));

export const ColumnSearchRow = styled(TableRow)(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.colors.grey_200 : theme.palette.colors.grey_100}`,
}));

export const ColumnSearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',

  '& .MuiOutlinedInput-root': {
    fontSize: '0.75rem',
    fontFamily: 'Manrope, sans-serif',
    background: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.colors.white,

    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.colors.grey_300 : theme.palette.colors.grey_200,
    },

    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' ? theme.palette.colors.grey_400 : theme.palette.colors.grey_300,
    },

    '&.Mui-focused fieldset': {
      borderColor: theme.palette.colors.black,
    },
  },

  '& .MuiOutlinedInput-input': {
    padding: '0.375rem 0.5rem',
    color: theme.palette.text.primary,
  },
}));

export const SearchCellWrapper = styled(TableCell)<{ width?: string }>(({ width }) => ({
  padding: '0.375rem 1.25rem',
  width: width || 'auto',
  borderBottom: 'none',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
}));

// ─── CheckboxCell inline style (used with `style` prop) ───────────────────────

export const getCheckboxCellStickyHeaderStyle = (bg: string, zIndex: number): CSSProperties => ({
  position: 'sticky',
  left: 0,
  zIndex,
  background: bg,
});

// ─── StyledHeaderCell sx styles ───────────────────────────────────────────────

export const getFirstColumnStickyHeaderSx = (
  headerBg: string,
  headerHoverBg: string,
  borderColor: string,
  hasSelectable: boolean,
  sortable: boolean
): SxProps<Theme> => ({
  position: 'sticky',
  left: hasSelectable ? '48px' : 0,
  zIndex: 5,
  background: headerBg,
  boxShadow: `1px 0 0 0 ${borderColor}`,
  cursor: sortable ? 'pointer' : 'default',
  '&:hover': {
    background: sortable ? headerHoverBg : headerBg,
  },
});

export const getColumnHeaderSx = (
  headerBg: string,
  headerHoverBg: string,
  sortable: boolean
): SxProps<Theme> => ({
  background: headerBg,
  cursor: sortable ? 'pointer' : 'default',
  '&:hover': {
    background: sortable ? headerHoverBg : headerBg,
  },
});

export const getCheckboxCellHeaderSx = (headerBg: string): SxProps<Theme> => ({
  background: headerBg,
});

// ─── ActionsCell sx styles ────────────────────────────────────────────────────

export const getActionsCellStickyHeaderSx = (
  bg: string,
  borderColor: string
): SxProps<Theme> => ({
  position: 'sticky',
  right: 0,
  zIndex: 3,
  background: bg,
  borderLeft: `1px solid ${borderColor}`,
});

export const getActionsCellDefaultHeaderSx = (bg: string): SxProps<Theme> => ({
  background: bg,
});

export const ActionsHeaderContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

// ─── SearchCellWrapper sticky style (used with `style` prop) ──────────────────

export const getFirstColumnStickySearchStyle = (
  bg: string,
  borderColor: string,
  hasSelectable: boolean
): CSSProperties => ({
  position: 'sticky',
  left: hasSelectable ? '48px' : 0,
  zIndex: 3,
  background: bg,
  boxShadow: `1px 0 0 0 ${borderColor}`,
});

// ─── CheckboxCell search row sx ───────────────────────────────────────────────

export const getCheckboxCellSearchSx = (bodyBg: string): SxProps<Theme> => ({
  background: bodyBg,
});