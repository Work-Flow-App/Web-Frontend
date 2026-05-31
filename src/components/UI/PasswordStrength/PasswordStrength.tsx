import React from 'react';
import { StrengthContainer, StrengthBar, StrengthLabel } from './PasswordStrength.styles';

interface PasswordStrengthProps {
  password: string;
}

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 15;
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