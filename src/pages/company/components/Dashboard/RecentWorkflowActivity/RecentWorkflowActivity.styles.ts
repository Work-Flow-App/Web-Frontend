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

export const TimelineItem = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: rem(12),
  position: 'relative',
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusType',
})<{ statusType?: string }>(({ statusType }) => {
  let bg = '#E0F2FE';
  let fg = '#0284C7';
  if (statusType === 'completed') {
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
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ theme, status }) => {
  let bg = theme.palette.grey[100];
  let fg = theme.palette.text.secondary;

  if (status === 'completed') {
    bg = '#E6F4EA';
    fg = '#137333';
  } else if (status === 'ongoing' || status === 'started') {
    bg = '#FEF7E0';
    fg = '#B06000';
  } else if (status === 'pending' || status === 'initiated') {
    bg = '#E8F0FE';
    fg = '#1A73E8';
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

export const MetaText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.disabled,
}));
