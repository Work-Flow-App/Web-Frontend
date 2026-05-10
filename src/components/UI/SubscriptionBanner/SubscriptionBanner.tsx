import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SubscriptionStatusResponseStatusEnum } from '../../../../workflow-api';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import type { SubscriptionBannerProps } from './SubscriptionBanner.types';
import * as S from './SubscriptionBanner.styled';

type AlertSeverity = 'info' | 'warning' | 'error';

interface BannerConfig {
  severity: AlertSeverity;
  message: string;
  cta: string;
}

const BANNER_CONFIG: Partial<Record<string, BannerConfig>> = {
  [SubscriptionStatusResponseStatusEnum.PastDue]: {
    severity: 'warning',
    message: 'Payment failed — update your payment method to avoid losing access',
    cta: 'Update Payment',
  },
  [SubscriptionStatusResponseStatusEnum.Paused]: {
    severity: 'error',
    message: 'Subscription paused — reactivate to regain full access',
    cta: 'Reactivate',
  },
  [SubscriptionStatusResponseStatusEnum.Cancelled]: {
    severity: 'error',
    message: 'Subscription cancelled — subscribe again to restore access',
    cta: 'Subscribe',
  },
  [SubscriptionStatusResponseStatusEnum.Expired]: {
    severity: 'error',
    message: 'Subscription expired — subscribe to restore access',
    cta: 'Subscribe',
  },
};

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ className }) => {
  const { status } = useSubscription();
  const navigate = useNavigate();

  if (!status?.status || status.status === SubscriptionStatusResponseStatusEnum.Active) {
    return null;
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
