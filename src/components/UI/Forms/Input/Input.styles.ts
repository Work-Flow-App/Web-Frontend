import { InputBase, Box, FormControl, styled, InputAdornment } from '@mui/material';
import { rem } from '../../Typography/utility';

export interface IStyledInputProp {
  variants?: string[];
}

export const StyledFormControl = styled(FormControl)(({ theme: {} }) => ({
  width: '100%',
  rowGap: rem(6),
  outline: 'none',
}));

export const StyledInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'variants',
})<IStyledInputProp>(({ theme: { spacing, palette, typography, shape }, variants }) => ({
  width: '100%',
  height: rem(48),
  border: '1px solid',
  borderColor: `${palette.border?.main || palette.grey[300]}`,
  borderRadius: shape.borderRadius,
  padding: spacing(1.5, 2),
  fontSize: typography.subtitle2.fontSize,
  backgroundColor: variants?.length && variants?.length > 1 ? variants[1] : palette.colors.white,
  '&:hover': {
    borderColor: palette.border?.dark || palette.grey[400],
  },
  '&.withRequiredBorder': {
    borderColor: `${palette.warning.main}`,
  },
  '&.hasValue': {
    borderColor: `${variants?.length ? variants[0] : palette.colors.grey_300}`,
  },
  '&.withValue': {
    svg: {
      fill: palette.colors.grey_500,
    },
  },
  '&.Mui-focused': {
    borderColor: palette.colors.grey_300,
    '&:hover': {
      borderColor: palette.colors.grey_300,
    },
    svg: {
      fill: palette.warning.main,
    },
    ' .MuiInputAdornment-positionEnd': {
      button: {
        svg: {
          fill: palette.warning.main,
        },
      },
    },
  },
  '&.Mui-readOnly': {
    borderColor: variants?.length ? variants[0] : palette.colors.grey_200,
    '&:hover': {
      borderColor: variants?.length ? variants[0] : palette.colors.grey_200,
    },
  },
  '&.Mui-error': {
    borderColor: `${palette.error.main}`,
    backgroundColor: `${palette.error.bgLight}`,
    '&:hover': {
      borderColor: `${palette.error.dark}`,
    },
    input: {
      color: palette.error.main,
    },
  },
  '&.Mui-disabled': {
    display: 'flex',
    alignItems: 'center',

    backgroundColor: palette.background.disabled,
    color: palette.colors.grey_300,

    '&:hover': {
      borderColor: palette.border?.main || palette.grey[300],
    },
  },
  input: {
    color: palette.colors.grey_900,
    fontSize: rem(14),
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: rem(20),
    '&[readonly]': {
      color: palette.colors.grey_300,
    },
  },
  ' .MuiInputAdornment-positionEnd': {
    button: {
      svg: {
        fill: palette.colors.grey_500,
      },
    },
  },
}));

export const AdornmentWrapper = styled(InputAdornment)(({ theme: { spacing } }) => ({
  paddingRight: spacing(1),
  display: 'flex',
  alignItems: 'center',
  svg: {
    fill: 'black',
  },
  position: 'relative',
  top: rem(4),
}));

export const ErrorWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  fontSize: rem(12),
  color: theme.palette.error.main,
  marginTop: rem(4),
}));

export const InputWrapper = styled(Box)(({ theme: {} }) => ({
  position: 'relative',
}));

export const InputLabel = styled('label')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.colors.grey_600,
  lineHeight: rem(20),
  marginBottom: rem(6),
  display: 'block',
}));
