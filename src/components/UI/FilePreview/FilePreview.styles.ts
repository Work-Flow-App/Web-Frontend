import { styled, alpha, type Theme } from '@mui/material';
import { rem } from '../Typography/utility';
import type { FileKind } from '../../../utils/attachmentHelpers';

const kindColor = (theme: Theme, kind: FileKind): string => {
  switch (kind) {
    case 'pdf':
      return theme.palette.error.main;
    case 'word':
      return theme.palette.info.main;
    case 'sheet':
      return theme.palette.success.main;
    case 'video':
      return theme.palette.warning.main;
    case 'image':
      return theme.palette.primary.main;
    default:
      return theme.palette.text.secondary;
  }
};

export const Frame = styled('a', {
  shouldForwardProp: (prop) => prop !== 'kind' && prop !== 'aspectRatio',
})<{ kind: FileKind; aspectRatio: string }>(({ theme, kind, aspectRatio }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  aspectRatio,
  overflow: 'hidden',
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(kindColor(theme, kind), 0.08),
  cursor: 'pointer',
  '&:hover img': { opacity: 0.92 },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: rem(2),
  },
}));

export const PreviewImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'isDocument',
})<{ isDocument: boolean }>(({ isDocument }) => ({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  // A document's thumbnail is its first page, so show the top of it
  objectPosition: isDocument ? 'top center' : 'center',
  backgroundColor: '#fff',
  transition: 'opacity 0.15s',
}));

export const TypeIcon = styled('span', {
  shouldForwardProp: (prop) => prop !== 'kind',
})<{ kind: FileKind }>(({ theme, kind }) => ({
  display: 'flex',
  color: kindColor(theme, kind),
  '& svg': { fontSize: rem(44) },
}));

export const TypeBadge = styled('span')(() => ({
  position: 'absolute',
  left: rem(8),
  bottom: rem(8),
  maxWidth: `calc(100% - ${rem(16)})`,
  padding: `${rem(2)} ${rem(6)}`,
  borderRadius: rem(4),
  backgroundColor: 'rgba(17, 24, 39, 0.72)',
  color: '#fff',
  fontSize: rem(10.5),
  fontWeight: 700,
  letterSpacing: '0.04em',
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));
