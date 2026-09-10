import React from 'react';
import { MetricCard } from './MetricCard';

interface FinancialCardProps {
  label: string;
  tooltip?: string;
  value: string;
  accentColor: string;
  bgColor?: string;
  iconColor?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  label,
  tooltip,
  value,
  accentColor,
  bgColor,
  iconColor,
  icon,
  loading = false,
  onClick,
}) => {
  return (
    <MetricCard
      label={label}
      value={value}
      tooltip={tooltip}
      valueColor={accentColor}
      accentColor={accentColor}
      bgColor={bgColor || accentColor}
      iconColor={iconColor || accentColor}
      icon={icon}
      loading={loading}
      onClick={onClick}
    />
  );
};

