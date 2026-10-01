import { Box, Typography, styled, ToggleButtonGroup, ToggleButton, Popover } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import UpdateIcon from '@mui/icons-material/Update';
import BlockIcon from '@mui/icons-material/Block';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { rem, Bold } from '../../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../../theme/colors';

// ─── Main Container ───────────────────────────────────────────────────────────
export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  '@media (max-width: 600px)': {
    gap: theme.spacing(1.5),
  },
}));

// ─── Top 4 KPI Cards Grid ─────────────────────────────────────────────────────
export const ActivityLogStatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: theme.spacing(1.5),
  width: '100%',
  '@media (max-width: 900px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  '@media (max-width: 600px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: rem(8),
  },
}));

export const ActivityWhiteCard = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(12),
  padding: `${rem(12)} ${rem(14)}`,
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: rem(84),
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.04)`,
  '@media (max-width: 600px)': {
    padding: `${rem(9)} ${rem(10)}`,
    minHeight: rem(76),
    borderRadius: rem(10),
  },
}));

export const ActivityDarkCard = styled(Box)(() => ({
  backgroundColor: floowColors.dark.primary,
  borderRadius: rem(12),
  padding: `${rem(12)} ${rem(14)}`,
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: rem(84),
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.04)`,
  '@media (max-width: 600px)': {
    padding: `${rem(9)} ${rem(10)}`,
    minHeight: rem(76),
    borderRadius: rem(10),
  },
}));

export const StatCardLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  letterSpacing: rem(0.4),
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  lineHeight: 1.2,
  marginBottom: rem(2),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 600px)': {
    fontSize: rem(9.5),
    letterSpacing: rem(0.2),
  },
}));

export const StatCardValueContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: rem(2),
}));

export const StatCardValueMain = styled(Typography)(({ theme }) => ({
  fontSize: rem(20),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: rem(16),
  },
}));

export const StatCardValueSub = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  '@media (max-width: 600px)': {
    fontSize: rem(11),
  },
}));

export const StatProgressBarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: rem(5),
  backgroundColor: theme.palette.action.hover,
  borderRadius: rem(3),
  marginTop: rem(4),
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    height: rem(4),
    marginTop: rem(3),
  },
}));

export const StatProgressBarFill = styled(Box)<{ progress: number }>(({ theme, progress }) => ({
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  width: `${progress}%`,
  borderRadius: rem(3),
  transition: 'width 0.3s ease-in-out',
}));

export const StatCardFooterText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginTop: rem(3),
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 600px)': {
    fontSize: rem(9.5),
    marginTop: rem(2),
  },
}));

export const DarkCardLabel = styled(Typography)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  letterSpacing: rem(0.4),
  color: 'rgba(255,255,255,0.55)',
  textTransform: 'uppercase',
  lineHeight: 1.2,
  marginBottom: rem(2),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 600px)': {
    fontSize: rem(9.5),
    letterSpacing: rem(0.2),
  },
}));

export const DarkCardValue = styled(Typography)(() => ({
  fontSize: rem(20),
  fontWeight: Bold._700,
  color: floowColors.white,
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: rem(16),
  },
}));

export const DarkCardSubtext = styled(Typography)(() => ({
  fontSize: rem(11),
  color: 'rgba(255,255,255,0.4)',
  marginTop: rem(3),
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 600px)': {
    fontSize: rem(9.5),
    marginTop: rem(2),
  },
}));


// ─── Header Card ──────────────────────────────────────────────────────────────
export const HeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  borderRadius: rem(14),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  padding: theme.spacing(1.75, 2.25),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  boxShadow: `0 ${rem(1)} ${rem(4)} rgba(0, 0, 0, 0.04)`,
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.25, 1.5),
    gap: theme.spacing(1),
  },
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: rem(15),
  },
}));

export const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  marginTop: rem(3),
  lineHeight: 1.3,
  '@media (max-width: 600px)': {
    fontSize: rem(11),
    marginTop: rem(2),
  },
}));

