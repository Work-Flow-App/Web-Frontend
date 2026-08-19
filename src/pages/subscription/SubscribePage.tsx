import React, { useState } from 'react';
import { Typography, TextField, Stack, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
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
import { computeExtraSeatsFromHeadcount, computePlanMonthlyTotal, computeTotalStorageGB } from '../../utils/subscriptionPricing';
import { floowColors } from '../../theme/colors';
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

type PlanKey = 'STARTER' | 'PROFESSIONAL';

const PLAN_CONFIG: Record<PlanKey, PlanConfig> = {
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
      { text: 'Company profile', included: true },
    ],
  },
};

const PAID_PLAN_TYPES = [
  CreateCheckoutSessionRequestPlanTypeEnum.Starter,
  CreateCheckoutSessionRequestPlanTypeEnum.Professional,
] as const;

// Feature checklist shown in the "Compare features" table below the cards.
// Each higher tier is a superset of the one below it.
const FEATURE_MATRIX: { label: string; values: Record<PlanKey, boolean> }[] = [
  { label: 'Job management', values: { STARTER: true, PROFESSIONAL: true } },
  { label: 'Customer management', values: { STARTER: true, PROFESSIONAL: true } },
  { label: 'Workflow builder', values: { STARTER: false, PROFESSIONAL: true } },
  { label: 'Asset tracking', values: { STARTER: false, PROFESSIONAL: true } },
  { label: 'Priority support', values: { STARTER: false, PROFESSIONAL: true } },
  // Starter only gets worker/staff profiles; the company profile is Professional-only.
  { label: 'Company profile', values: { STARTER: false, PROFESSIONAL: true } },
];

export const SubscribePage: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [headcount, setHeadcount] = useState<number>(1);
  const [storageExtras, setStorageExtras] = useState<Record<string, number>>({
    STARTER: 0,
    PROFESSIONAL: 0,
  });
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const { showError } = useSnackbar();

  // Single "how many people?" input drives extra-seat pricing on every paid card at
  // once, instead of setting seats per plan - each card only charges for the seats
  // beyond what it already includes.
  const getPricingInfo = (planKey: PlanKey) => {
    const config = PLAN_CONFIG[planKey];
    const storageBlocks = storageExtras[planKey] ?? 0;
    const extraSeats = computeExtraSeatsFromHeadcount(headcount, config.baseSeats);
    const monthlyTotal = computePlanMonthlyTotal({
      basePrice: config.basePrice,
      extraSeats,
      extraSeatPrice: config.extraSeatPrice,
      storageBlocks,
      extraStorageBlockPrice: config.extraStorageBlockPrice,
    });
    const totalSeats = config.baseSeats + extraSeats;
    const totalStorageGB = computeTotalStorageGB({
      baseStorageGB: config.baseStorageGB,
      storageBlocks,
      extraStorageBlockGB: config.extraStorageBlockGB,
    });

    return { extraSeats, storageBlocks, totalSeats, totalStorageGB, monthlyTotal };
  };

  const handleHeadcountChange = (value: number) => {
    setHeadcount(Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1);
  };

  const updateStorageBlocks = (planKey: string, value: number) => {
    const clamped = Number.isFinite(value) && value >= 0 ? value : 0;
    setStorageExtras((prev) => ({ ...prev, [planKey]: clamped }));
  };

  const handleSubscribe = async (planType: PlanType) => {
    const info = getPricingInfo(planType as PlanKey);
    setLoadingPlan(planType);
    try {
      const { data } = await subscriptionService.createCheckout({
        planType,
        extraSeats: info.extraSeats,
        extraStorageBlocks: info.storageBlocks,
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

      <S.ControlsRow>
        <S.HeadcountField>
          <Typography variant="caption" color="text.secondary">
            How many people?
          </Typography>
          <TextField
            type="number"
            size="small"
            value={headcount}
            onChange={(e) => handleHeadcountChange(Number(e.target.value))}
            slotProps={{ htmlInput: { min: 1 } }}
            sx={{ width: 100 }}
          />
        </S.HeadcountField>
      </S.ControlsRow>

      <S.CardsRow>
        {PAID_PLAN_TYPES.map((planType) => {
          const planKey = planType as PlanKey;
          const config = PLAN_CONFIG[planKey];
          const info = getPricingInfo(planKey);

          return (
            <PricingCard
              key={planType}
              planName={config.label}
              planDescription={config.description}
              price={info.monthlyTotal}
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
                      Extra storage blocks ({config.extraStorageBlockGB}GB each)
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={info.storageBlocks}
                      onChange={(e) => updateStorageBlocks(planKey, Number(e.target.value))}
                      slotProps={{ htmlInput: { min: 0 } }}
                      sx={S.stepperInputSx}
                    />
                  </S.StepperField>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    {info.totalSeats} seats total, {info.totalStorageGB}GB total
                  </Typography>
                </Stack>
              }
            />
          );
        })}
      </S.CardsRow>

      <S.ComparisonSection>
        <Typography variant="h6" fontWeight={700}>
          Compare features
        </Typography>
        <TableContainer>
          <S.ComparisonTable>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{PLAN_CONFIG.STARTER.label}</TableCell>
                <TableCell>{PLAN_CONFIG.PROFESSIONAL.label}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Seats</TableCell>
                <TableCell>{getPricingInfo('STARTER').totalSeats}</TableCell>
                <TableCell>{getPricingInfo('PROFESSIONAL').totalSeats}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jobs/month</TableCell>
                <TableCell>{PLAN_CONFIG.STARTER.jobsLimit}</TableCell>
                <TableCell>{PLAN_CONFIG.PROFESSIONAL.jobsLimit}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Storage</TableCell>
                <TableCell>{getPricingInfo('STARTER').totalStorageGB}GB</TableCell>
                <TableCell>{getPricingInfo('PROFESSIONAL').totalStorageGB}GB</TableCell>
              </TableRow>
              {FEATURE_MATRIX.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  {(['STARTER', 'PROFESSIONAL'] as PlanKey[]).map((planKey) => (
                    <TableCell key={planKey}>
                      {row.values[planKey] ? (
                        <CheckIcon fontSize="small" sx={{ color: floowColors.success.main }} />
                      ) : (
                        <RemoveIcon fontSize="small" sx={{ color: floowColors.blackAlpha[30] }} />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </S.ComparisonTable>
        </TableContainer>
      </S.ComparisonSection>
    </S.PageWrapper>
  );
};
