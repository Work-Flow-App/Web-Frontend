import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../../theme/colors';

export { EmptyFeedBox } from './StepActivityTab.styles';

// ─── Outer Layout (Rail + Right Content) ──────────────────────────────────────

export const WorkLogsOuterLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  backgroundColor: theme.palette.colors.white,
  borderRadius: rem(12),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
  position: 'relative',
}));

// ─── Left Steps Rail (max 2rem wide) ──────────────────────────────────────────

export const StepsRail = styled(Box)(({ theme }) => ({
  width: rem(56),
  maxWidth: rem(56),
  flexShrink: 0,
  borderRight: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.white,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: rem(10),
  paddingBottom: rem(10),
  zIndex: 2,
}));

export const StepsRailHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(4),
  marginBottom: rem(8),
  width: '100%',
}));

export const StepsRailTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(7),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  letterSpacing: rem(0.5),
  textTransform: 'uppercase',
  lineHeight: 1,
  textAlign: 'center',
}));

// ─── Search Wrapper & Input ───────────────────────────────────────────────────
// Input is absolutely positioned, extends to the RIGHT of the rail, overlaying
// the content area. No overflow clipping since it stays within the outer container.

export const StepSearchWrapper = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StepSearchInput = styled('input')(({ theme }) => ({
  position: 'absolute',
  left: '100%',        // starts right at the rail's right edge (3.5rem)
  top: '50%',
  transform: 'translateY(-50%)',
  width: rem(72),
  height: rem(26),
  border: `${rem(1)} solid ${theme.palette.colors.grey_300}`,
  borderLeft: 'none',
  borderRadius: `0 ${rem(4)} ${rem(4)} 0`,
  backgroundColor: theme.palette.colors.white,
  fontSize: rem(12),
  padding: `0 ${rem(6)}`,
  outline: 'none',
  zIndex: 10,
  boxShadow: `${rem(2)} ${rem(2)} ${rem(8)} rgba(0,0,0,0.1)`,
  // Remove number-type spin arrows
  '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
    appearance: 'none',
    margin: 0,
  },
  '&[type=number]': {
    MozAppearance: 'textfield',
  },
  '&:focus': {
    borderColor: '#101a32',
    boxShadow: `${rem(2)} ${rem(2)} ${rem(10)} rgba(16,26,50,0.15)`,
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
    fontSize: rem(11),
  },
}));

// ─── Step Bubbles List ────────────────────────────────────────────────────────

export const StepsBubbleList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'visible',
  width: '100%',
  paddingTop: rem(4),
  '&::-webkit-scrollbar': {
    width: rem(2),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: floowColors.tailwind.gray[300],
    borderRadius: rem(2),
  },
}));

export const StepBubbleItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const StepConnector = styled(Box)(({ theme }) => ({
  width: rem(2),
  height: rem(10),
  backgroundColor: theme.palette.colors.grey_200,
  flexShrink: 0,
}));

export const StepCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'stepColor',
})<{ isActive?: boolean; stepColor?: string }>(({ theme, isActive, stepColor }) => ({
  // Fills most of the 3.5rem (56px) rail — 44px circle, 6px padding each side
  width: rem(44),
  height: rem(44),
  borderRadius: '50%',
  backgroundColor: isActive ? '#101a32' : theme.palette.colors.white,
  border: `${rem(2.5)} solid ${isActive ? '#101a32' : (stepColor || theme.palette.colors.grey_300)}`,
  color: isActive ? floowColors.white : theme.palette.text.primary,
  fontSize: rem(14),
  fontWeight: Bold._700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  flexShrink: 0,
  position: 'relative',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#101a32',
    backgroundColor: isActive ? '#101a32' : floowColors.tailwind.gray[50],
  },
}));

// ─── Right Content Column ─────────────────────────────────────────────────────

export const WorkLogsLayout = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
}));

// ─── Summary Section ──────────────────────────────────────────────────────────

export const SummarySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  backgroundColor: floowColors.tailwind.gray[50],
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
  },
}));

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

export const TimerIconBox = styled(Box)(() => ({
  width: rem(64),
  height: rem(64),
  borderRadius: rem(16),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
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
  letterSpacing: rem(0.5),
  textTransform: 'uppercase',
}));

export const TrackingTime = styled(Typography)(() => ({
  fontSize: rem(36),
  fontWeight: Bold._700,
  lineHeight: 1.1,
  color: floowColors.white,
}));

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
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
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
  letterSpacing: rem(0.5),
  textTransform: 'uppercase',
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.1,
}));