export const PillToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: '#F3F4F6',
  borderRadius: rem(9999),
  padding: rem(2.5),
  border: 'none',
  '& .MuiToggleButtonGroup-grouped': {
    border: 'none !important',
    borderRadius: `${rem(9999)} !important`,
    padding: `${rem(5)} ${rem(14)}`,
    fontSize: rem(12),
    fontWeight: Bold._500,
    color: theme.palette.text.secondary,
    textTransform: 'none',
    minWidth: 0,
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: floowColors.white,
      fontWeight: Bold._600,
      boxShadow: `0 ${rem(2)} ${rem(6)} rgba(59, 130, 246, 0.35)`,
    },
    '&:hover:not(.Mui-selected)': {
      backgroundColor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
    '@media (max-width: 600px)': {
      padding: `${rem(4)} ${rem(9)}`,
      fontSize: rem(11),
    },
  },
}));

export const PillToggleButton = styled(ToggleButton)(() => ({
  textTransform: 'none',
}));

// ─── Timeline Card & Scroll Wrapper ──────────────────────────────────────────
export const TimelineCard = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  borderRadius: rem(14),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
  boxShadow: `0 ${rem(1)} ${rem(4)} rgba(0, 0, 0, 0.04)`,
}));

export const TimelineScrollWrapper = styled(Box)(() => ({
  width: '100%',
  overflowX: 'auto',
  position: 'relative',
  '&::-webkit-scrollbar': {
    height: rem(6),
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#D1D5DB',
    borderRadius: rem(3),
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#F3F4F6',
  },
}));

export const TimelineInnerTable = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: '100%',
  width: 'max-content',
}));

// ─── Table Header Row ─────────────────────────────────────────────────────────
export const TableHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#F9FAFB',
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  position: 'relative',
}));

export const StepColumnHeader = styled(Box)(({ theme }) => ({
  width: rem(250),
  minWidth: rem(250),
  padding: theme.spacing(1.25, 1.75),
  borderRight: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: rem(11.5),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  position: 'sticky',
  left: 0,
  backgroundColor: '#F9FAFB',
  zIndex: 30,
  boxShadow: `${rem(2)} 0 ${rem(6)} rgba(0,0,0,0.04)`,
  '@media (max-width: 600px)': {
    width: rem(48),
    minWidth: rem(48),
    padding: `${rem(8)} ${rem(2)}`,
    justifyContent: 'center',
  },
}));

export const StepHeaderListIcon = styled(FormatListBulletedIcon)(() => ({
  fontSize: rem(15),
  color: '#6B7280',
}));

export const StepHeaderText = styled('span')(() => ({
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

interface DaysHeaderWrapperProps {
  totalWidth: number;
}

export const DaysHeaderWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'totalWidth',
})<DaysHeaderWrapperProps>(({ totalWidth }) => ({
  display: 'flex',
  width: `${totalWidth}px`,
  position: 'relative',
}));

interface DayHeaderCellProps {
  isToday?: boolean;
  isWeekend?: boolean;
  colWidth: number;
}

export const DayHeaderCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isToday' && prop !== 'isWeekend' && prop !== 'colWidth',
})<DayHeaderCellProps>(({ theme, isToday, isWeekend, colWidth }) => ({
  width: `${colWidth}px`,
  minWidth: `${colWidth}px`,
  padding: `${rem(6)} ${rem(2)}`,
  textAlign: 'center',
  borderRight: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isToday ? '#EFF6FF' : isWeekend ? '#F9FAFB' : 'transparent',
  userSelect: 'none',
  '@media (max-width: 600px)': {
    padding: `${rem(4)} ${rem(1)}`,
  },
}));

export const DayMonthText = styled(Typography)(({ theme }) => ({
  fontSize: rem(9.5),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  lineHeight: 1.1,
  '@media (max-width: 600px)': {
    fontSize: rem(8.5),
  },
}));

interface DayNumberTextProps {
  isToday?: boolean;
}

