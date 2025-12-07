import React from 'react';
import { StyledTooltip } from './Tooltip.styles';
import type { TooltipProps } from './Tooltip.types';

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  placement = 'top',
  arrow = true,
  ...rest
}) => {
  return (
    <StyledTooltip title={title} placement={placement} arrow={arrow} {...rest}>
      {children}
    </StyledTooltip>
  );
};
