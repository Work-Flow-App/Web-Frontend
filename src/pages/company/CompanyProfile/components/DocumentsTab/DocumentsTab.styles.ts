import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const TabHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: rem(16),
  marginBottom: rem(18),
  flexWrap: 'wrap',
}));

export const TabHeaderText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const TabTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(19),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const TabDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(13.5),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
}));

export const ToolsRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const SearchBox = styled(Box)(() => ({
  position: 'relative',
}));

export const SearchInput = styled('input')(({ theme }) => ({
  padding: `${rem(9)} ${rem(12)} ${rem(9)} ${rem(34)}`,
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(8),
  fontSize: rem(13.5),
  width: rem(220),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  outline: 'none',
  '&:focus': {
    borderColor: theme.palette.primary.main,
  },
  '&::placeholder': {
    color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  },
}));

export const SearchIconWrap = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: rem(11),
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  '& svg': {
    fontSize: rem(15),
  },
}));

export const TableWrap = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(14),
  overflow: 'hidden',
  overflowX: 'auto',
}));

export const StyledTable = styled('table')(() => ({
  width: '100%',
  borderCollapse: 'collapse',
}));

export const TableHeadCell = styled('th')(({ theme }) => ({
  textAlign: 'left',
  fontSize: rem(12),
  fontWeight: 700,
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  padding: `${rem(14)} ${rem(20)}`,
  borderBottom: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  whiteSpace: 'nowrap',
}));

export const TableRow = styled('tr')(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  },
  '&:last-child td': {
    borderBottom: 'none',
  },
}));

export const TableCell = styled('td')(({ theme }) => ({
  padding: `${rem(16)} ${rem(20)}`,
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.grey[100]}`,
  verticalAlign: 'middle',
  fontSize: rem(14),
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const DocNameCell = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const DocIconBadge = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  minWidth: rem(36),
  borderRadius: rem(9),
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  '& svg': {
    fontSize: rem(16),
  },
}));

export const CellStack = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  minWidth: 0,
}));

export const CellPrimaryText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const CellSecondaryText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12.5),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  maxWidth: rem(340),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const KebabButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: rem(6),
  borderRadius: rem(6),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  display: 'flex',
  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || theme.palette.grey[100],
  },
}));

export const EmptyRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: rem(140),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  fontSize: rem(14),
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(160),
}));
