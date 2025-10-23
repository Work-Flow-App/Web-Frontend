import React from 'react';
import type { IconButtonProps } from './IconButton.types';
import { StyledIconButton, IconButtonLoader } from './IconButton.styles';
import { Box } from '@mui/material';

/**
 * Reusable IconButton component based on Floow design system
 * Supports multiple colors, variants, sizes, and loading states
 */
export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  sx,
  'aria-label': ariaLabel,
}) => {
  const getLoaderSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  return (
    <StyledIconButton
      type={type}
      buttonColor={color}
      buttonVariant={variant}
      buttonSize={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      sx={sx}
      disableRipple
      aria-label={ariaLabel}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButtonLoader size={getLoaderSize()} />
        </Box>
      ) : (
        children
      )}
    </StyledIconButton>
  );
};

export default IconButton;
