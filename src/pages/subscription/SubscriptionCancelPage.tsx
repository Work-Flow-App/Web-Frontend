import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as S from './SubscriptionCancelPage.styles';

const REDIRECT_DELAY_MS = 5000;

export const SubscriptionCancelPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setTimeout(() => navigate('/subscribe'), REDIRECT_DELAY_MS);
    return () => clearTimeout(timerId);
  }, [navigate]);

  return (
    <S.PageWrapper>
      <S.ContentWrapper>
        <Typography variant="h5" fontWeight={600}>
          Checkout cancelled
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No payment was taken. You'll be redirected back to the upgrade page shortly.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/subscribe')}>
          Back to Upgrade
        </Button>
      </S.ContentWrapper>
    </S.PageWrapper>
  );
};
