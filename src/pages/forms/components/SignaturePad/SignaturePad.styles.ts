import { Box, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

// Kept in sync with CANVAS_HEIGHT in SignaturePad.tsx - the canvas backing store is sized
// against this wrapper's clientWidth/height, so both must agree on the drawable area.
export const CANVAS_HEIGHT = 220;

export const PadWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
}));

export const Hint = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: rem(13),
  color: theme.palette.text.secondary,
}));

export const CanvasWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: rem(CANVAS_HEIGHT),
  borderRadius: rem(10),
  border: `1px dashed ${floowColors.slate.light || theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : floowColors.grey[50],
  overflow: 'hidden',
  '& canvas': {
    display: 'block',
    touchAction: 'none',
    cursor: 'crosshair',
  },
}));

export const Placeholder = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: rem(16),
  bottom: rem(16),
  fontSize: rem(13),
  color: theme.palette.text.disabled,
  pointerEvents: 'none',
}));

export const ActionsRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));