export const DayNumberText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isToday',
})<DayNumberTextProps>(({ theme, isToday }) => ({
  fontSize: rem(12.5),
  fontWeight: isToday ? Bold._700 : Bold._600,
  color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
  lineHeight: 1.2,
  marginTop: rem(1),
  '@media (max-width: 600px)': {
    fontSize: rem(11),
  },
}));

// Pinned Red Today Badge
interface TodayBadgeProps {
  leftPos: number;
}

export const TodayBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'leftPos',
})<TodayBadgeProps>(({ leftPos }) => ({
  position: 'absolute',
  top: rem(2),
  left: `${leftPos}px`,
  transform: 'translateX(-50%)',
  backgroundColor: '#EF4444',
  color: floowColors.white,
  fontSize: rem(9.5),
  fontWeight: Bold._700,
  padding: `${rem(1)} ${rem(6)}`,
  borderRadius: rem(4),
  boxShadow: `0 ${rem(2)} ${rem(4)} rgba(239, 68, 68, 0.4)`,
  zIndex: 14,
  pointerEvents: 'none',
  letterSpacing: '0.02em',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: rem(-3),
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: `${rem(3)} solid transparent`,
    borderRight: `${rem(3)} solid transparent`,
    borderTop: `${rem(3)} solid #EF4444`,
  },
  '@media (max-width: 600px)': {
    fontSize: rem(8),
    padding: `${rem(1)} ${rem(4)}`,
  },
}));

// Vertical Today Red Line
interface TodayVerticalLineProps {
  leftPos: number;
}

export const TodayVerticalLine = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'leftPos',
})<TodayVerticalLineProps>(({ leftPos }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: `${leftPos}px`,
  width: rem(2),
  backgroundColor: '#EF4444',
  zIndex: 5,
  pointerEvents: 'none',
}));

// ─── Table Body & Rows ────────────────────────────────────────────────────────
export const TableBody = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const TableRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: rem(68),
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  transition: 'background-color 0.15s ease',
  backgroundColor: floowColors.white,
  '&:hover': {
    backgroundColor: '#F8FAFC',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '@media (max-width: 600px)': {
    minHeight: rem(54),
  },
}));

// Step Left Cell (Sticky on Horizontal Scroll, collapses to 48px on phone)
export const StepCell = styled(Box)(({ theme }) => ({
  width: rem(250),
  minWidth: rem(250),
  padding: theme.spacing(1.25, 1.75),
  borderRight: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  position: 'sticky',
  left: 0,
  backgroundColor: floowColors.white,
  zIndex: 20,
  boxShadow: `${rem(2)} 0 ${rem(6)} rgba(0,0,0,0.04)`,
  '@media (max-width: 600px)': {
    width: rem(48),
    minWidth: rem(48),
    padding: `${rem(6)} ${rem(2)}`,
    justifyContent: 'center',
    gap: 0,
    cursor: 'pointer',
  },
}));

interface StepIconCircleProps {
  iconBgColor?: string;
  iconColor?: string;
}

export const StepIconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconBgColor' && prop !== 'iconColor',
})<StepIconCircleProps>(({ iconBgColor, iconColor }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: iconBgColor || '#EFF6FF',
  color: iconColor || '#2563EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: `${rem(1.5)} solid ${iconColor || '#2563EB'}40`,
  cursor: 'pointer',
  transition: 'transform 0.15s ease',
  '&:hover': {
    transform: 'scale(1.08)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: rem(16),
  },
  '@media (max-width: 600px)': {
    width: rem(28),
    height: rem(28),
  },
}));

// Displayed inside StepIconCircle on mobile
export const StepNumberIconLabel = styled(Typography)(() => ({
  display: 'none',
  fontSize: rem(12),
  fontWeight: Bold._700,
  lineHeight: 1,
  '@media (max-width: 600px)': {
    display: 'block',
  },
}));

// Step icon visible on desktop
export const StepStatusIconBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

export const StepInfoBox = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 600px)': {
    display: 'none',
  },
}));

export const StepNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.3,
}));

