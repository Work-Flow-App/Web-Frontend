export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'small' | 'medium' | 'large';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}
