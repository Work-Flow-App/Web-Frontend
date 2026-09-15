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

export const TimelineContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(14),
  flex: 1,
  overflowY: 'auto',
  maxHeight: rem(290), // Enable scrolling for up to 10 items
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

export const TimelineItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(12),
  position: 'relative',
  cursor: 'pointer',
  padding: `${rem(6)} ${rem(8)}`,
  borderRadius: rem(8),
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusType' && prop !== 'activityType',
})<{ statusType?: string; activityType?: string }>(({ statusType, activityType }) => {
  const type = activityType?.toUpperCase();
  let bg = '#E0F2FE';
  let fg = '#0284C7';

  if (type === 'COMMENT' || type === 'COMMENT_ADDED') {
    bg = '#EEF2FF';
    fg = '#6366F1';
  } else if (type === 'ATTACHMENT_ADDED') {
    bg = '#FDF2F8';
    fg = '#EC4899';
  } else if (type === 'ATTACHMENT_REMOVED' || type === 'ATTACHMENT_DELETED') {
    bg = '#FEE2E2';
    fg = '#EF4444';
  } else if (type === 'WORKER_ASSIGNED' || type === 'WORKER_UNASSIGNED') {
    bg = '#EFF6FF';
    fg = '#3B82F6';
  } else if (type === 'STATUS_CHANGED') {
    bg = '#F5F3FF';
    fg = '#8B5CF6';
  } else if (type === 'STEP_CREATED') {
    bg = '#ECFDF5';
    fg = '#10B981';
  } else if (statusType === 'completed') {
    bg = '#D1FAE5';
    fg = '#059669';
  } else if (statusType === 'ongoing' || statusType === 'started') {
    bg = '#FFEDD5';
    fg = '#EA580C';
  } else if (statusType === 'failed') {
    bg = '#FEE2E2';
    fg = '#EF4444';
  }

  return {
    width: rem(28),
    height: rem(28),
    borderRadius: '50%',
    backgroundColor: bg,
    color: fg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: rem(14),
    '& svg': {
      fontSize: rem(16),
    },
  };
});

export const ContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  flex: 1,
  minWidth: 0,
}));

export const ActivityLine = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(6),
}));

export const JobIdText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

export const WorkflowNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const StepNameText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'badgeType',
})<{ status?: string; badgeType?: string }>(({ theme, status, badgeType }) => {
  let bg = theme.palette.grey[100];
  let fg = theme.palette.text.secondary;

  const t = (badgeType || status)?.toLowerCase();
  if (t === 'comment') {
    bg = '#EEF2FF';
    fg = '#4F46E5';
  } else if (t === 'attachment') {
    bg = '#FDF2F8';
    fg = '#DB2777';
  } else if (t === 'assigned' || t === 'worker') {
    bg = '#EFF6FF';
    fg = '#2563EB';
  } else if (t === 'completed' || t === 'created') {
    bg = '#E6F4EA';
    fg = '#137333';
  } else if (t === 'ongoing' || t === 'started') {
    bg = '#FEF7E0';
    fg = '#B06000';
  } else if (t === 'pending' || t === 'initiated') {
    bg = '#E8F0FE';
    fg = '#1A73E8';
  } else if (t === 'alert' || t === 'failed') {
    bg = '#FEE2E2';
    fg = '#DC2626';
  }

  return {
    fontSize: rem(10),
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: `${rem(2)} ${rem(8)}`,
    borderRadius: rem(12),
    backgroundColor: bg,
    color: fg,
  };
});

export const MessageText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  lineHeight: 1.35,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  marginTop: rem(2),
}));

export const MetaText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.disabled,
}));
