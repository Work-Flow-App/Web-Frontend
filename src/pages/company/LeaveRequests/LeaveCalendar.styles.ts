import { alpha } from '@mui/material/styles';
import { Box, Typography, IconButton, ButtonBase, styled } from '@mui/material';
import { rem, Bold } from '../../../components/UI/Typography/utility';
import type { LeaveColorKey } from './LeaveCalendar.colors';

export const CalendarHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: rem(12),
  marginBottom: rem(12),
}));

export const MonthNav = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const MonthLabel = styled(Typography)(() => ({
  fontWeight: Bold._600,
  minWidth: rem(140),
  textAlign: 'center',
}));

export const NavButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
}));

export const HeaderRight = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const FilterWrapper = styled(Box)(() => ({
  minWidth: rem(160),
}));

export const LegendToggle = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(6)} ${rem(10)}`,
  borderRadius: rem(8),
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_100,
  },
}));

export const LegendRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(12),
  padding: `${rem(10)} ${rem(12)}`,
  marginBottom: rem(12),
  borderRadius: rem(8),
  backgroundColor: theme.palette.colors.grey_50,
  border: `1px solid ${theme.palette.divider}`,
}));

export const LegendItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(12),
}));

export const LegendDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorKey',
})<{ colorKey: LeaveColorKey }>(({ theme, colorKey }) => ({
  width: rem(9),
  height: rem(9),
  borderRadius: '50%',
  backgroundColor: theme.palette.colors[colorKey],
  flexShrink: 0,
}));

export const WeekdayRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  marginBottom: rem(4),
}));

export const WeekdayCell = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  padding: `${rem(4)} 0`,
}));

export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: rem(4),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: rem(8),
  overflow: 'hidden',
}));

export const DayCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth',
})<{ isCurrentMonth: boolean }>(({ theme, isCurrentMonth }) => ({
  minHeight: rem(96),
  padding: rem(6),
  backgroundColor: isCurrentMonth ? theme.palette.background.paper : theme.palette.colors.grey_50,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const DayNumberRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start',
}));

export const DayNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth' && prop !== 'isToday',
})<{ isCurrentMonth: boolean; isToday: boolean }>(({ theme, isCurrentMonth, isToday }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: isToday ? theme.palette.primary.contrastText : isCurrentMonth ? theme.palette.text.primary : theme.palette.text.disabled,
  ...(isToday && {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    width: rem(20),
    height: rem(20),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
}));

export const EntryChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorKey',
})<{ colorKey: LeaveColorKey }>(({ theme, colorKey }) => {
  const color = theme.palette.colors[colorKey];
  return {
    display: 'flex',
    alignItems: 'center',
    gap: rem(5),
    fontSize: rem(11),
    padding: `${rem(2)} ${rem(6)}`,
    borderRadius: rem(6),
    backgroundColor: alpha(color, 0.14),
    color: theme.palette.mode === 'dark' ? color : theme.palette.text.primary,
    borderLeft: `2px solid ${color}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
});

export const EntryDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'colorKey',
})<{ colorKey: LeaveColorKey }>(({ theme, colorKey }) => ({
  width: rem(6),
  height: rem(6),
  borderRadius: '50%',
  backgroundColor: theme.palette.colors[colorKey],
  flexShrink: 0,
}));

export const EntryLabel = styled('span')(() => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const MoreButton = styled(ButtonBase)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: theme.palette.primary.main,
  padding: `${rem(2)} ${rem(4)}`,
  borderRadius: rem(4),
  alignSelf: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_100,
  },
}));

export const PopoverContent = styled(Box)(() => ({
  padding: rem(12),
  minWidth: rem(220),
  maxWidth: rem(280),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
}));

export const PopoverTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  marginBottom: rem(2),
}));

export const PopoverEntry = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  fontSize: rem(13),
}));
