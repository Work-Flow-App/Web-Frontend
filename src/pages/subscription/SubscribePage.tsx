import React, { useState } from 'react';
import { Typography, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { getPaddleInstance, CheckoutEventNames, type PaddleEventData } from '@paddle/paddle-js';
import { PricingCard } from '../../components/UI/PricingCard';
import type { PricingFeature } from '../../components/UI/PricingCard';
import { subscriptionService } from '../../services/api/subscription';
import { CreateCheckoutSessionRequestPlanTypeEnum } from '../../../workflow-api';
import type { CreateCheckoutSessionRequestPlanTypeEnum as PlanType } from '../../../workflow-api';
import { companyService } from '../../services/api/company';
import { getAffiliateTid } from '../../utils/tracking';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import * as S from './SubscribePage.styles';

interface PlanConfig {
  label: string;
  description: string;
  basePrice: number;
  baseSeats: number;
  extraSeatPrice: number;
  baseStorageGB: number;
  extraStorageBlockGB: number;
  extraStorageBlockPrice: number;
  jobsLimit: number;
  features: PricingFeature[];
}

const PLAN_CONFIG: Record<'FREE' | 'STARTER' | 'PROFESSIONAL', PlanConfig> = {
  FREE: {
    label: 'Free',
    description: 'Included by default for every account',
    basePrice: 0,
    baseSeats: 1,
    extraSeatPrice: 0,
    baseStorageGB: 0.25,
    extraStorageBlockGB: 0,
    extraStorageBlockPrice: 0,
    jobsLimit: 10,
    features: [
      { text: '1 worker seat', included: true },
      { text: '10 jobs/month', included: true },
      { text: '250MB storage', included: true },
    ],
  },
  STARTER: {
    label: 'Starter',
    description: 'For small teams getting started',
    basePrice: 39,
    baseSeats: 3,
    extraSeatPrice: 10,
    baseStorageGB: 10,
    extraStorageBlockGB: 3,
    extraStorageBlockPrice: 10,
    jobsLimit: 150,
    features: [
      { text: '3 worker seats (+$10/extra seat)', included: true },
      { text: '150 jobs/month', included: true },
      { text: '10GB storage (+$10/3GB block)', included: true },
      { text: 'Job management', included: true },
      { text: 'Customer management', included: true },
    ],
  },
  PROFESSIONAL: {
    label: 'Professional',
    description: 'Everything you need to run your field operations',
    basePrice: 79,
    baseSeats: 8,
    extraSeatPrice: 8,
    baseStorageGB: 30,
    extraStorageBlockGB: 5,
    extraStorageBlockPrice: 10,
    jobsLimit: 200,
    features: [
      { text: '8 worker seats (+$8/extra seat)', included: true },
      { text: '200 jobs/month', included: true },
      { text: '30GB storage (+$10/5GB block)', included: true },
      { text: 'Workflow builder', included: true },
      { text: 'Asset tracking', included: true },
      { text: 'Priority support', included: true },
    ],
  },
};

const PAID_PLAN_TYPES = [
  CreateCheckoutSessionRequestPlanTypeEnum.Starter,
  CreateCheckoutSessionRequestPlanTypeEnum.Professional,
] as const;

export const SubscribePage: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [extras, setExtras] = useState<Record<string, { seats: number; storageBlocks: number }>>({
    STARTER: { seats: 0, storageBlocks: 0 },
    PROFESSIONAL: { seats: 0, storageBlocks: 0 },
  });
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const { showError } = useSnackbar();

  const handleSubscribe = async (planType: PlanType) => {
    const { seats, storageBlocks } = extras[planType] ?? { seats: 0, storageBlocks: 0 };
    setLoadingPlan(planType);
    try {
      const { data } = await subscriptionService.createCheckout({
        planType,
        extraSeats: seats,
        extraStorageBlocks: storageBlocks,
      });
      const { transactionId } = data as Record<string, string>;

      const profile = await companyService.getProfile().then((r) => r.data).catch(() => null);

      const paddle = getPaddleInstance();
      if (!paddle) {
        showError('Payment system not available. Please refresh the page and try again.');
        return;
      }

      paddle.Checkout.open({
        transactionId,
        customData: {
          companyId: profile?.id ?? null,
          email: profile?.email ?? null,
          fp_tid: getAffiliateTid(),
        },
        settings: {
          successUrl: `${window.location.origin}/subscription/success`,
        },
        // @ts-expect-error eventCallback is not in Paddle's CheckoutOpenOptions types but is supported at runtime
        eventCallback: (event: PaddleEventData) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
            refresh();
            navigate('/subscription/success');
          }
          if (event.name === CheckoutEventNames.CHECKOUT_CLOSED) {
            navigate('/subscription/cancel');
          }
        },
      });
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to start checkout. Please try again.'));
    } finally {
      setLoadingPlan(null);
    }
  };

  const updateExtra = (planType: string, field: 'seats' | 'storageBlocks', value: number) => {
    const clamped = Number.isFinite(value) && value >= 0 ? value : 0;
    setExtras((prev) => ({ ...prev, [planType]: { ...prev[planType], [field]: clamped } }));
  };

  return (
    <S.PageWrapper>
      <S.HeadingWrapper>
        <Typography variant="h4" fontWeight={700}>
          Upgrade Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose the plan that fits your team.
        </Typography>
      </S.HeadingWrapper>

      <S.CardsRow>
        <PricingCard
          planName={PLAN_CONFIG.FREE.label}
          planDescription={PLAN_CONFIG.FREE.description}
          price={PLAN_CONFIG.FREE.basePrice}
          currency="$"
          pricePeriod="per month"
          buttonText="Included by default"
          disabled
          icon={<CreditCardIcon sx={{ fontSize: 40, color: '#fff' }} />}
          features={PLAN_CONFIG.FREE.features}
          background="linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)"
        />

        {PAID_PLAN_TYPES.map((planType) => {
          const config = PLAN_CONFIG[planType];
          const { seats, storageBlocks } = extras[planType];
          const totalSeats = config.baseSeats + seats;
          const totalStorageGB = config.baseStorageGB + storageBlocks * config.extraStorageBlockGB;
          const totalPrice = config.basePrice + seats * config.extraSeatPrice + storageBlocks * config.extraStorageBlockPrice;

          return (
            <PricingCard
              key={planType}
              planName={config.label}
              planDescription={config.description}
              price={totalPrice}
              currency="$"
              pricePeriod="per month"
              buttonText={loadingPlan === planType ? 'Loading...' : 'Subscribe Now'}
              onButtonClick={() => handleSubscribe(planType)}
              icon={<CreditCardIcon sx={{ fontSize: 40, color: '#fff' }} />}
              featured={planType === CreateCheckoutSessionRequestPlanTypeEnum.Professional}
              features={config.features}
              background="linear-gradient(135deg, #101a32 0%, #1a2a4a 100%)"
              stepper={
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  <S.StepperField>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Extra seats
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={seats}
                      onChange={(e) => updateExtra(planType, 'seats', Number(e.target.value))}
                      slotProps={{ htmlInput: { min: 0 } }}
                      sx={S.stepperInputSx}
                    />
                  </S.StepperField>
                  <S.StepperField>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      Extra storage blocks ({config.extraStorageBlockGB}GB each)
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={storageBlocks}
                      onChange={(e) => updateExtra(planType, 'storageBlocks', Number(e.target.value))}
                      slotProps={{ htmlInput: { min: 0 } }}
                      sx={S.stepperInputSx}
                    />
                  </S.StepperField>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    {totalSeats} seats total, {totalStorageGB}GB total
                  </Typography>
                </Stack>
              }
            />
          );
        })}
      </S.CardsRow>
    </S.PageWrapper>
  );
};
