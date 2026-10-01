import React from 'react';
import { TollTip } from '../../../../../components/UI/TollTip/TollTip';
import * as S from './MetricsRow.styles';

interface MetricCardProps {
  label: string;
  value: string | number;
  tooltip?: string;
  valueColor?: string;
  changeText?: string;
  isPositive?: boolean;
  accentColor: string;
  bgColor: string;
  iconColor: string;
  icon?: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  tooltip,
  valueColor,
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
          <S.LoadingInfoSection>
            <S.MetricSkeletonTitle variant="text" animation="wave" />
            <S.MetricSkeletonValue variant="text" animation="wave" />
            {changeText && <S.MetricSkeletonTrend variant="text" animation="wave" />}
          </S.LoadingInfoSection>
          {icon && <S.MetricSkeletonCircle variant="circular" animation="wave" />}
        </>
      ) : (
        <>
          <S.InfoSection>
            <S.LabelWrapper>
              <S.LabelText>{label}</S.LabelText>
              {tooltip && <TollTip message={tooltip} />}
            </S.LabelWrapper>
            <S.ValueText variant="h3" valueColor={valueColor}>
              {value}
            </S.ValueText>
            {changeText && (
              <S.TrendSection>
                <S.TrendText variant="caption" isPositive={isPositive}>
                  {changeText}
                </S.TrendText>
              </S.TrendSection>
            )}
          </S.InfoSection>
          {icon && (
            <S.IconSection bgColor={bgColor} iconColor={iconColor}>
              {icon}
            </S.IconSection>
          )}
        </>
      )}
    </S.CardContainer>
  );
};