export const StepMetaRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(5),
  marginTop: rem(2),
  flexWrap: 'wrap',
}));

interface StepStatusBadgeProps {
  badgeBg?: string;
  badgeColor?: string;
}

export const StepStatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeBg' && prop !== 'badgeColor',
})<StepStatusBadgeProps>(({ badgeBg, badgeColor }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${rem(1)} ${rem(6)}`,
  borderRadius: rem(9999),
  backgroundColor: badgeBg || '#F3F4F6',
  color: badgeColor || '#6B7280',
  border: `${rem(1)} solid ${badgeColor || '#6B7280'}30`,
  fontSize: rem(10),
  fontWeight: Bold._600,
  lineHeight: 1.2,
  flexShrink: 0,
  letterSpacing: '0.01em',
}));

export const StepSubText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1.3,
}));

// ─── Timeline Matrix Cell & Floating Bars ─────────────────────────────────────
interface TimelineCellProps {
  totalWidth: number;
}

export const TimelineCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'totalWidth',
})<TimelineCellProps>(({ totalWidth }) => ({
  display: 'flex',
  width: `${totalWidth}px`,
  position: 'relative',
  alignItems: 'center',
}));

// Background day column grid lines
export const GridColumnsContainer = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  pointerEvents: 'none',
}));

interface GridColumnProps {
  isWeekend?: boolean;
  isToday?: boolean;
  colWidth: number;
}

export const GridColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isWeekend' && prop !== 'isToday' && prop !== 'colWidth',
})<GridColumnProps>(({ theme, isWeekend, isToday, colWidth }) => ({
  width: `${colWidth}px`,
  minWidth: `${colWidth}px`,
  borderRight: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  backgroundColor: isToday ? '#EFF6FF25' : isWeekend ? '#F9FAFB35' : 'transparent',
  zIndex: 1,
}));

// Floating Pill Duration Bar with multi-layered gradient pattern
interface PillDurationBarProps {
  leftPos: number;
  barWidth: number;
  gradientColor?: string;
  isCompleted?: boolean;
}

export const PillDurationBar = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'leftPos' &&
    prop !== 'barWidth' &&
    prop !== 'gradientColor' &&
    prop !== 'isCompleted',
})<PillDurationBarProps>(({ leftPos, barWidth, gradientColor, isCompleted }) => {
  const baseGradient =
    gradientColor ||
    (isCompleted
      ? 'linear-gradient(90deg, #4ADE80 0%, #22C55E 100%)'
      : 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)');

  const fullBackground = isCompleted
    ? `repeating-linear-gradient(-45deg, transparent, transparent ${rem(5)}, rgba(255,255,255,0.22) ${rem(5)}, rgba(255,255,255,0.22) ${rem(10)}), ${baseGradient}`
    : baseGradient;

  return {
    position: 'absolute',
    left: `${leftPos}px`,
    width: `${barWidth}px`,
    height: rem(28),
    borderRadius: rem(9999),
    background: fullBackground,
    backgroundColor: isCompleted ? '#22C55E' : '#3B82F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isCompleted
      ? `0 ${rem(2)} ${rem(6)} rgba(34, 197, 94, 0.3)`
      : `0 ${rem(2)} ${rem(6)} rgba(59, 130, 246, 0.3)`,
    cursor: 'pointer',
    zIndex: 4,
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: isCompleted
        ? `0 ${rem(4)} ${rem(12)} rgba(34, 197, 94, 0.45)`
        : `0 ${rem(4)} ${rem(12)} rgba(59, 130, 246, 0.45)`,
      zIndex: 6,
    },
    '@media (max-width: 600px)': {
      height: rem(22),
    },
  };
});

// Circular Icon Badge (z-index: 8 resting, 12 hover - always under sticky step column which is z-index: 20)
interface ActivityCircleBadgeProps {
  leftPos: number;
  chipColor?: string;
  isOnBar?: boolean;
}

export const ActivityCircleBadge = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'leftPos' && prop !== 'chipColor' && prop !== 'isOnBar',
})<ActivityCircleBadgeProps>(({ leftPos, chipColor, isOnBar }) => ({
  position: 'absolute',
  left: `${leftPos}px`,
  transform: 'translateX(-50%)',
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  backgroundColor: isOnBar ? '#FFFFFF' : `${chipColor || '#10B981'}20`,
  border: `${rem(1.5)} solid ${chipColor || '#10B981'}`,
  color: chipColor || '#10B981',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 8,
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.12)`,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translateX(-50%) scale(1.2)',
    boxShadow: `0 ${rem(3)} ${rem(8)} ${chipColor || '#10B981'}40`,
    zIndex: 12,
  },
  '& *': {
    pointerEvents: 'none',
  },
  '@media (max-width: 600px)': {
    width: rem(20),
    height: rem(20),
    '& .MuiSvgIcon-root': {
      fontSize: rem(10.5),
    },
  },
}));

