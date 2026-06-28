import { styled } from '@mui/material/styles';
import { IconButton as MuiIconButton, CircularProgress } from '@mui/material';
import { rem } from '../Typography/utility';
import type { IconButtonColor, IconButtonVariant, IconButtonSize } from './IconButton.types';

interface StyledIconButtonProps {
  buttonColor: IconButtonColor;
  buttonVariant: IconButtonVariant;
  buttonSize: IconButtonSize;
}

export const StyledIconButton = styled(MuiIconButton)<StyledIconButtonProps>(
  ({ theme, buttonColor, buttonVariant, buttonSize }) => {
    const { palette, shadows } = theme;

    // Get color based on buttonColor prop
    const getColor = () => {
      switch (buttonColor) {
        case 'primary':
          return palette.primary.main;
        case 'secondary':
          return palette.secondary.main;
        case 'tertiary':
          return palette.tertiary.main;
        case 'success':
          return palette.success.main;
        case 'error':
          return palette.error.main;
        case 'warning':
          return palette.warning.main;
        default:
          return palette.primary.main;
      }
    };

    const getHoverColor = () => {
      switch (buttonColor) {
        case 'primary':
          return palette.primary.light;
        case 'secondary':
          return palette.secondary.light;
        case 'tertiary':
          return palette.tertiary.light;
        case 'success':
          return palette.success.light;
        case 'error':
          return palette.error.light;
        case 'warning':
          return palette.warning.light;
        default:
          return palette.primary.light;
      }
    };

    const color = getColor();
    const hoverColor = getHoverColor();

    // Size styles
    const getSizeStyles = () => {
      switch (buttonSize) {
        case 'small':
          return {
            width: rem(32),
            height: rem(32),
            padding: rem(4),
            '& svg': {
              width: rem(20),
              height: rem(20),
            },
          };
        case 'large':
          return {
            width: rem(48),
            height: rem(48),
            padding: rem(8),
            '& svg': {
              width: rem(28),
              height: rem(28),
            },
          };
        case 'medium':
        default:
          return {
            width: rem(40),
            height: rem(40),
            padding: rem(6),
            '& svg': {
              width: rem(24),
              height: rem(24),
            },
          };
      }
    };

    return {
      ...getSizeStyles(),
      borderRadius: rem(8),
      boxShadow: shadows[0],
      transition: 'all 0.2s ease-in-out',
      position: 'relative',

      // Contained variant
      ...(buttonVariant === 'contained' && {
        backgroundColor: color,
        color: palette.primary.contrastText,
        '&:hover': {
          backgroundColor: hoverColor,
          boxShadow: palette.boxShadow.buttonShadow,
        },
        '&.Mui-disabled': {
          backgroundColor: palette.colors.black_25,
          color: palette.text.disabled,
        },
      }),

      // Outlined variant
      ...(buttonVariant === 'outlined' && {
        backgroundColor: palette.background.default,
        color: color,
        border: `${rem(1)} solid ${color}`,
        '&:hover': {
          backgroundColor: hoverColor,
          borderColor: color,
          color: palette.primary.contrastText,
          boxShadow: palette.boxShadow.buttonShadow,
        },
        '&.Mui-disabled': {
          borderColor: palette.text.disabled,
          color: palette.text.disabled,
        },
      }),

      // Text variant
      ...(buttonVariant === 'text' && {
        backgroundColor: 'transparent',
        color: color,
        '&:hover': {
          backgroundColor: `${color}14`, // 8% opacity
          color: color,
        },
        '&.Mui-disabled': {
          color: palette.text.disabled,
        },
      }),
    };
  }
);

export const IconButtonLoader = styled(CircularProgress)(({ theme }) => {
  const { palette } = theme;

  return {
    position: 'absolute',
    color: palette.primary.contrastText,
  };
});
