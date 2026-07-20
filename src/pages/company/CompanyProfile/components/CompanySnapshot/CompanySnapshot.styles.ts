import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const SnapshotGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: rem(16),
  width: '100%',
  marginBottom: rem(24),
}));

interface AccentProps {
  accentcolor: string;
}

export const SnapshotTile = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})<AccentProps>(({ theme, accentcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderLeft: `4px solid ${accentcolor}`,
  padding: `${rem(16)} ${rem(20)}`,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.06)',
}));

export const SnapshotIconBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})<AccentProps>(({ accentcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(40),
  height: rem(40),
  borderRadius: rem(10),
  backgroundColor: `${accentcolor}1A`,
  color: accentcolor,
  flexShrink: 0,
  '& svg': {
    fontSize: rem(20),
  },
}));

export const SnapshotTextGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  minWidth: 0,
}));

export const SnapshotLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const SnapshotValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  lineHeight: 1.2,
}));