// Small count badge over icon if multiple activities
export const ActivityCountBadge = styled(Box)(() => ({
  position: 'absolute',
  top: rem(-3),
  right: rem(-3),
  minWidth: rem(13),
  height: rem(13),
  borderRadius: rem(6.5),
  backgroundColor: '#111827',
  color: '#FFFFFF',
  fontSize: rem(8),
  fontWeight: Bold._700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${rem(1.5)}`,
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0,0,0,0.3)`,
  pointerEvents: 'none',
  '@media (max-width: 600px)': {
    minWidth: rem(11),
    height: rem(11),
    fontSize: rem(7),
    top: rem(-3),
    right: rem(-3),
  },
}));

// ─── Step Details Click Popover (Mobile & Desktop) ────────────────────────────
export const StepPopoverPaper = styled(Box)(({ theme }) => ({
  width: rem(280),
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  backgroundColor: floowColors.white,
}));

export const StepPopoverTopRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(8),
}));

export const StepPopoverNumberBadge = styled(Box)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._700,
  padding: `${rem(2)} ${rem(7)}`,
  borderRadius: rem(6),
  backgroundColor: '#F3F4F6',
  color: '#374151',
}));

export const StepPopoverTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

export const StepPopoverDetailItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(12),
  color: '#4B5563',
  '& .MuiSvgIcon-root': {
    fontSize: rem(14),
    color: '#9CA3AF',
  },
}));

export const StepPopoverCalendarIcon = styled(CalendarTodayIcon)(() => ({
  fontSize: rem(14),
  color: '#9CA3AF',
}));

export const StepPopoverActorIcon = styled(PersonIcon)(() => ({
  fontSize: rem(14),
  color: '#9CA3AF',
}));

export const StepPopoverActionIcon = styled(TimelineIcon)(() => ({
  fontSize: rem(14),
  color: '#9CA3AF',
}));

// ─── Legend Card ──────────────────────────────────────────────────────────────
export const LegendCard = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  borderRadius: rem(14),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  padding: theme.spacing(1.5, 2.25),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
  boxShadow: `0 ${rem(1)} ${rem(4)} rgba(0, 0, 0, 0.04)`,
  '@media (max-width: 600px)': {
    padding: theme.spacing(1, 1.25),
    gap: theme.spacing(1),
  },
}));

export const LegendTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(10.5),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}));

export const LegendBadgesWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  '@media (max-width: 600px)': {
    gap: theme.spacing(1),
  },
}));

export const LegendItem = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: rem(11.5),
  fontWeight: Bold._500,
  color: theme.palette.text.primary,
  '@media (max-width: 600px)': {
    fontSize: rem(10.5),
  },
}));

export const LegendIconCompleted = styled(CheckCircleIcon)(() => ({
  fontSize: rem(14),
  color: '#16A34A',
}));

export const LegendIconInProgress = styled(AccessTimeIcon)(() => ({
  fontSize: rem(14),
  color: '#2563EB',
}));

export const LegendIconPending = styled(PersonIcon)(() => ({
  fontSize: rem(14),
  color: '#D97706',
}));

