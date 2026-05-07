import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { getPaddleInstance, CheckoutEventNames } from '@paddle/paddle-js';
import { PricingCard } from '../../components/UI/PricingCard';
import { subscriptionService } from '../../services/api/subscription';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import * as S from './SubscribePage.styles';

const FEATURES = [
  { text: 'Unlimited workers', included: true },
  { text: 'Job management', included: true },
  { text: 'Workflow builder', included: true },
  { text: 'Asset tracking', included: true },
  { text: 'Customer management', included: true },
  { text: 'Priority support', included: true },
];

export const SubscribePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const { showError } = useSnackbar();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await subscriptionService.createCheckout();
      const { transactionId } = data as Record<string, string>;

      const paddle = getPaddleInstance();
      if (!paddle) {
        showError('Payment system not available. Please refresh the page and try again.');
        return;
      }

      paddle.Checkout.open({
        transactionId,
        settings: {
          successUrl: `${window.location.origin}/subscription/success`,
        },
        eventCallback: (event) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
            refresh();
            navigate('/subscription/success');
          }
          if (event.name === CheckoutEventNames.CHECKOUT_CLOSED) {
            navigate('/subscription/cancel');
          }
        },
      });
    } catch {
      showError('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.PageWrapper>
      <S.HeadingWrapper>
        <Typography variant="h4" fontWeight={700}>
          Upgrade Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get full access to all WorkFloow features with our Pro plan.
        </Typography>
      </S.HeadingWrapper>

      <PricingCard
        planName="Pro"
        planDescription="Everything you need to run your field operations"
        price={50}
        currency="£"
        pricePeriod="per month"
        buttonText={loading ? 'Loading...' : 'Subscribe Now'}
        onButtonClick={handleSubscribe}
        icon={<CreditCardIcon sx={{ fontSize: 40, color: '#fff' }} />}
        featured
        features={FEATURES}
        background="linear-gradient(135deg, #101a32 0%, #1a2a4a 100%)"
      />
    </S.PageWrapper>
  );
};
