import React, { forwardRef } from 'react';
import type { InputProps } from './Input.types';
import {
  InputWrapper,
  InputLabel,
  InputContainer,
  StyledInput,
  IconWrapper,
  HelperText,
} from './Input.styles';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      size = 'medium',
      startIcon,
      endIcon,
      variant = 'outlined',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === 'object' && error?.message ? error.message : helperText;

    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <InputContainer hasError={hasError} inputSize={size}>
          {startIcon && <IconWrapper>{startIcon}</IconWrapper>}
          <StyledInput
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {endIcon && <IconWrapper>{endIcon}</IconWrapper>}
        </InputContainer>
        {(hasError || helperText) && (
          <HelperText hasError={hasError}>{errorMessage}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';
