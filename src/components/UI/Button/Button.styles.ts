import type { SxProps, Theme } from '@mui/material/styles';
import type { ButtonVariant, ButtonSize } from './Button.types';

// Base button styles matching Figma design
export const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean
): SxProps<Theme> => {
  const baseStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.625rem', // 10px
    fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontStyle: 'normal',
    fontWeight: 700,
    letterSpacing: '0.005em',
    textTransform: 'none',
    boxShadow: 'none',
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.2s ease-in-out',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    '&:hover': {
      boxShadow: 'none',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, SxProps<Theme>> = {
    small: {
      padding: '0.5rem 1rem', // 8px 16px
      height: '2.25rem', // 36px
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      borderRadius: '0.375rem', // 6px
    },
    medium: {
      padding: '0.75rem 1.5rem', // 12px 24px
      height: '3rem', // 48px
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      borderRadius: '0.375rem', // 6px
    },
    large: {
      padding: '0.75rem 1.5rem', // 12px 24px
      height: '3.1875rem', // 51px
      fontSize: '1.25rem', // 20px (XL/Bold from Figma)
      lineHeight: '1.6875rem', // 27px
      borderRadius: '0.5rem', // 8px
    },
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, SxProps<Theme>> = {
    primary: {
      background: '#000000',
      color: '#FFFFFF',
      border: 'none',
      '&:hover': {
        background: '#333333',
      },
      '&:active': {
        background: '#0A0A0A',
      },
    },
    secondary: {
      background: '#F5F5F5',
      color: '#000000',
      border: 'none',
      '&:hover': {
        background: '#E5E5E5',
      },
      '&:active': {
        background: '#D4D4D4',
      },
    },
    outlined: {
      background: 'transparent',
      color: '#000000',
      border: '0.125rem solid #E5E5E5', // 2px solid
      boxSizing: 'border-box',
      height: size === 'large' ? '3.0625rem' : undefined, // 49px for large outlined
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.02)',
        borderColor: '#D4D4D4',
      },
      '&:active': {
        background: 'rgba(0, 0, 0, 0.04)',
        borderColor: '#D4D4D4',
      },
    },
    text: {
      background: 'transparent',
      color: '#000000',
      border: 'none',
      padding: '0.75rem 1rem',
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.04)',
      },
      '&:active': {
        background: 'rgba(0, 0, 0, 0.08)',
      },
    },
  };

  return Object.assign({}, baseStyles, sizeStyles[size], variantStyles[variant]) as SxProps<Theme>;
};

// Icon wrapper styles
export const iconStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '1.5rem', // 24px
    height: '1.5rem', // 24px
  },
};
