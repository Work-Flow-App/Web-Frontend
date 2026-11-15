import { Box, IconButton, Typography, styled } from '@mui/material';
import { rem } from '../Typography/utility';

export const paperSx = {
  backgroundColor: 'rgba(17, 24, 39, 0.97)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
};

export const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  padding: `${rem(10)} ${rem(16)}`,
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  [theme.breakpoints.down('sm')]: {
    padding: `${rem(8)} ${rem(8)} ${rem(8)} ${rem(12)}`,
  },
}));

export const Title = styled(Typography)(() => ({
  flex: 1,
  minWidth: 0,
  fontSize: rem(15),
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const Counter = styled(Typography)(() => ({
  flexShrink: 0,
  fontSize: rem(13),
  color: 'rgba(255, 255, 255, 0.7)',
}));

export const HeaderActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexShrink: 0,
}));

// A plain Button keeps its link props (href, target); a styled() wrapper loses their types
export const headerButtonSx = {
  color: '#fff',
  borderColor: 'rgba(255, 255, 255, 0.4)',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
} as const;

export const IconAction = styled(IconButton)(() => ({
  color: '#fff',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
}));

export const Stage = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(16)} ${rem(64)}`,
  [theme.breakpoints.down('sm')]: {
    padding: rem(8),
  },
}));

export const Image = styled('img', {
  shouldForwardProp: (prop) => prop !== 'loaded',
})<{ loaded: boolean }>(({ loaded }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  borderRadius: rem(4),
  visibility: loaded ? 'visible' : 'hidden',
}));

export const PdfFrame = styled('iframe')(() => ({
  width: '100%',
  height: '100%',
  maxWidth: rem(1100),
  border: 0,
  borderRadius: rem(4),
  backgroundColor: '#fff',
}));

export const Spinner = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.8)',
  pointerEvents: 'none',
}));

export const NavButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'side',
})<{ side: 'left' | 'right' }>(({ side }) => ({
  position: 'absolute',
  top: '50%',
  [side]: rem(12),
  transform: 'translateY(-50%)',
  zIndex: 1,
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.24)' },
  '& svg': { fontSize: rem(28) },
}));

export const NoPreview = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(16),
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.85)',
}));

export const NoPreviewThumbnail = styled('img')(() => ({
  maxWidth: rem(320),
  maxHeight: rem(320),
  borderRadius: rem(6),
  backgroundColor: '#fff',
}));

export const NoPreviewText = styled(Typography)(() => ({
  fontSize: rem(14),
}));
