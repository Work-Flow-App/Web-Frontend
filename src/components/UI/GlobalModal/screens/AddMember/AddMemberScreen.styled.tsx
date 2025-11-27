import { rem, Bold } from '../../../Typography/utility';
import { Box, styled } from '@mui/material';

export const FormWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: rem(20),
  width: '100%',
}));

export const FieldWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: 0,
  gap: rem(4),
  width: '100%',
}));

export const FieldLabel = styled(Box)(({ theme: { palette } }) => ({
  fontSize: rem(14),
  fontWeight: Bold._500,
  lineHeight: rem(24),
  color: palette.text.primary,
  letterSpacing: '0.005em',
}));

export const StyledInput = styled('input')(({ theme: { palette } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${rem(10)} ${rem(20)}`,
  gap: rem(4),
  width: '100%',
  height: rem(44),
  background: palette.grey[50],
  border: `1px solid ${palette.grey[100]}`,
  borderRadius: rem(6),
  fontSize: rem(14),
  fontWeight: Bold._400,
  lineHeight: rem(24),
  color: palette.text.primary,
  outline: 'none',
  boxSizing: 'border-box',

  '&::placeholder': {
    color: palette.grey[400],
  },

  '&:focus': {
    border: `1px solid ${palette.primary.main}`,
    background: palette.common.white,
  },

  '&:disabled': {
    background: palette.grey[100],
    color: palette.grey[500],
    cursor: 'not-allowed',
  },
}));

export const StyledSelect = styled('select')(({ theme: { palette } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${rem(10)} ${rem(20)}`,
  gap: rem(4),
  width: '100%',
  height: rem(44),
  background: palette.grey[50],
  border: `1px solid ${palette.grey[100]}`,
  borderRadius: rem(6),
  fontSize: rem(14),
  fontWeight: Bold._400,
  lineHeight: rem(24),
  color: palette.text.primary,
  outline: 'none',
  boxSizing: 'border-box',
  cursor: 'pointer',

  '&::placeholder': {
    color: palette.grey[400],
  },

  '&:focus': {
    border: `1px solid ${palette.primary.main}`,
    background: palette.common.white,
  },

  '&:disabled': {
    background: palette.grey[100],
    color: palette.grey[500],
    cursor: 'not-allowed',
  },
}));
