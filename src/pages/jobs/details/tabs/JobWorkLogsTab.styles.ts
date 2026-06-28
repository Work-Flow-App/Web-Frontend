import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/Typography/utility';
import { floowColors } from '../../../../theme/colors';

export { EmptyFeedBox } from './StepActivityTab.styles';

// ─── Layout ───────────────────────────────────────────────────────────────────

export const WorkLogsLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: theme.palette.colors.white,
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
}));

// ─── Top Horizontal Steps Navigation ──────────────────────────────────────────

export const StepsNavContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  overflowX: 'auto',
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  '&::-webkit-scrollbar': {
    height: rem(4),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.colors.grey_300,
    borderRadius: rem(4),
  },
}));

export const StepBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(6),
  border: `1px solid ${isActive ? '#101a32' : theme.palette.colors.grey_200}`,
  backgroundColor: isActive ? '#101a32' : theme.palette.colors.white,
  color: isActive ? floowColors.white : theme.palette.text.primary,
  fontSize: rem(13),
  fontWeight: Bold._600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#101a32',
  },
}));

export const StepDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor?: string }>(({ dotColor }) => ({
  width: rem(8),
  height: rem(8),
  borderRadius: '50%',
  backgroundColor: dotColor || floowColors.white,
}));

// ─── Summary Section ──────────────────────────────────────────────────────────

export const SummarySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: floowColors.tailwind.gray[50],
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));

// Left Black Box
export const TrackingBox = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#101a32',
  borderRadius: rem(12),
  padding: theme.spacing(3, 4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  color: floowColors.white,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

export const TimerIconBox = styled(Box)(({ theme }) => ({
  width: rem(64),
  height: rem(64),
  borderRadius: rem(16),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const TrackingInfo = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const TrackingLabel = styled(Typography)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._700,
  color: 'rgba(255, 255, 255, 0.6)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
}));

export const TrackingTime = styled(Typography)(() => ({
  fontSize: rem(36),
  fontWeight: Bold._700,
  lineHeight: 1.1,
  color: floowColors.white,
}));

// Right Grid
export const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  width: rem(500),
  flexShrink: 0,
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const StatBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(12),
  padding: theme.spacing(2.5, 3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: rem(8),
}));

export const AddLogBox = styled(StatBox)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.1,
}));

// ─── Table Section ────────────────────────────────────────────────────────────

export const TableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  minHeight: rem(400),
}));

export const Table = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  minWidth: rem(800),
}));

export const Th = styled('th')(({ theme }) => ({
  padding: theme.spacing(2, 3),
  fontSize: rem(11),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: floowColors.tailwind.gray[50],
}));

export const Td = styled('td')(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  fontSize: rem(14),
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  verticalAlign: 'middle',
}));

export const Tr = styled('tr')(({ theme }) => ({
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: floowColors.tailwind.gray[50],
  },
}));

export const UserBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontWeight: Bold._600,
}));

export const UserAvatar = styled(Box)(({ theme }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: floowColors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(12),
  fontWeight: Bold._700,
}));

export const DurationText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const ActionCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const NotesText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13.5),
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
}));

export const TableSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  padding: theme.spacing(3, 3, 2, 3),
}));

export const EmptyStateRow = styled('td')(({ theme }) => ({
  padding: theme.spacing(6, 3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: rem(14),
}));

