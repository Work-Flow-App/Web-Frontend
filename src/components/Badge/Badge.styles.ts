import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { rem } from '../Typography/utility';
import type { BadgeVariant, BadgeSize } from './Badge.types';

interface StyledBadgeProps {
  badgeVariant: BadgeVariant;
  badgeSize: BadgeSize;
}

export const StyledBadge = styled(Box, {
  shouldForwardProp: (prop) => !['badgeVariant', 'badgeSize'].includes(prop as string),
})<StyledBadgeProps>(({ theme, badgeVariant, badgeSize }) => {
  const { palette } = theme;

  // Get variant colors
  const getVariantStyles = () => {
    switch (badgeVariant) {
      case 'primary':
        return {
          backgroundColor: palette.colors.grey_100,
          color: palette.primary.main,
        };
      case 'secondary':
        return {
          backgroundColor: palette.colors.grey_50,
          color: palette.secondary.main,
        };
      case 'success':
        return {
          backgroundColor: palette.success.light,
          color: palette.success.main,
        };
      case 'warning':
        return {
          backgroundColor: palette.warning.light,
          color: palette.warning.main,
        };
      case 'error':
        return {
          backgroundColor: palette.error.light,
          color: palette.error.main,
        };
      case 'default':
      default:
        return {
          backgroundColor: palette.colors.grey_100,
          color: palette.text.primary,
        };
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (badgeSize) {
      case 'small':
        return {
          padding: `${rem(2)} ${rem(8)}`,
          fontSize: rem(11),
          lineHeight: rem(16),
        };
      case 'large':
        return {
          padding: `${rem(6)} ${rem(16)}`,
          fontSize: rem(14),
          lineHeight: rem(20),
        };
      case 'medium':
      default:
        return {
          padding: `${rem(4)} ${rem(12)}`,
          fontSize: rem(12),
          lineHeight: rem(18),
        };
    }
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rem(12),
    fontWeight: theme.typography.fontWeightMedium,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...getSizeStyles(),
  };
});
