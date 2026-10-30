import { Box, alpha, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const Root = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const HiddenInput = styled('input')({
  display: 'none',
});

export const PhotoGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
}));

export const Slot = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
}));

export const SlotHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  minHeight: rem(18),
  marginBottom: theme.spacing(0.5),
}));

export const SlotLabel = styled('span')(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}));

export const SlotActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const PhotoFrame = styled('a')(({ theme }) => ({
  position: 'relative',
  display: 'block',
  aspectRatio: '4 / 3',
  borderRadius: theme.spacing(0.5),
  overflow: 'hidden',
  border: `1px solid ${theme.palette.colors.grey_100}`,
  backgroundColor: theme.palette.colors.grey_100,
}));

export const Photo = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const BusyOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
}));

export const PhotoTime = styled('span')(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: rem(10),
  color: theme.palette.text.secondary,
  '& strong': {
    fontWeight: theme.typography.fontWeightSemiBold,
    color: theme.palette.text.primary,
  },
}));

export const PhotoDropzone = styled('button')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  aspectRatio: '4 / 3',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.colors.grey_300}`,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.colors.white,
  color: theme.palette.text.secondary,
  fontFamily: 'inherit',
  fontSize: rem(11),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, color 0.2s ease',
  '& svg': {
    fontSize: rem(22),
  },
  '&:hover:not(:disabled)': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
}));

export const WriteUpCard = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.grey_100}`,
  borderRadius: theme.spacing(0.5),
}));

export const WriteUpHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const WriteUpTitle = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  '& svg': {
    fontSize: rem(16),
    color: theme.palette.primary.main,
  },
}));

export const DurationChip = styled('span')(({ theme }) => ({
  flexShrink: 0,
  padding: theme.spacing(0.25, 1),
  borderRadius: rem(10),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightSemiBold,
}));

export const WriteUpText = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: rem(12),
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
}));

export const WriteUpNote = styled('p')(({ theme }) => ({
  margin: theme.spacing(0, 0, 1),
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  '&:last-child': {
    margin: theme.spacing(1, 0, 0),
  },
}));

export const StatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

export const ErrorText = styled('p')(({ theme }) => ({
  margin: theme.spacing(0, 0, 1),
  fontSize: rem(12),
  color: theme.palette.error.main,
}));

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1.5),
}));
