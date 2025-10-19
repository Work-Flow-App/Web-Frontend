import React from 'react';
import { Button as MuiButton, Box } from '@mui/material';
import type { ButtonProps } from './Button.types';
import type { SxProps, Theme } from '@mui/material/styles';
import { getButtonStyles, iconStyles } from './Button.styles';

/**
 * Reusable Button component based on Floow design system
 * Follows Figma specifications with Manrope font and precise sizing
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  sx,
}) => {
  const buttonStyles = getButtonStyles(variant, size, fullWidth);

  // Merge custom sx with button styles
  const mergedSx: SxProps<Theme> = sx
    ? (Array.isArray(sx) ? [buttonStyles, ...sx] : [buttonStyles, sx])
    : buttonStyles;

  return (
    <MuiButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      sx={mergedSx}
      disableRipple
      disableElevation
    >
      {startIcon && <Box sx={iconStyles}>{startIcon}</Box>}
      {children}
      {endIcon && <Box sx={iconStyles}>{endIcon}</Box>}
    </MuiButton>
  );
};

export default Button;
