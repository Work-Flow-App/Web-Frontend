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
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
  transition: 'color 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
  },
}));

export const ListContainer = styled(Box)(() => ({
  width: '100%',
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

export const TaskRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(10)} 0`,
  borderBottom: `${rem(1)} solid ${theme.palette.grey[100]}`,
  gap: rem(12),
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const TaskName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 500,
  color: theme.palette.text.primary,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const PriorityBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'priority',
})<{ priority: 'High' | 'Medium' | 'Low' }>(({ theme, priority }) => {
  let bg = theme.palette.grey[100];
  let fg = theme.palette.text.primary;
  if (priority === 'High') {
    bg = '#FEE2E2';
    fg = '#EF4444';
  } else if (priority === 'Medium') {
    bg = '#FFEDD5';
    fg = '#F97316';
  } else if (priority === 'Low') {
    bg = '#E0F2FE';
    fg = '#0284C7';
  }
  return {
    fontSize: rem(10),
    fontWeight: 700,
    backgroundColor: bg,
    color: fg,
    padding: `${rem(3)} ${rem(8)}`,
    borderRadius: rem(6),
    textAlign: 'center',
    width: rem(54),
    flexShrink: 0,
  };
});

export const StatusPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: 'In Progress' | 'Pending' | 'Completed' }>(({ theme, status }) => {
  let bg = theme.palette.grey[100];
  let fg = theme.palette.text.primary;
  if (status === 'In Progress') {
    bg = '#E0F2FE';
    fg = '#0284C7';
  } else if (status === 'Pending') {
    bg = '#FEF3C7';
    fg = '#D97706';
  } else if (status === 'Completed') {
    bg = '#D1FAE5';
    fg = '#059669';
  }
  return {
    fontSize: rem(10),
    fontWeight: 700,
    backgroundColor: bg,
    color: fg,
    padding: `${rem(3)} ${rem(8)}`,
    borderRadius: rem(6),
    textAlign: 'center',
    width: rem(74),
    flexShrink: 0,
  };
});

export const DateText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  width: rem(50),
  textAlign: 'right',
  flexShrink: 0,
}));
