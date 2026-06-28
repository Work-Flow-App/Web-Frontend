import { Box, FormControl, styled } from '@mui/material';
import { rem } from '../../Typography/utility';

export const StyledFormControl = styled(FormControl)(({ theme: {} }) => ({
  width: '100%',
  rowGap: rem(6),
  outline: 'none',
}));

export const StyledTextArea = styled('textarea')(({ theme: { spacing, palette, typography, shape } }) => ({
  width: '100%',
  minHeight: rem(120),
  border: '1px solid',
  borderColor: `${palette.border?.main || palette.grey[300]}`,
  borderRadius: shape.borderRadius,
  padding: spacing(1.5, 2),
  backgroundColor: palette.colors.white,
  fontFamily: typography.fontFamily,
  resize: 'vertical',
  outline: 'none',
  color: palette.colors.grey_900,
  fontSize: rem(14),
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: rem(20),
  '&:hover': {
    borderColor: palette.border?.dark || palette.grey[400],
  },
  '&.withRequiredBorder': {
    borderColor: `${palette.warning.main}`,
  },
  '&.hasValue': {
    borderColor: `${palette.colors.grey_300}`,
  },
  '&:focus': {
    borderColor: palette.colors.grey_300,
    '&:hover': {
      borderColor: palette.colors.grey_300,
    },
  },
  '&.error': {
    borderColor: `${palette.error.main}`,
    backgroundColor: `${palette.error.bgLight}`,
    '&:hover': {
      borderColor: `${palette.error.dark}`,
    },
    color: palette.error.main,
  },
  '&:disabled': {
    backgroundColor: palette.background.disabled,
    color: palette.colors.grey_300,
    cursor: 'not-allowed',
    '&:hover': {
      borderColor: palette.border?.main || palette.grey[300],
    },
  },
  '&[readonly]': {
    color: palette.colors.grey_300,
    borderColor: palette.colors.grey_200,
    '&:hover': {
      borderColor: palette.colors.grey_200,
    },
  },
  '&::placeholder': {
    color: palette.colors.grey_400,
    opacity: 1,
  },
}));

export const ErrorWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  fontSize: rem(12),
  color: theme.palette.error.main,
  marginTop: rem(4),
}));

export const TextAreaWrapper = styled(Box)(({ theme: {} }) => ({
  position: 'relative',
}));

export const TextAreaLabel = styled('label')(({ theme }) => ({
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

export const CharCountWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  fontSize: rem(12),
  color: theme.palette.colors.grey_500,
  marginTop: rem(4),
}));
