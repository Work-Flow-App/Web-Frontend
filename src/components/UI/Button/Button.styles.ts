import { styled } from '@mui/material/styles';
import { Button as MuiButton, LinearProgress as MuiLinearProgress } from '@mui/material';
import { rem, em, Bold } from '../Typography/utility';
import type { ButtonColor, ButtonVariant, ButtonSize } from './Button.types';

interface StyledButtonProps {
  buttonColor: ButtonColor;
  buttonVariant: ButtonVariant;
  buttonSize: ButtonSize;
}

export const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['buttonColor', 'buttonVariant', 'buttonSize'].includes(prop as string),
})<StyledButtonProps>(
  ({ theme, buttonColor, buttonVariant, buttonSize, fullWidth }) => {
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
            height: rem(36),
            padding: `${rem(8)} ${rem(16)}`,
            fontSize: rem(12),
            borderRadius: rem(8),
            gap: rem(8),
            minWidth: fullWidth ? 'unset' : 'auto',
          };
        case 'large':
          return {
            height: rem(51),
            padding: `${rem(12)} ${rem(24)}`,
            fontSize: rem(20), // From Figma
            lineHeight: rem(27), // From Figma
            borderRadius: rem(8),
            gap: rem(10),
            minWidth: fullWidth ? 'unset' : rem(451), // 28.1875rem from Figma
            fontWeight: 700, // Bold from Figma, overrides base _800
            letterSpacing: em(0.005), // From Figma
          };
        case 'medium':
        default:
          return {
            height: rem(51),
            padding: `${rem(12)} ${rem(24)}`,
            fontSize: rem(14),
            borderRadius: rem(8),
            gap: rem(10),
            minWidth: fullWidth ? 'unset' : 'auto',
          };
      }
    };

    return {
      ...getSizeStyles(),
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: fullWidth ? '100%' : 'auto',
      fontWeight: Bold._800,
      textTransform: 'none' as const,
      boxShadow: shadows[0],
      letterSpacing: em(0.08),
      transition: 'all 0.2s ease-in-out',
      position: 'relative',

      // Responsive styles for large size button
      ...(buttonSize === 'large' && {
        '@media (max-width: 1536px)': {
          height: rem(46),
          padding: `${rem(11)} ${rem(22)}`,
          fontSize: rem(18),
          lineHeight: rem(24),
          minWidth: fullWidth ? 'unset' : rem(400),
        },
        '@media (max-width: 1366px)': {
          height: rem(42),
          padding: `${rem(10)} ${rem(20)}`,
          fontSize: rem(16),
          lineHeight: rem(22),
          minWidth: fullWidth ? 'unset' : rem(350),
        },
      }),

      // Responsive styles for medium size button
      ...(buttonSize === 'medium' && {
        '@media (min-width: 1921px)': {
          height: rem(54),
          padding: `${rem(13)} ${rem(26)}`,
          fontSize: rem(15),
        },
        '@media (max-width: 1536px)': {
          height: rem(46),
          padding: `${rem(11)} ${rem(22)}`,
          fontSize: rem(13),
        },
        '@media (max-width: 1366px)': {
          height: rem(42),
          padding: `${rem(10)} ${rem(20)}`,
          fontSize: rem(12),
        },
      }),

      // Responsive styles for small size button
      ...(buttonSize === 'small' && {
        '@media (min-width: 1921px)': {
          height: rem(40),
          padding: `${rem(9)} ${rem(18)}`,
          fontSize: rem(13),
        },
        '@media (max-width: 1536px)': {
          height: rem(32),
          padding: `${rem(7)} ${rem(14)}`,
          fontSize: rem(11),
        },
        '@media (max-width: 1366px)': {
          height: rem(30),
          padding: `${rem(6)} ${rem(12)}`,
          fontSize: rem(10),
        },
      }),

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
        fontSize: '90%',
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover': {
          backgroundColor: 'transparent',
          color: hoverColor,
        },
        '&.Mui-disabled': {
          color: palette.text.disabled,
        },
      }),
    };
  }
);

export const ButtonLoader = styled(MuiLinearProgress)(({ theme }) => {
  const { palette, spacing } = theme;

  return {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: spacing(0.5),
    borderBottomRightRadius: spacing(0.5),
    height: rem(2),
    '& .MuiLinearProgress-bar': {
      backgroundColor: palette.primary.contrastText,
    },
  };
});
