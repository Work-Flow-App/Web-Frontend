import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  padding: rem(24),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  boxSizing: 'border-box',
}));

export const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: rem(20),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ActionLink = styled(Box)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const ListContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
  flex: 1,
}));

export const TaskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(16),
  paddingBottom: rem(16),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  '&:last-child': {
    paddingBottom: 0,
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
}));

export const TaskNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
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
