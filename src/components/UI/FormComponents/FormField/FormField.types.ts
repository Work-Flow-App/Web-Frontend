import { ReactNode } from 'react';

export interface FormFieldProps {
  label?: string;
  hideLabel?: boolean;
  icon?: ReactNode;
  required?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
}
