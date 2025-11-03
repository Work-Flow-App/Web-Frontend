import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../Typography/utility';

interface InputWrapperProps {
  fullWidth?: boolean;
}

interface StyledInputProps {
  hasError?: boolean;
  hasStartIcon?: boolean;
  hasEndIcon?: boolean;
  inputSize?: 'small' | 'medium' | 'large';
}

export const InputWrapper = styled(Box)<InputWrapperProps>(({ fullWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: fullWidth ? '100%' : 'auto',
}));

export const InputLabel = styled(Typography)(() => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: '#525252',
  lineHeight: rem(20),
  letterSpacing: '0.005em',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
    lineHeight: rem(24),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
    lineHeight: rem(19),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
    lineHeight: rem(18),
  },
}));

export const InputContainer = styled(Box)<{ hasError?: boolean; inputSize?: 'small' | 'medium' | 'large' }>(({ theme, hasError, inputSize }) => {
  const size = inputSize || 'medium';

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: rem(42),
    padding: `${rem(10)} ${rem(14)}`,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${hasError ? theme.palette.error.main : theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    '@media (min-width: 1921px)': {
      height: size === 'small' ? rem(40) : size === 'large' ? rem(56) : rem(48),
      padding: size === 'small' ? `${rem(8)} ${rem(12)}` : size === 'large' ? `${rem(14)} ${rem(16)}` : `${rem(12)} ${rem(16)}`,
    },
    '@media (max-width: 1536px)': {
      height: rem(40),
      padding: `${rem(9)} ${rem(12)}`,
    },
    '@media (max-width: 1366px)': {
      height: rem(38),
      padding: `${rem(8)} ${rem(10)}`,
    },
    '&:focus-within': {
      borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
      boxShadow: hasError
        ? `0 0 0 3px ${theme.palette.error.main}20`
        : `0 0 0 3px ${theme.palette.primary.main}20`,
    },
    '&:hover': {
      borderColor: hasError ? theme.palette.error.main : theme.palette.grey[400],
    },
  };
});

export const StyledInput = styled('input')<StyledInputProps>(({ theme }) => ({
  flex: 1,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[900],
  fontFamily: theme.typography.fontFamily,
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
  },
  '&::placeholder': {
    color: theme.palette.grey[400],
  },
  '&:disabled': {
    color: theme.palette.grey[500],
    cursor: 'not-allowed',
  },
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
  '& svg': {
    fontSize: '20px',
  },
}));

export const HelperText = styled(Typography)<{ hasError?: boolean }>(({ theme, hasError }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightRegular,
  color: hasError ? theme.palette.error.main : theme.palette.grey[600],
  lineHeight: rem(16),
}));
