import React from 'react';
import { Skeleton } from '@mui/material';
import * as S from './MetricsRow.styles';

interface MetricCardProps {
  label: string;
  value: string | number;
  changeText?: string;
  isPositive?: boolean;
  accentColor: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  changeText,
  isPositive,
  accentColor,
  bgColor,
  iconColor,
  icon,
  loading = false,
  onClick,
}) => {
  return (
    <S.CardContainer accentColor={accentColor} onClick={loading ? undefined : onClick}>
      {loading ? (
        <>
          <S.InfoSection style={{ width: '60%' }}>
            <Skeleton variant="text" width="50%" height={14} animation="wave" />
            <Skeleton variant="text" width="80%" height={38} animation="wave" style={{ marginTop: '4px' }} />
            <Skeleton variant="text" width="60%" height={14} animation="wave" style={{ marginTop: '6px' }} />
          </S.InfoSection>
          <Skeleton variant="circular" width={44} height={44} animation="wave" />
        </>
      ) : (
        <>
          <S.InfoSection>
            <S.LabelText>{label}</S.LabelText>
            <S.ValueText variant="h2">{value}</S.ValueText>
            {changeText && (
              <S.TrendSection>
                <S.TrendText variant="caption" isPositive={isPositive}>
                  {changeText}
                </S.TrendText>
              </S.TrendSection>
            )}
          </S.InfoSection>
          <S.IconSection bgColor={bgColor} iconColor={iconColor}>
            {icon}
          </S.IconSection>
        </>
      )}
    </S.CardContainer>
  );
};