export const LegendIconReady = styled(PlayCircleOutlineIcon)(() => ({
  fontSize: rem(14),
  color: '#4F46E5',
}));

export const LegendIconToDo = styled(LocalShippingIcon)(() => ({
  fontSize: rem(14),
  color: '#6B7280',
}));

export const LegendIconSkipped = styled(BlockIcon)(() => ({
  fontSize: rem(14),
  color: '#DC2626',
}));

// ─── Recent Activity Section ──────────────────────────────────────────────────
export const RecentActivitySection = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(14),
  overflow: 'hidden',
  boxShadow: `0 ${rem(1)} ${rem(4)} rgba(0, 0, 0, 0.04)`,
}));

export const RecentActivityLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontSize: rem(11.5),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.6),
  padding: theme.spacing(1.75, 2.5),
  borderBottom: `${rem(1)} solid ${theme.palette.colors.grey_100}`,
  '@media (max-width: 600px)': {
    padding: theme.spacing(1.25, 1.75),
    fontSize: rem(10.5),
  },
}));

export const RecentActivityBadge = styled(Box)(({ theme }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: rem(6),
  backgroundColor: theme.palette.action.selected,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(8.5),
  fontWeight: Bold._700,
  color: theme.palette.text.secondary,
  flexShrink: 0,
  letterSpacing: rem(0.5),
  transition: 'all 0.15s ease',
}));

export const RecentActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25, 2.5),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  transition: 'background-color 0.15s ease',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  [`&:hover ${RecentActivityBadge}`]: {
    backgroundColor: floowColors.blue[100],
    color: floowColors.blue.dark,
  },
  '@media (max-width: 600px)': {
    padding: theme.spacing(1, 1.5),
  },
}));

export const RecentActivityContent = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const RecentActivityText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12.5),
  color: theme.palette.text.secondary,
  lineHeight: 1.35,
  '@media (max-width: 600px)': {
    fontSize: rem(11.5),
  },
}));

export const RecentActorName = styled('span')(({ theme }) => ({
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
}));

export const RecentStepBullet = styled('span')(({ theme }) => ({
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
}));

export const RecentTimeText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11.5),
  color: theme.palette.text.disabled,
  flexShrink: 0,
  marginLeft: theme.spacing(1.5),
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    fontSize: rem(10.5),
  },
}));

// ─── Tooltip Styled Components ────────────────────────────────────────────────
export const GanttTooltipBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  maxWidth: rem(260),
}));

export const GanttTooltipHeader = styled(Box)(({ theme }) => ({
  fontSize: rem(11.5),
  fontWeight: Bold._600,
  opacity: 0.9,
  paddingBottom: theme.spacing(0.5),
  borderBottom: `${rem(1)} solid rgba(255,255,255,0.2)`,
  marginBottom: theme.spacing(0.25),
}));

export const GanttTooltipTitle = styled(Box)(() => ({
  fontWeight: Bold._600,
  fontSize: rem(11),
}));

export const GanttTooltipDetail = styled(Box)(() => ({
  fontSize: rem(10.5),
  opacity: 0.85,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const GanttTooltipMeta = styled(Box)(() => ({
  fontSize: rem(9.5),
  opacity: 0.55,
}));

export const GanttTooltipDivider = styled(Box)(({ theme }) => ({
  height: rem(1),
  backgroundColor: 'rgba(255,255,255,0.12)',
  margin: theme.spacing(0.5, 0),
}));

export const GanttTooltipMore = styled(Box)(({ theme }) => ({
  fontSize: rem(10.5),
  opacity: 0.6,
  fontStyle: 'italic',
  paddingTop: theme.spacing(0.5),
  borderTop: `${rem(1)} solid rgba(255,255,255,0.12)`,
  marginTop: theme.spacing(0.25),
}));

// ─── Popover Styled Components ────────────────────────────────────────────────
export const StyledPopover = styled(Popover)(() => ({
  '& .MuiPaper-root': {
    borderRadius: rem(12),
    overflow: 'hidden',
    boxShadow: `0 ${rem(8)} ${rem(24)} rgba(0,0,0,0.15)`,
  },
}));

export const ActivityPopoverPaper = styled(Box)(({ theme }) => ({
  width: rem(300),
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '@media (max-width: 600px)': {
    width: rem(260),
  },
}));

export const ActivityPopoverHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.75),
  backgroundColor: theme.palette.background.default,
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const ActivityPopoverTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12.5),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const ActivityPopoverBadge = styled(Typography)(({ theme }) => ({
  fontSize: rem(10.5),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.action.hover,
  borderRadius: rem(8),
  padding: `${rem(2)} ${rem(7)}`,
  flexShrink: 0,
}));

export const ActivityPopoverList = styled(Box)(() => ({
  overflowY: 'auto',
  maxHeight: rem(320),
}));

export const ActivityPopoverItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.25, 1.75),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  transition: 'background-color 0.12s ease',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

