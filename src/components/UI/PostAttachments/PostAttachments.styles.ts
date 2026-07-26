import { Box, Typography, styled } from '@mui/material';
import { rem } from '../Typography/utility';

export const ImageGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'count',
})<{ count: number }>(({ count }) => ({
  display: 'grid',
  gap: rem(4),
  borderRadius: rem(10),
  overflow: 'hidden',
  gridTemplateColumns: count === 1 ? '1fr' : 'repeat(2, 1fr)',
}));

export const ImageGridItem = styled('a', {
  shouldForwardProp: (prop) => prop !== 'span',
})<{ span?: boolean }>(({ span }) => ({
  position: 'relative',
  display: 'block',
  gridColumn: span ? '1 / -1' : undefined,
  aspectRatio: span ? '16 / 9' : '1 / 1',
  overflow: 'hidden',
}));

export const ImageGridImg = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}));

export const ImageGridOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.55)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(18),
  fontWeight: 600,
}));

export const FileList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
}));

export const FileItem = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  padding: `${rem(10)} ${rem(12)}`,
  borderRadius: rem(10),
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

export const FileIconWrap = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  minWidth: rem(36),
  borderRadius: rem(8),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: `${theme.palette.primary.main}1A`,
  color: theme.palette.primary.main,
  '& svg': {
    fontSize: rem(18),
  },
}));

export const FileMeta = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(1),
  minWidth: 0,
  flex: 1,
}));

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const FileExtension = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  textTransform: 'uppercase',
}));
