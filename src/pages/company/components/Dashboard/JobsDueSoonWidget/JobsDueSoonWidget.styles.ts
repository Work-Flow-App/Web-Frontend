import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  padding: rem(20),
  display: 'flex',
  flexDirection: 'column',
  height: rem(380),
  maxHeight: rem(380),
  width: '100%',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  boxSizing: 'border-box',
}));

export const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: rem(16),
  flexShrink: 0,
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ActionLink = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
  },
}));

export const ListContainer = styled(Box)(() => ({
  width: '100%',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: rem(14),
  paddingRight: rem(6),
  '&::-webkit-scrollbar': {
    width: rem(4),
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e4e4e7',
    borderRadius: rem(4),
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#d4d4d8',
  },
}));

export const TaskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  padding: `${rem(8)} ${rem(8)}`,
  borderRadius: rem(8),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  flexShrink: 0,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const DateBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(52),
  height: rem(54),
  borderRadius: rem(10),
  backgroundColor: theme.palette.grey[50],
  border: `${rem(1)} solid ${theme.palette.grey[200]}`,
  flexShrink: 0,
}));

export const MonthText = styled(Typography)(() => ({
  fontSize: rem(9),
  fontWeight: 800,
  color: '#EF4444', // Red monthly marker
  textTransform: 'uppercase',
  lineHeight: 1,
}));

export const DayText = styled(Typography)(({ theme }) => ({
  fontSize: rem(20),
  fontWeight: 800,
  color: theme.palette.text.primary,
  lineHeight: 1.1,
  marginTop: rem(2),
}));

export const TaskDetails = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  flex: 1,
  minWidth: 0,
}));

export const TaskNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const SubRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const PriorityLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority: 'High' | 'Medium' | 'Low' }>(({ theme, priority }) => {
  let color = theme.palette.text.secondary;
  if (priority === 'High') color = '#EF4444';
  else if (priority === 'Medium') color = '#F97316';
  else if (priority === 'Low') color = '#0284C7';
  return {
    fontSize: rem(11),
    fontWeight: 600,
    color,
  };
});

export const Bullet = styled(Box)(({ theme }) => ({
  width: rem(4),
  height: rem(4),
  borderRadius: '50%',
  backgroundColor: theme.palette.grey[400],
}));

export const StatusText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
}));
