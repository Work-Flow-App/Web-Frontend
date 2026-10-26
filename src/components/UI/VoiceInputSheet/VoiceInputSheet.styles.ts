import { Box, Drawer, Typography, alpha, keyframes, styled } from '@mui/material';
import { rem } from '../Typography/utility';

const pulse = keyframes`
  from {
    transform: scale(1);
    opacity: 0.5;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scaleY(0.25);
  }
  50% {
    transform: scaleY(1);
  }
`;

export const Sheet = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    maxWidth: rem(560),
    margin: '0 auto',
    borderTopLeftRadius: rem(16),
    borderTopRightRadius: rem(16),
    backgroundColor: theme.palette.background.paper,
    paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom))`,
  },
}));

export const DragHandle = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(4),
  borderRadius: rem(2),
  backgroundColor: theme.palette.colors.grey_200,
  margin: `${theme.spacing(1)} auto 0`,
}));

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2.5),
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

export const Body = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
}));

export const VoicePanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3, 2, 2),
  borderRadius: rem(12),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
}));

export const MicButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  position: 'relative',
  width: rem(72),
  height: rem(72),
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: `0 ${rem(4)} ${rem(14)} ${alpha(theme.palette.primary.main, 0.35)}`,
  transition: 'transform 0.15s ease',
  '& svg': {
    position: 'relative',
    fontSize: rem(30),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    opacity: 0,
    animation: active ? `${pulse} 1.4s ease-out infinite` : 'none',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:focus-visible': {
    outline: `${rem(3)} solid ${alpha(theme.palette.primary.main, 0.4)}`,
    outlineOffset: rem(3),
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
}));

export const Bars = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(3),
  height: rem(24),
  marginTop: theme.spacing(0.5),
}));

export const Bar = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ theme, active }) => ({
  width: rem(3),
  height: '100%',
  borderRadius: rem(2),
  backgroundColor: theme.palette.primary.main,
  opacity: active ? 1 : 0.3,
  transform: 'scaleY(0.25)',
  animation: active ? `${bounce} 0.9s ease-in-out infinite` : 'none',
}));

export const Status = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isError',
})<{ isError?: boolean }>(({ theme, isError }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  minHeight: rem(18),
  fontSize: rem(12),
  fontWeight: 500,
  textAlign: 'center',
  color: isError ? theme.palette.error.main : theme.palette.text.secondary,
}));

export const ListeningLabel = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const RecordingDot = styled('span')(({ theme }) => ({
  width: rem(8),
  height: rem(8),
  borderRadius: '50%',
  backgroundColor: theme.palette.error.main,
}));

export const Elapsed = styled('span')(({ theme }) => ({
  marginLeft: rem(4),
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums',
}));

export const DraftTextArea = styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: rem(64),
  padding: theme.spacing(1.5, 2),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.border?.main ?? theme.palette.colors.grey_300}`,
  backgroundColor: theme.palette.colors.white,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: rem(14),
  lineHeight: rem(20),
  resize: 'none',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  '&.keyboard': {
    minHeight: rem(140),
  },
  '&:focus': {
    borderColor: theme.palette.primary.main,
  },
  '&::placeholder': {
    color: theme.palette.text.disabled,
    fontStyle: 'italic',
  },
}));

export const ModeToggle = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  alignSelf: 'center',
  padding: theme.spacing(0.5, 1),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: rem(18),
  },
  '&:hover': {
    color: theme.palette.text.primary,
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
}));
