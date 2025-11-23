import { styled } from '@mui/material/styles';
import { Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import type { IStyledTableProps, IStyledTableCellProps, IStyledCheckboxProps, IStyledStatusPillProps } from './ITable';

export const TableWrapper = styled(Box)<IStyledTableProps>(({ width }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  width: width || '100%',
  maxWidth: '100%',
  margin: '0 auto',
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: theme.palette.colors.white,
  borderRadius: 0,
  boxShadow: 'none',
  border: 'none',
  overflow: 'auto',

  '&::-webkit-scrollbar': {
    width: '0.5rem',
    height: '0.5rem',
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.colors.grey_100,
  },

  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.colors.grey_300,
    borderRadius: '0.25rem',

    '&:hover': {
      background: theme.palette.colors.grey_400,
    },
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  background: theme.palette.colors.white,
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.colors.grey_50,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const StyledTableBody = styled(TableBody)(({ theme }) => ({
  background: theme.palette.colors.white,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  transition: 'background 0.2s ease',

  '&:last-child': {
    borderBottom: 'none',
  },

  '&:hover': {
    background: theme.palette.colors.grey_50,
  },
}));

export const StyledHeaderCell = styled(TableCell)<IStyledTableCellProps>(
  ({ theme, width, align, sortable }) => ({
    padding: '0.625rem 1.25rem', // 10px 20px
    fontSize: '0.875rem', // 14px
    fontWeight: 600,
    fontFamily: 'Manrope, sans-serif',
    color: theme.palette.colors.grey_600,
    textAlign: align || 'left',
    width: width || 'auto',
    whiteSpace: 'nowrap',
    borderBottom: 'none',
    cursor: sortable ? 'pointer' : 'default',
    userSelect: 'none',

    '&:hover': {
      background: sortable ? theme.palette.colors.grey_100 : 'transparent',
    },

    '&:first-of-type': {
      position: 'sticky',
      left: 0,
      zIndex: 3,
      background: theme.palette.colors.grey_50,

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
  })
);

export const StyledTableCell = styled(TableCell)<IStyledTableCellProps>(
  ({ theme, width, align }) => ({
    padding: '0.625rem 1.25rem', // 10px 20px
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    fontFamily: 'Manrope, sans-serif',
    color: theme.palette.colors.grey_800,
    textAlign: align || 'left',
    width: width || 'auto',
    borderBottom: 'none',
  })
);

export const HeaderContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'flex-start',
}));

export const CheckboxCell = styled(TableCell)(() => ({
  padding: '0.625rem 1.25rem', // 10px 20px
  width: '3rem', // 48px
  borderBottom: 'none',
}));

export const ActionsCell = styled(TableCell)(() => ({
  padding: '0.625rem 1.25rem', // 10px 20px
  width: '4rem', // 64px
  textAlign: 'center',
  borderBottom: 'none',
}));

export const CustomCheckbox = styled(Box)<IStyledCheckboxProps>(
  ({ theme, checked, indeterminate }) => ({
    width: '1.25rem', // 20px
    height: '1.25rem', // 20px
    border: `1.5px solid ${checked || indeterminate ? theme.palette.colors.black : theme.palette.colors.grey_300}`,
    borderRadius: '0.25rem', // 4px
    background: checked || indeterminate ? theme.palette.colors.black : theme.palette.colors.white,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',

    '&:hover': {
      borderColor: theme.palette.colors.black,
      background: checked || indeterminate ? theme.palette.colors.black : theme.palette.colors.grey_50,
    },

    '&::after': {
      content: checked ? '""' : 'none',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '0.25rem',
      height: '0.5rem',
      border: `solid ${theme.palette.colors.white}`,
      borderWidth: '0 2px 2px 0',
      transform: 'translate(-50%, -65%) rotate(45deg)',
    },

    '&::before': {
      content: indeterminate && !checked ? '""' : 'none',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '0.625rem',
      height: '2px',
      background: theme.palette.colors.white,
      transform: 'translate(-50%, -50%)',
    },
  })
);

export const StatusPill = styled(Box)<IStyledStatusPillProps>(({ theme, status }) => {
  const statusStyles = {
    active: {
      background: theme.palette.success.light,
      border: `1px solid ${theme.palette.success.main}`,
      color: theme.palette.success.main,
    },
    deactivated: {
      background: theme.palette.colors.grey_50,
      border: `1px solid ${theme.palette.colors.grey_400}`,
      color: theme.palette.colors.grey_600,
    },
    pending: {
      background: theme.palette.warning.light,
      border: `1px solid ${theme.palette.warning.main}`,
      color: theme.palette.warning.main,
    },
  };

  const style = statusStyles[status] || statusStyles.active;

  return {
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.25rem 1.5rem', // 4px 24px
    minWidth: '5.5625rem', // 89px
    height: '1.75rem', // 28px
    background: style.background,
    border: style.border,
    borderRadius: '0.25rem', // 4px
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    fontFamily: 'Manrope, sans-serif',
    color: style.color,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  };
});

export const ActionButton = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem', // 32px
  height: '2rem', // 32px
  borderRadius: '0.25rem', // 4px
  cursor: 'pointer',
  transition: 'background 0.2s ease',

  '&:hover': {
    background: theme.palette.colors.grey_100,
  },

  '&:active': {
    background: theme.palette.colors.grey_200,
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1.25rem', // 48px 20px
  color: theme.palette.colors.grey_400,
  fontSize: '0.875rem', // 14px
  fontFamily: 'Manrope, sans-serif',
  textAlign: 'center',
}));

export const LoadingOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}));

export const AvatarCell = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

export const Avatar = styled(Box)(({ theme }) => ({
  width: '2rem', // 32px
  height: '2rem', // 32px
  borderRadius: '50%',
  background: theme.palette.colors.grey_100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem', // 12px
  fontWeight: 600,
  color: theme.palette.colors.grey_600,
  fontFamily: 'Manrope, sans-serif',
  textTransform: 'uppercase',
}));

export const MemberInfo = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
}));

export const MemberName = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem', // 14px
  fontWeight: 500,
  color: theme.palette.colors.grey_800,
  fontFamily: 'Manrope, sans-serif',
}));

export const MemberEmail = styled(Box)(({ theme }) => ({
  fontSize: '0.75rem', // 12px
  fontWeight: 400,
  color: theme.palette.colors.grey_500,
  fontFamily: 'Manrope, sans-serif',
}));

export const DateText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
}));

export const DateMain = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem', // 14px
  fontWeight: 400,
  color: theme.palette.colors.grey_800,
  fontFamily: 'Manrope, sans-serif',
}));

export const DateSub = styled(Box)(({ theme }) => ({
  fontSize: '0.75rem', // 12px
  fontWeight: 400,
  color: theme.palette.colors.grey_500,
  fontFamily: 'Manrope, sans-serif',
}));
