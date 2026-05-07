import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { SubscriptionStatusResponseStatusEnum } from '../../../workflow-api';
import { subscriptionService } from '../../services/api/subscription';
import { useSubscription } from '../../contexts/SubscriptionContext';
import * as S from './SubscriptionSuccessPage.styles';

const POLL_INTERVAL_MS = 2500;
const POLL_MAX_MS = 30_000;
const REDIRECT_DELAY_MS = 3000;

export const SubscriptionSuccessPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const startRef = useRef(Date.now());

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const { data } = await subscriptionService.getStatus();
        if (data.status === SubscriptionStatusResponseStatusEnum.Active) {
          setIsActive(true);
          refresh();
          timerId = setTimeout(() => navigate('/company'), REDIRECT_DELAY_MS);
          return;
        }
      } catch {
        // keep polling
      }

      if (Date.now() - startRef.current < POLL_MAX_MS) {
        timerId = setTimeout(poll, POLL_INTERVAL_MS);
      } else {
        setTimedOut(true);
      }
    };

    timerId = setTimeout(poll, POLL_INTERVAL_MS);
    return () => clearTimeout(timerId);
  }, [navigate, refresh]);

  if (isActive) {
    return (
      <S.PageWrapper>
        <S.ContentWrapper>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: 'success.main' }} />
          <Typography variant="h4" fontWeight={700}>
            You're all set!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your subscription is now active. Redirecting to dashboard...
          </Typography>
        </S.ContentWrapper>
      </S.PageWrapper>
    );
  }

  if (timedOut) {
    return (
      <S.PageWrapper>
        <S.ContentWrapper>
          <Typography variant="h5" fontWeight={600}>
            Payment processing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment is being processed. Your subscription will activate shortly — check back in a
            few minutes.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/company')}>
            Go to Dashboard
          </Button>
        </S.ContentWrapper>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.ContentWrapper>
        <CircularProgress size={56} />
        <Typography variant="h5" fontWeight={600}>
          Activating your account...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Payment successful. Setting up your subscription...
        </Typography>
      </S.ContentWrapper>
    </S.PageWrapper>
  );
};