// ─── Table Section ────────────────────────────────────────────────────────────

export const TableSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  letterSpacing: rem(0.5),
  textTransform: 'uppercase',
  padding: theme.spacing(3, 3, 2, 3),
}));

export const TableContainer = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
  minHeight: rem(200),
  '&::-webkit-scrollbar': {
    height: rem(4),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: floowColors.tailwind.gray[300],
    borderRadius: rem(2),
  },
}));

export const Table = styled('table')(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  minWidth: rem(560),
}));

export const Th = styled('th')(({ theme }) => ({
  padding: `${rem(10)} ${rem(16)}`,
  fontSize: rem(11),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  backgroundColor: floowColors.tailwind.gray[50],
  whiteSpace: 'nowrap',
}));

// Header row — no pointer cursor, no hover highlight
export const Tr = styled('tr')(() => ({
  // header row only
}));

// Data rows — 3.5rem height, clickable
export const DataTr = styled('tr')(({ theme }) => ({
  height: rem(56),
  maxHeight: rem(56),
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: floowColors.tailwind.gray[50],
  },
}));

export const Td = styled('td')(({ theme }) => ({
  padding: `0 ${rem(16)}`,
  height: rem(56),
  maxHeight: rem(56),
  fontSize: rem(13),
  color: theme.palette.text.primary,
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

// Notes cell — truncated with ellipsis
export const NotesTd = styled('td')(({ theme }) => ({
  padding: `0 ${rem(16)}`,
  height: rem(56),
  maxHeight: rem(56),
  maxWidth: rem(180),
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

export const UserBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontWeight: Bold._600,
  fontSize: rem(13),
}));

export const UserAvatar = styled(Box)(({ theme }) => ({
  width: rem(20),
  height: rem(20),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: floowColors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(9),
  fontWeight: Bold._700,
  flexShrink: 0,
}));

export const DurationText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1,
}));

export const ActionCell = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(2),
}));

export const EmptyStateRow = styled('td')(({ theme }) => ({
  padding: theme.spacing(6, 3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: rem(14),
}));

// ─── Note Detail Popup ────────────────────────────────────────────────────────

// Backdrop covers the full viewport for click-outside detection.
// The card is independently fixed-positioned (not flex-centred here).
export const NotePopupBackdrop = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  zIndex: 1300,
  backgroundColor: 'rgba(0, 0, 0, 0.22)',
}));

// Card is fixed-positioned and centred on the clicked row.
// `yOffset` (px from top of viewport) is the row's vertical mid-point.
export const NotePopupCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'yOffset',
})<{ yOffset?: number }>(({ theme, yOffset }) => ({
  position: 'fixed',
  // Horizontally centred in the viewport
  left: '50%',
  // Vertically centred on the clicked row; fall back to viewport centre
  top: yOffset !== undefined ? `${yOffset}px` : '50vh',
  transform: 'translate(-50%, -50%)',
  zIndex: 1301,
  backgroundColor: theme.palette.colors.white,
  borderRadius: rem(12),
  boxShadow: `0 ${rem(8)} ${rem(32)} rgba(0,0,0,0.16)`,
  padding: `${rem(14)} ${rem(18)}`,
  minWidth: rem(180),
  maxWidth: rem(440),
  width: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  [theme.breakpoints.down('sm')]: {
    maxWidth: `calc(100vw - ${rem(32)})`,
    width: `calc(100vw - ${rem(32)})`,
  },
}));

// First line: start→end time + ✕ button
export const NotePopupHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(20),
}));

export const NotePopupTimeValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  lineHeight: 1,
}));

export const NotePopupCloseBtn = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  padding: 0,
  lineHeight: 1,
  fontSize: rem(14),
  borderRadius: '50%',
  width: rem(18),
  height: rem(18),
  flexShrink: 0,
  transition: 'color 0.12s, background-color 0.12s',
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: floowColors.tailwind.gray[100],
  },
}));

export const NotePopupDivider = styled('hr')(({ theme }) => ({
  border: 'none',
  borderTop: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  margin: 0,
}));

// Second line: full note text — wraps naturally, no truncation
export const NotePopupNoteText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
}));

export const AllStepCircle = styled(StepCircle)(() => ({
  fontSize: rem(12),
}));

export const StepNameText = styled(DurationText)(() => ({
  fontWeight: 500,
}));

export const StepSelectDropdown = styled('select')(({ theme }) => ({
  width: '100%',
  height: '40px',
  borderRadius: '8px',
  borderColor: theme.palette.colors.grey_200,
  padding: '0 12px',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: theme.palette.colors.white,
}));
