import { styled, Box } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export const SpreadsheetContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: `1px solid ${floowColors.grey[200]}`,
  borderRadius: '4px',
  backgroundColor: floowColors.white,
  height: 'calc(100vh - 260px)',
  minHeight: '400px',
}));

export const SpreadsheetScrollArea = styled(Box)(() => ({
  flex: 1,
  overflowX: 'auto',
  overflowY: 'auto',

  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },

  '&::-webkit-scrollbar-track': {
    background: floowColors.grey[100],
  },

  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: '4px',

    '&:hover': {
      background: floowColors.grey[400],
    },
  },
}));

export const SpreadsheetTable = styled('table')(() => ({
  borderCollapse: 'collapse',
  width: 'max-content',
  minWidth: '100%',
  tableLayout: 'fixed',
}));

export const SpreadsheetThead = styled('thead')(() => ({
  position: 'sticky',
  top: 0,
  zIndex: 4,
}));

export const SpreadsheetTbody = styled('tbody')(() => ({}));

export const CornerCell = styled('th')(() => ({
  width: '48px',
  minWidth: '48px',
  height: '30px',
  background: floowColors.grey[100],
  borderRight: `1px solid ${floowColors.grey[200]}`,
  borderBottom: `2px solid ${floowColors.grey[300]}`,
  position: 'sticky',
  left: 0,
  zIndex: 5,
  boxSizing: 'border-box',
}));

interface ColumnHeaderThProps {
  isActive?: boolean;
}

export const ColumnHeaderTh = styled('th', {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<ColumnHeaderThProps>(({ isActive }) => ({
  minWidth: '180px',
  width: '180px',
  height: '30px',
  background: isActive ? floowColors.grey[200] : floowColors.grey[100],
  borderRight: `1px solid ${floowColors.grey[200]}`,
  borderBottom: `2px solid ${floowColors.grey[300]}`,
  cursor: 'default',
  userSelect: 'none',
  padding: 0,
  boxSizing: 'border-box',

  '&:hover': {
    background: floowColors.grey[150] || floowColors.grey[200],
  },
}));

export const ColumnHeaderContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '0 8px',
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
}));

export const ColumnTypeIcon = styled(Box)(() => ({
  color: floowColors.grey[500],
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,

  '& svg': {
    width: '14px',
    height: '14px',
  },
}));

export const ColumnLabel = styled(Box)(() => ({
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[700],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
}));

export const RequiredMark = styled('span')(() => ({
  color: floowColors.error.main,
  fontSize: '12px',
  fontWeight: 700,
  flexShrink: 0,
  lineHeight: 1,
}));

export const ColumnMenuBtn = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '3px',
  padding: '2px',
  cursor: 'pointer',
  color: floowColors.grey[400],
  transition: 'all 0.15s ease',

  '& svg': {
    width: '13px',
    height: '13px',
  },

  '&:hover': {
    color: floowColors.grey[700],
    background: floowColors.grey[300],
  },
}));

export const AddColumnTh = styled('th')(() => ({
  minWidth: '48px',
  width: '48px',
  height: '30px',
  background: floowColors.grey[100],
  borderBottom: `2px solid ${floowColors.grey[300]}`,
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: 'background 0.15s ease',

  '&:hover': {
    background: floowColors.grey[200],
  },
}));

export const AddColumnContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: floowColors.grey[500],

  '& svg': {
    width: '16px',
    height: '16px',
  },
}));

export const RowNumberTd = styled('td')(() => ({
  width: '48px',
  minWidth: '48px',
  height: '24px',
  background: floowColors.grey[50],
  borderRight: `1px solid ${floowColors.grey[200]}`,
  borderBottom: `1px solid ${floowColors.grey[100]}`,
  textAlign: 'center',
  fontSize: '11px',
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[400],
  fontWeight: 400,
  position: 'sticky',
  left: 0,
  zIndex: 2,
  boxSizing: 'border-box',
}));

export const DataTd = styled('td')(() => ({
  minWidth: '180px',
  width: '180px',
  height: '24px',
  background: floowColors.white,
  borderRight: `1px solid ${floowColors.grey[100]}`,
  borderBottom: `1px solid ${floowColors.grey[100]}`,
  padding: '0 8px',
  boxSizing: 'border-box',
}));

export const EmptyTd = styled('td')(() => ({
  minWidth: '48px',
  width: '48px',
  height: '24px',
  background: floowColors.white,
  borderBottom: `1px solid ${floowColors.grey[100]}`,
}));

export const EmptyState = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '200px',
  color: floowColors.grey[400],
  fontSize: '14px',
  fontFamily: 'Manrope, sans-serif',
  flexDirection: 'column',
  gap: '8px',
}));

export const LoadingRow = styled('tr')(() => ({
  '& td': {
    padding: '12px 16px',
    textAlign: 'center',
    color: floowColors.grey[400],
    fontSize: '13px',
    fontFamily: 'Manrope, sans-serif',
  },
}));
