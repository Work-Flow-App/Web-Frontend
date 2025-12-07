import { rem, Bold } from '../Typography/utility';
import { Box, styled } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { ModalSizes } from './enums';

interface IModalSize {
  size?: ModalSizes;
}

const ZIndex = 8000;

export const ModalContainerWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<IModalSize>(({ theme: { palette, breakpoints }, size }) => ({
  display: 'flex',
  height: 'auto',
  maxHeight: '90vh',
  width: '90vw',
  maxWidth: rem(600),
  ...(size === ModalSizes.MEDIUM && {
    maxWidth: rem(900),
  }),
  ...(size === ModalSizes.LARGE && {
    maxWidth: rem(1200),
  }),
  border: `1px solid ${palette.divider}`,
  borderRadius: rem(16),
  backgroundColor: palette.background.paper,
  boxShadow: '0px 5px 55px rgba(0, 0, 0, 0.05)',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: ZIndex,

  [breakpoints.up('sm')]: {
    width: rem(600),
    maxHeight: '85vh',
    ...(size === ModalSizes.MEDIUM && {
      width: rem(900),
    }),
    ...(size === ModalSizes.LARGE && {
      width: rem(1200),
    }),
  },
}));

export const ModalOverlay = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  position: 'fixed',
  left: '0px',
  top: '0px',
  backgroundColor: palette.common.black,
  opacity: 0.5,
  zIndex: ZIndex,
  pointerEvents: 'none',
}));

export const ModalContentWrapper = styled(Box)(() => ({
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
}));

export const ModalContentContainer = styled(Box)(() => ({
  display: 'flex',
  height: '100%',
  width: '100%',
}));

export const ModalHeaderWrapper = styled(Box)(({ theme: { palette, breakpoints } }) => ({
  display: 'flex',
  width: '100%',
  padding: `${rem(16)} ${rem(16)}`,
  backgroundColor: palette.background.paper,
  borderBottom: `1px solid ${palette.divider}`,
  borderTopLeftRadius: rem(16),
  borderTopRightRadius: rem(16),

  [breakpoints.up('sm')]: {
    padding: `${rem(20)} ${rem(20)}`,
  },
}));

export const ModalBody = styled(Box)(({ theme: { palette, breakpoints } }) => ({
  display: 'flex',
  width: '100%',
  padding: `${rem(20)} ${rem(16)}`,
  maxHeight: 'calc(90vh - 200px)',
  overflowY: 'auto',
  flexDirection: 'column',
  gap: rem(16),

  [breakpoints.up('sm')]: {
    padding: `${rem(40)} ${rem(20)}`,
    maxHeight: 'calc(85vh - 180px)',
    gap: rem(20),
  },

  '&::-webkit-scrollbar': {
    width: rem(8),
  },
  '&::-webkit-scrollbar-track': {
    background: palette.grey[100],
    borderRadius: rem(4),
  },
  '&::-webkit-scrollbar-thumb': {
    background: palette.grey[400],
    borderRadius: rem(4),
    '&:hover': {
      background: palette.grey[500],
    },
  },
}));

export const ModalFooterWrapper = styled(Box)(({ theme: { palette, breakpoints } }) => ({
  display: 'flex',
  width: '100%',
  padding: `${rem(16)} ${rem(16)}`,
  backgroundColor: palette.background.paper,
  borderTop: `1px solid ${palette.divider}`,
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  borderBottomLeftRadius: rem(16),
  borderBottomRightRadius: rem(16),
  flexDirection: 'row',
  flexWrap: 'wrap',

  [breakpoints.up('sm')]: {
    padding: `${rem(20)} ${rem(20)}`,
    gap: rem(20),
    flexWrap: 'nowrap',
  },

  '& button': {
    flex: '1 1 0',
    minWidth: rem(120),
  },
}));

export const ModalHeaderContent = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  position: 'relative',
  flexDirection: 'column',
  gap: rem(4),
}));

export const ModalBackWrapper = styled(Box)(() => ({
  display: 'flex',
  position: 'absolute',
  height: '100%',
  left: 0,
  top: 0,
  gap: rem(8),
  justifyContent: 'flex-start',
  alignItems: 'center',
  cursor: 'pointer',
}));

export const ModalBackText = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  color: palette.primary.main,
  fontSize: rem(14),
  fontWeight: Bold._500,
  lineHeight: rem(20),
}));

export const ModalActionButton = styled(Box)(({ theme: { palette, breakpoints } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: `${rem(12)} ${rem(24)}`,
  gap: rem(10),
  height: rem(48),
  width: '100%',
  borderRadius: rem(8),
  cursor: 'pointer',
  fontSize: rem(16),
  fontWeight: Bold._600,
  lineHeight: rem(27),
  letterSpacing: '0.005em',
  transition: 'all 0.2s ease',

  [breakpoints.up('sm')]: {
    height: rem(51),
    flex: '1 1 0',
    width: 'auto',
  },

  '&:first-of-type': {
    backgroundColor: palette.common.black,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: palette.grey[800],
    },
  },

  '&:last-of-type': {
    backgroundColor: palette.grey[100],
    color: palette.common.black,
    '&:hover': {
      backgroundColor: palette.grey[200],
    },
  },
}));

export const ModalTitle = styled(Box)(({ theme: { palette, breakpoints } }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  color: palette.text.primary,
  fontSize: rem(18),
  fontWeight: Bold._700,
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  flex: 1,

  [breakpoints.up('sm')]: {
    fontSize: rem(24),
    lineHeight: rem(33),
  },

  '&.alignCenter': {
    justifyContent: 'center',
  },
}));

export const ModalSubtitle = styled(Box)(({ theme: { palette } }) => ({
  display: 'flex',
  color: palette.grey[600],
  fontSize: rem(14),
  fontWeight: Bold._500,
  lineHeight: rem(20),
  letterSpacing: '0.005em',
}));

export const ModalBackIcon = styled(ArrowBackIosNewOutlinedIcon)(({ theme: { palette } }) => ({
  display: 'flex',
  color: palette.primary.main,
  height: rem(14),
  width: rem(14),
  fontSize: rem(10),
}));

export const ModalHeaderButton = styled(Box)(() => ({
  display: 'flex',
  width: 'max-content',
}));
