import { useState, forwardRef } from 'react';
import { Input } from '../Input/Input';
import type { InputProps } from '../Input/Input.types';
import { VisibilityIcon, VisibilityOffIcon, IconButton } from './PasswordInput.styles.tsx';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'endIcon'> {
  /**
   * Show password toggle button
   * @default true
   */
  showToggle?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const endIcon = showToggle ? (
      <IconButton
        type="button"
        onClick={handleTogglePassword}
        onMouseDown={handleMouseDown}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    ) : undefined;

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        endIcon={endIcon}
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
