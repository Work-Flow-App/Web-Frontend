import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  styled,
} from '@mui/material';
import { rem, Bold } from '../Typography/utility';
import { floowColors } from '../../../theme/colors';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: rem(560),
    maxWidth: `min(${rem(600)}, calc(100vw - ${rem(32)}))`,
    maxHeight: '85vh',
    borderRadius: rem(12),
    backgroundColor: theme.palette.colors.white,
    boxShadow: `0 ${rem(8)} ${rem(24)} ${floowColors.shadow.lg}`,
    display: 'flex',
    flexDirection: 'column',
    margin: rem(16),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: rem(8),
      borderRadius: rem(8),
    },
  },
}));

export const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
}));

export const HeaderTitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
}));

export const DialogBody = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1),
  },
}));

export const DialogFooter = styled(DialogActions)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2.5),
  borderTop: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.grey_50,
}));

export const FileCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(10),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.colors.white,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.colors.grey_300,
  },
}));

export const FileTopRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
}));

export const FileDetailsLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  minWidth: 0,
  flex: 1,
}));

export const ThumbnailWrapper = styled(Box)(({ theme }) => ({
  width: rem(52),
  height: rem(52),
  minWidth: rem(52),
  borderRadius: rem(8),
  overflow: 'hidden',
  backgroundColor: theme.palette.colors.grey_100,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}));

export const ThumbnailImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const DocumentBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeColor',
})<{ badgeColor?: string }>(({ badgeColor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(2),
  color: badgeColor || floowColors.grey[700],
}));

export const DocumentExtText = styled(Typography)(() => ({
  fontSize: rem(10),
  fontWeight: Bold._700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  lineHeight: 1,
}));

export const FileInfo = styled(Box)(() => ({
  minWidth: 0,
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
}));

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const FileMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

export const FileActionsRight = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  flexShrink: 0,
}));

export const TypeDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<{ dotColor: string }>(({ dotColor }) => ({
  width: rem(10),
  height: rem(10),
  minWidth: rem(10),
  borderRadius: '50%',
  backgroundColor: dotColor,
}));

export const ReadOnlyTypeBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(4)} ${rem(10)}`,
  borderRadius: rem(16),
  backgroundColor: theme.palette.colors.grey_100,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
}));

export const StyledTypeSelect = styled(Select)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._600,
  borderRadius: rem(8),
  backgroundColor: theme.palette.colors.grey_50,
  '& .MuiSelect-select': {
    paddingTop: rem(4),
    paddingBottom: rem(4),
    paddingLeft: rem(8),
    paddingRight: `${rem(28)} !important`,
    display: 'flex',
    alignItems: 'center',
    gap: rem(6),
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.colors.grey_200,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.colors.grey_300,
  },
}));

export const TypeMenuItem = styled(MenuItem)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  fontSize: rem(12),
  fontWeight: Bold._600,
  paddingTop: rem(8),
  paddingBottom: rem(8),
}));

export const DescriptionInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    fontSize: rem(13),
    borderRadius: rem(8),
    backgroundColor: theme.palette.colors.grey_50,
    '& fieldset': {
      borderColor: theme.palette.colors.grey_200,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.colors.grey_300,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: `${rem(8)} ${rem(10)}`,
  },
}));

export const ExpandableContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<{ isMine?: boolean }>(({ isMine, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '100%',
  marginTop: rem(4),
  paddingTop: rem(4),
  borderTop: `1px solid ${isMine ? 'rgba(255, 255, 255, 0.2)' : theme.palette.colors.grey_100}`,
}));

export const ExpandableText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isExpanded' && prop !== 'isMine',
})<{ isExpanded?: boolean; isMine?: boolean }>(({ isExpanded, isMine, theme }) => ({
  width: '100%',
  maxWidth: '100%',
  fontSize: rem(12.5),
  lineHeight: 1.5,
  color: isMine ? 'rgba(255, 255, 255, 0.92)' : theme.palette.text.secondary,
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  ...(!isExpanded && {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
}));

export const MoreButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'isMine',
})<{ isMine?: boolean }>(({ isMine, theme }) => ({
  border: 'none',
  background: 'none',
  padding: 0,
  marginTop: rem(2),
  cursor: 'pointer',
  fontSize: rem(11.5),
  fontWeight: Bold._600,
  color: isMine ? floowColors.white : theme.palette.primary.main,
  textDecoration: 'underline',
  alignSelf: 'flex-start',
  display: 'inline-block',
  '&:hover': {
    opacity: 0.8,
  },
}));

export const EditDialogContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const EditDialogFileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
  padding: theme.spacing(1.25),
  backgroundColor: theme.palette.colors.grey_50,
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const EditDialogFileLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  minWidth: 0,
  flex: 1,
}));

export const EditDialogFileName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));
