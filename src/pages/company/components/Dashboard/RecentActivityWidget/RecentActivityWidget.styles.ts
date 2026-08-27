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

export const TimelineContainer = styled(Box)(() => ({
  width: '100%',
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

export const TimelineItem = styled(Box)(() => ({
  display: 'flex',
  gap: rem(16),
  paddingBottom: rem(20),
  position: 'relative',
  '&:last-child': {
    paddingBottom: 0,
    '&::after': {
      display: 'none',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: rem(15), // Align with center of the 30px icon circle
    top: rem(30),
    bottom: 0,
    width: rem(2),
    backgroundColor: '#F3F4F6',
  },
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type: 'status_change' | 'comment' | 'creation' | 'update' }>(({ theme, type }) => {
  let bg = theme.palette.primary.main;
  let fg = theme.palette.primary.contrastText;
  if (type === 'status_change') {
    bg = '#E0F2FE';
    fg = '#0284C7';
  } else if (type === 'comment') {
    bg = '#FEF3C7';
    fg = '#D97706';
  } else if (type === 'creation') {
    bg = '#D1FAE5';
    fg = '#059669';
  } else if (type === 'update') {
    bg = '#F3F4F6';
    fg = '#4B5563';
  }
  return {
    width: rem(30),
    height: rem(30),
    borderRadius: '50%',
    backgroundColor: bg,
    color: fg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 1,
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

export const ActivityText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
  lineHeight: 1.4,
  '& strong': {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
}));

export const MetaText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginTop: rem(2),
}));
