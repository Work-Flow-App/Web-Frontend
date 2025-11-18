import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { Input } from '../Input/Input';
import { VisibilityIcon, VisibilityOffIcon, IconButton } from './PasswordInput.styles.tsx';
import type { IPasswordInput } from './IPasswordInput';

export const PasswordInput: React.FC<IPasswordInput> = ({ showToggle = true, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const endAdornment = showToggle ? (
    <InputAdornment position="end">
      <IconButton
        type="button"
        onClick={handleTogglePassword}
        onMouseDown={handleMouseDown}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return <Input type={showPassword ? 'text' : 'password'} endAdornment={endAdornment} {...props} />;
};

PasswordInput.displayName = 'PasswordInput';
