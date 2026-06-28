import React from 'react';
import type { ButtonProps } from './Button.types';
import { StyledButton, ButtonLoader } from './Button.styles';

/**
 * Reusable Button component based on Floow design system
 * Supports multiple colors, variants, sizes, and loading states
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  sx,
}) => {
  return (
    <StyledButton
      type={type}
      buttonColor={color}
      buttonVariant={variant}
      buttonSize={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      sx={sx}
      fullWidth={fullWidth}
      disableRipple
      disableElevation
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {children}
      {!disabled && loading && <ButtonLoader />}
    </StyledButton>
  );
};

export default Button;
