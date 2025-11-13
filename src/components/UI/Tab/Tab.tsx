import React from 'react';
import { StyledTab } from './Tab.styles';
import type { TabProps } from './Tab.types';

/**
 * Tab Component
 *
 * A single tab item that can be used within a TabMenu.
 * Supports active/inactive states, icons, and different sizes.
 *
 * @example
 * ```tsx
 * <Tab
 *   label="Dashboard"
 *   icon={<DashboardIcon />}
 *   active={true}
 *   size="medium"
 *   onClick={() => console.log('Tab clicked')}
 * />
 * ```
 */
export const Tab: React.FC<TabProps> = ({
  label,
  icon,
  active = false,
  disabled = false,
  size = 'medium',
  onClick,
  className,
  sx,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <StyledTab
      active={active}
      size={size}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-disabled={disabled}
      className={className}
      sx={sx}
      role="tab"
      aria-selected={active}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span className="tab-label">{label}</span>
    </StyledTab>
  );
};
