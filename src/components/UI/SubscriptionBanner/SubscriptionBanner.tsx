import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SubscriptionStatusResponseStatusEnum } from '../../../../workflow-api';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import type { SubscriptionBannerProps } from './SubscriptionBanner.types';
import { BANNER_CONFIG } from './SubscriptionBannerConst';
import * as S from './SubscriptionBanner.styled';

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ className }) => {
  const { status } = useSubscription();
  const navigate = useNavigate();

  if (!status?.status || status.status === SubscriptionStatusResponseStatusEnum.Active) {
    return null;
  }

  if (status.status === SubscriptionStatusResponseStatusEnum.Trial) {
    if (!status.trialEndsAt) return null;

    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(status.trialEndsAt).getTime() - Date.now()) / 86_400_000)
    );

    return (
      <S.BannerWrapper className={className}>
        <S.StyledAlert
          severity="info"
          action={
            <Button color="inherit" size="small" variant="outlined" onClick={() => navigate('/subscribe')}>
              Upgrade
            </Button>
          }
        >
          {daysRemaining > 0
            ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in your trial`
            : 'Your trial ends today'}
        </S.StyledAlert>
      </S.BannerWrapper>
    );
  }

  const config = BANNER_CONFIG[status.status];
  if (!config) return null;

  return (
    <S.BannerWrapper className={className}>
      <S.StyledAlert
        severity={config.severity}
        action={
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={() => navigate('/subscribe')}
          >
            {config.cta}
          </Button>
        }
      >
        {config.message}
      </S.StyledAlert>
    </S.BannerWrapper>
  );
};