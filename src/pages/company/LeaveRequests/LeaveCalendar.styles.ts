import { Box, Typography, IconButton, styled } from '@mui/material';
import { rem, Bold } from '../../../components/UI/Typography/utility';

export const CalendarHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: rem(16),
}));

export const MonthLabel = styled(Typography)(() => ({
  fontWeight: Bold._600,
  minWidth: rem(160),
  textAlign: 'center',
}));

export const NavButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
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

export const DayNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth',
})<{ isCurrentMonth: boolean }>(({ theme, isCurrentMonth }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: isCurrentMonth ? theme.palette.text.primary : theme.palette.text.disabled,
}));

export const EntryChip = styled(Box)(({ theme }) => ({
  fontSize: rem(11),
  padding: `${rem(2)} ${rem(6)}`,
  borderRadius: rem(6),
  backgroundColor: theme.palette.colors.grey_100,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));
