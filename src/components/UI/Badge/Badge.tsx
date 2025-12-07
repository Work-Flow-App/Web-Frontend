import React from 'react';
import { StyledBadge } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
}) => {
  return (
    <StyledBadge
      badgeVariant={variant}
      badgeSize={size}
      className={className}
    >
      {children}
    </StyledBadge>
  );
};
