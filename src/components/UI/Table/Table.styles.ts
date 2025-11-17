import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

interface TableWrapperProps {
  dense?: boolean;
}

/**
 * Main table container
 */
export const TableWrapper = styled(Box)<TableWrapperProps>(({ theme, dense }) => ({
  width: '100%',
  overflowX: 'auto',
  borderRadius: rem(8),
  border: `${rem(1)} solid ${floowColors.grey[200]}`,
  boxSizing: 'border-box',

  [theme.breakpoints.down('md')]: {
    borderRadius: rem(6),
  },
}));

/**
 * Table element
 */
export const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: rem(14),
  boxSizing: 'border-box',

  [theme.breakpoints.down('sm')]: {
    fontSize: rem(12),
  },
}));

interface TableHeadProps {
  sticky?: boolean;
}

/**
 * Table header
 */
export const TableHead = styled('thead')<TableHeadProps>(({ theme, sticky }) => ({
  backgroundColor: floowColors.grey[50],
  borderBottom: `${rem(1)} solid ${floowColors.grey[200]}`,
  position: sticky ? 'sticky' : 'relative',
  top: 0,
  zIndex: sticky ? 10 : 'auto',
}));

/**
 * Table header row
 */
export const TableHeaderRow = styled('tr')(({ theme }) => ({
  display: 'table-row',
}));

interface TableHeaderCellProps {
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * Table header cell
 */
export const TableHeaderCell = styled('th')<TableHeaderCellProps>(
  ({ theme, sortable, align }) => ({
    padding: `${rem(12)} ${rem(16)}`,
    textAlign: (align as 'left' | 'center' | 'right') || 'left',
    fontWeight: 600,
    color: floowColors.grey[700],
    backgroundColor: floowColors.grey[50],
    cursor: sortable ? 'pointer' : 'default',
    userSelect: 'none',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'nowrap',

    '&:hover': sortable && {
      backgroundColor: floowColors.grey[100],
    },

    [theme.breakpoints.down('md')]: {
      padding: `${rem(10)} ${rem(12)}`,
      fontSize: rem(13),
    },

    [theme.breakpoints.down('sm')]: {
      padding: `${rem(8)} ${rem(10)}`,
      fontSize: rem(12),
    },
  })
);

/**
 * Table body
 */
export const TableBody = styled('tbody')(({ theme }) => ({
  display: 'table-row-group',
}));

interface TableRowProps {
  striped?: boolean;
  hoverable?: boolean;
  isSelected?: boolean;
}

/**
 * Table row
 */
export const TableRow = styled('tr')<TableRowProps>(
  ({ theme, striped, hoverable, isSelected }) => ({
    borderBottom: `${rem(1)} solid ${floowColors.grey[200]}`,
    backgroundColor: isSelected ? floowColors.grey[75] : 'transparent',
    transition: 'background-color 0.2s ease',
    cursor: hoverable ? 'pointer' : 'default',

    ...(striped && {
      '&:nth-of-type(even)': {
        backgroundColor: isSelected ? floowColors.grey[75] : floowColors.grey[50],
      },
    }),

    ...(hoverable && {
      '&:hover': {
        backgroundColor: isSelected ? floowColors.grey[75] : floowColors.grey[100],
      },
    }),

    [theme.breakpoints.down('sm')]: {
      display: 'block',
      marginBottom: rem(12),
      borderRadius: rem(6),
      borderBottom: 'none',
      border: `${rem(1)} solid ${floowColors.grey[200]}`,
    },
  })
);

interface TableCellProps {
  align?: 'left' | 'center' | 'right';
  dense?: boolean;
}

/**
 * Table cell
 */
export const TableCell = styled('td')<TableCellProps>(({ theme, align, dense }) => ({
  padding: dense ? `${rem(8)} ${rem(12)}` : `${rem(12)} ${rem(16)}`,
  textAlign: (align as 'left' | 'center' | 'right') || 'left',
  color: floowColors.grey[700],
  wordBreak: 'break-word',

  [theme.breakpoints.down('md')]: {
    padding: dense ? `${rem(6)} ${rem(10)}` : `${rem(10)} ${rem(12)}`,
    fontSize: rem(13),
  },

  [theme.breakpoints.down('sm')]: {
    display: 'block',
    padding: `${rem(8)} ${rem(12)}`,
    textAlign: 'right',
    fontSize: rem(12),

    '&::before': {
      content: 'attr(data-label)',
      fontWeight: 600,
      float: 'left',
      color: floowColors.grey[600],
    },
  },
}));

/**
 * Table checkbox cell
 */
export const TableCheckboxCell = styled(TableCell)(({ theme }) => ({
  width: rem(40),
  textAlign: 'center',
  padding: `${rem(12)} ${rem(8)}`,

  [theme.breakpoints.down('md')]: {
    padding: `${rem(10)} ${rem(6)}`,
  },
}));

/**
 * Loading overlay
 */
export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 100,
  backdropFilter: 'blur(2px)',
}));

/**
 * Empty state container
 */
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(48)} ${rem(24)}`,
  color: floowColors.grey[500],
  fontSize: rem(16),
  textAlign: 'center',
  minHeight: rem(300),

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(32)} ${rem(16)}`,
    fontSize: rem(14),
    minHeight: rem(200),
  },
}));

/**
 * Pagination container
 */
export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(16)} ${rem(16)}`,
  borderTop: `${rem(1)} solid ${floowColors.grey[200]}`,
  backgroundColor: floowColors.grey[50],
  borderRadius: `0 0 ${rem(8)} ${rem(8)}`,
  gap: rem(12),

  [theme.breakpoints.down('md')]: {
    padding: `${rem(12)} ${rem(12)}`,
    fontSize: rem(13),
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    padding: `${rem(10)} ${rem(10)}`,
    fontSize: rem(12),
  },
}));

/**
 * Sort indicator
 */
export const SortIndicator = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  marginLeft: rem(4),
  fontSize: rem(12),
  opacity: 0.6,
  transition: 'opacity 0.2s ease',
}));

/**
 * Actions cell
 */
export const ActionCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

/**
 * Skeleton loader
 */
export const SkeletonRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: floowColors.grey[50],

  '& td': {
    padding: `${rem(12)} ${rem(16)}`,
  },
}));
