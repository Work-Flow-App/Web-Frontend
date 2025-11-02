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
  fontSize: rem(16),
  fontWeight: 700,
  color: '#525252',
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
}));

export const InputContainer = styled(Box)<{ hasError?: boolean; inputSize?: 'small' | 'medium' | 'large' }>(({ theme, hasError, inputSize }) => {
  const sizeStyles = {
    small: {
      height: '40px',
      padding: '8px 12px',
    },
    medium: {
      height: '48px',
      padding: '12px 16px',
    },
    large: {
      height: '56px',
      padding: '14px 16px',
    },
  };

  const size = inputSize || 'medium';

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ...sizeStyles[size],
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${hasError ? theme.palette.error.main : theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
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
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[900],
  fontFamily: theme.typography.fontFamily,
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
