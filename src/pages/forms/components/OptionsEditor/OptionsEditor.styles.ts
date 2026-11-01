import { styled } from '@mui/material/styles';
import { Box, Button as MuiButton, IconButton as MuiIconButton, Typography, InputBase } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

export const OptionsContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
  width: '100%',
}));

export const OptionRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  width: '100%',
}));

export const OptionInputWrapper = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const OptionInputField = styled(InputBase)(({ theme }) => ({
  width: '100%',
  height: rem(40),
  border: `1px solid ${floowColors.slate.light}`,
  borderRadius: rem(8),
  padding: `${rem(8)} ${rem(12)}`,
  fontSize: rem(13.5),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: 'border-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: floowColors.slate.main,
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main,
  },
  '&.has-error': {
    borderColor: theme.palette.error.main,
  },
}));

export const DeleteIconButton = styled(MuiIconButton)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  color: theme.palette.text.secondary,
  borderRadius: rem(8),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: `${theme.palette.error.main}14`,
    color: theme.palette.error.main,
  },
  '&.Mui-disabled': {
    opacity: 0.4,
  },
}));

export const AddOptionButton = styled(MuiButton)(({ theme }) => ({
  alignSelf: 'flex-start',
  textTransform: 'none',
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: theme.palette.primary.main,
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(8),
  border: `1px dashed ${floowColors.slate.light}`,
  backgroundColor: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}0D`,
    borderColor: theme.palette.primary.main,
  },
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._500,
  color: theme.palette.error.main,
  marginTop: rem(4),
}));
