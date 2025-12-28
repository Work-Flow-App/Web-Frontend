import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { rem } from '../Typography/utility';

interface PasswordStrengthProps {
  password: string;
}

const StrengthContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginTop: rem(4),
});

const StrengthBar = styled(Box)<{ strength: number }>(({ strength }) => {
  let backgroundColor = '#E0E0E0';
  if (strength >= 80) backgroundColor = '#66BB6A'; // Strong - Green
  else if (strength >= 50) backgroundColor = '#FFA726'; // Medium - Orange
  else if (strength > 0) backgroundColor = '#EF5350'; // Weak - Red

  return {
    height: rem(4),
    borderRadius: rem(2),
    transition: 'all 0.3s ease',
    flex: 1,
    backgroundColor,
  };
});

const StrengthLabel = styled(Typography)<{ strength: number }>(({ strength }) => {
  let color = '#9E9E9E';
  if (strength >= 80) color = '#66BB6A'; // Strong - Green
  else if (strength >= 50) color = '#FFA726'; // Medium - Orange
  else if (strength > 0) color = '#EF5350'; // Weak - Red

  return {
    fontSize: rem(12),
    fontWeight: 500,
    color,
    minWidth: rem(60),
  };
});

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 15;

  // Contains uppercase
  if (/[A-Z]/.test(password)) strength += 15;

  // Contains numbers
  if (/\d/.test(password)) strength += 15;

  // Contains special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;

  return Math.min(strength, 100);
};

const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return '';
  if (strength < 50) return 'Weak';
  if (strength < 80) return 'Medium';
  return 'Strong';
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const label = getStrengthLabel(strength);

  if (!password) return null;

  return (
    <StrengthContainer>
      <StrengthBar strength={strength} />
      <StrengthLabel strength={strength}>
        {label}
      </StrengthLabel>
    </StrengthContainer>
  );
};
