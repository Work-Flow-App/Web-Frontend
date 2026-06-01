import type { SxProps, Theme } from '@mui/material/styles';

export const getCheckboxCellStickyStyles = (
  bodyBg: string,
  bodyHoverBg: string
): SxProps<Theme> => ({
  position: 'sticky',
  left: 0,
  zIndex: 10,
  cursor: 'pointer',
  backgroundColor: bodyBg,
  transition: 'background-color 0.2s ease',
  'tr:hover &': {
    backgroundColor: bodyHoverBg,
  },
});

export const getCheckboxCellDefaultStyles = (
  bodyBg: string,
  bodyHoverBg: string
): SxProps<Theme> => ({
  cursor: 'pointer',
  backgroundColor: bodyBg,
  'tr:hover &': {
    backgroundColor: bodyHoverBg,
  },
});

export const getFirstColumnStickyStyles = (
  bodyBg: string,
  bodyHoverBg: string,
  borderColor: string,
  hasSelectable: boolean
): SxProps<Theme> => ({
  position: 'sticky',
  left: hasSelectable ? '48px' : 0,
  zIndex: 10,
  backgroundColor: bodyBg,
  boxShadow: `1px 0 0 0 ${borderColor}`,
  transition: 'background-color 0.2s ease',
  'tr:hover &': {
    backgroundColor: bodyHoverBg,
  },
});

export const getActionsCellStickyStyles = (
  bodyBg: string,
  bodyHoverBg: string,
  borderColor: string
): SxProps<Theme> => ({
  position: 'sticky',
  right: 0,
  zIndex: 2,
  backgroundColor: bodyBg,
  borderLeft: `1px solid ${borderColor}`,
  transition: 'background-color 0.2s ease',
  'tr:hover &': {
    backgroundColor: bodyHoverBg,
  },
});

export const getActionsCellDefaultStyles = (
  bodyBg: string,
  bodyHoverBg: string
): SxProps<Theme> => ({
  backgroundColor: bodyBg,
  'tr:hover &': {
    backgroundColor: bodyHoverBg,
  },
});

export const getLoadingCellStyles = (): SxProps<Theme> => ({
  textAlign: 'center',
  padding: '3rem 1.25rem',
  position: 'relative',
});

export const getEmptyCellStyles = (): SxProps<Theme> => ({
  textAlign: 'center',
  padding: '3rem 1.25rem',
});

export const getStyledTableRowStyles = (hasRowClick: boolean): SxProps<Theme> => ({
  cursor: hasRowClick ? 'pointer' : 'default',
});