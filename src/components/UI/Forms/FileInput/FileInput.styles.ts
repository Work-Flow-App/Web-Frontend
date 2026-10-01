import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../Typography/utility';

export const FileInputWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const FileInputLabel = styled('label')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.colors.grey_600,
  lineHeight: rem(20),
  marginBottom: rem(6),
  display: 'block',
}));

export const RequiredIndicator = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: rem(2),
}));

export const FileRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  flexWrap: 'wrap',
});

export const FileName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  wordBreak: 'break-all',
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.error.main,
  marginTop: rem(6),
}));
