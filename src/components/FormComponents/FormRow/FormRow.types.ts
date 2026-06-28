import { ReactNode } from 'react';

export interface FormRowProps {
  children: ReactNode;
  width?: string | number;
  gap?: string | number;
  className?: string;
}