interface ActivityPopoverIconBoxProps {
  iconColor?: string;
}

export const ActivityPopoverIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconColor',
})<ActivityPopoverIconBoxProps>(({ iconColor }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: rem(6),
  backgroundColor: `${iconColor || '#9CA3AF'}18`,
  border: `${rem(1.5)} solid ${iconColor || '#9CA3AF'}40`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: iconColor || '#9CA3AF',
  flexShrink: 0,
  marginTop: rem(1),
  '& .MuiSvgIcon-root': {
    fontSize: rem(13),
  },
}));

export const ActivityPopoverContent = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const ActivityPopoverItemType = styled(Typography)(({ theme }) => ({
  fontSize: rem(11.5),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

export const ActivityPopoverItemMessage = styled(Typography)(({ theme }) => ({
  fontSize: rem(11.5),
  color: theme.palette.text.secondary,
  lineHeight: 1.35,
  marginTop: rem(2),
}));

export const ActivityPopoverItemMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(10.5),
  color: theme.palette.text.disabled,
  marginTop: rem(2),
}));

// ─── Empty State ──────────────────────────────────────────────────────────────
export const DocumentsEmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(5, 2),
  textAlign: 'center',
  backgroundColor: floowColors.white,
  borderRadius: rem(14),
  border: `${rem(1)} solid ${theme.palette.colors.grey_200}`,
}));

export const DocumentsEmptyIcon = styled(Box)(({ theme }) => ({
  width: rem(56),
  height: rem(56),
  borderRadius: '50%',
  backgroundColor: theme.palette.colors.grey_100,
  color: theme.palette.colors.grey_400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1.5),
}));

export const DocumentsEmptyText = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const DocumentsEmptySubtext = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  maxWidth: rem(360),
}));

export const EmptyTimelineIcon = styled(TimelineIcon)(() => ({
  fontSize: rem(28),
}));

// ─── Step Status & Action Icons ───────────────────────────────────────────────
export const StepActionIconCreated = styled(AddCircleOutlineIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconStatus = styled(SwapHorizIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconAssigned = styled(PersonAddIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconUnassigned = styled(PersonIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconUpdated = styled(EditIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconAttachment = styled(UploadFileIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconRemoved = styled(AttachFileIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconDeleted = styled(DeleteOutlineIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconComment = styled(ChatBubbleOutlineIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconVisit = styled(EventNoteIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconVisitDeleted = styled(EventBusyIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconVisitUpdated = styled(UpdateIcon)(() => ({ fontSize: rem(12.5) }));
export const StepActionIconDefault = styled(TimelineIcon)(() => ({ fontSize: rem(12.5) }));

export const StepStatusIconCompleted = styled(CheckCircleIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconInProgress = styled(AccessTimeIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconActive = styled(SettingsIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconPending = styled(PersonIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconScheduled = styled(LocalShippingIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconReview = styled(SearchIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconRequested = styled(PlayCircleOutlineIcon)(() => ({ fontSize: rem(16) }));
export const StepStatusIconSkipped = styled(BlockIcon)(() => ({ fontSize: rem(16) }));

