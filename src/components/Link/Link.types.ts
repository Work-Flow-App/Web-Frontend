import type { ReactNode } from 'react';

export interface LinkProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}
