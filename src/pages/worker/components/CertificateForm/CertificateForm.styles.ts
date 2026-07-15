import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const FileFieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
}));

export const FileButtonRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const FieldErrorText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.error.main,
}));
