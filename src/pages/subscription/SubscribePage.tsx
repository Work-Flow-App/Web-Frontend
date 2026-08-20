import React, { useState } from 'react';
import { Typography, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { getPaddleInstance, CheckoutEventNames, type PaddleEventData } from '@paddle/paddle-js';
import { PricingCard } from '../../components/UI/PricingCard';
import type { PricingFeature } from '../../components/UI/PricingCard';
import { subscriptionService } from '../../services/api/subscription';
import { CreateCheckoutSessionRequestPlanTypeEnum, SubscriptionStatusResponseStatusEnum } from '../../../workflow-api';
import type { CreateCheckoutSessionRequestPlanTypeEnum as PlanType } from '../../../workflow-api';
import { companyService } from '../../services/api/company';
import { getAffiliateTid } from '../../utils/tracking';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { computeExtraSeatsFromHeadcount, computePlanMonthlyTotal, PLAN_TIERS } from '../../utils/subscriptionPricing';
import { floowColors } from '../../theme/colors';
import * as S from './SubscribePage.styles';

interface PlanConfig {
  label: string;
  description: string;
  basePrice: number;
  baseSeats: number;
  maxSeats: number;
  extraSeatPrice: number;
  jobsLimit: number;
  features: PricingFeature[];
}

type PlanKey = 'FREE_TRIAL' | 'STARTER' | 'PROFESSIONAL';
type PaidPlanKey = 'STARTER' | 'PROFESSIONAL';

// Numeric fields (price, seats, jobs limit) come from the shared PLAN_TIERS source of
// truth in subscriptionPricing.ts; only label/description/features are page-specific.
const PLAN_CONFIG: Record<PlanKey, PlanConfig> = {
  FREE_TRIAL: {
    label: 'Free Trial',
    description: 'Try full access risk-free before choosing a plan',
    basePrice: 0,
    baseSeats: 1,
    maxSeats: 1,
    extraSeatPrice: 0,
    jobsLimit: 10,
    features: [
      { text: '1 User Access Included', included: true },
      { text: 'Up to 10 Jobs Included', included: true },
      { text: 'Full Feature Access During Trial', included: true },
      { text: 'Mobile App & Web App Access for Field Workers', included: true },
      { text: 'Instant Upgrade to Starter or Professional Anytime', included: true },
      { text: 'No Credit Card Required', included: true },
    ],
  },
  STARTER: {
    label: 'Starter',
    description: 'Essential tools to manage and grow your business operations',
    basePrice: PLAN_TIERS.STARTER.basePrice,
    baseSeats: PLAN_TIERS.STARTER.baseSeats,
    maxSeats: 30,
    extraSeatPrice: PLAN_TIERS.STARTER.extraSeatPrice,
    jobsLimit: PLAN_TIERS.STARTER.jobsLimit,
    features: [
      { text: '3 Team Members Included (+$10/mo per additional user)', included: true },
      { text: 'Up to 70 Jobs per Month (resets monthly)', included: true },
      { text: 'Staff Profile Management', included: true },
      { text: 'Mobile App & Web App Access for Field Workers', included: true },
      { text: 'Real-Time Job Tracking & Site Visit Management', included: true },
      { text: 'No Contract — Cancel Anytime', included: true },
    ],
  },
  PROFESSIONAL: {
    label: 'Professional',
    description: 'Complete automation for scaling companies',
    basePrice: PLAN_TIERS.PROFESSIONAL.basePrice,
    baseSeats: PLAN_TIERS.PROFESSIONAL.baseSeats,
    maxSeats: 100,
    extraSeatPrice: PLAN_TIERS.PROFESSIONAL.extraSeatPrice,
    jobsLimit: PLAN_TIERS.PROFESSIONAL.jobsLimit,
    features: [
      { text: '8 Team Members Included (+$8/mo per additional user)', included: true },
      { text: 'Up to 200 Jobs per Month (resets monthly)', included: true },
      { text: 'Up to 500 Estimates & Invoices per Month', included: true },
      { text: 'Full Company & Staff Profile Management', included: true },
      { text: 'Share Case Studies with public to win more jobs/contract', included: true },
      { text: 'Mobile App & Web App Access for Field Workers', included: true },
      { text: 'Real-Time Job Tracking & Site Visit Management', included: true },
      { text: 'No Contract — Cancel Anytime', included: true },
    ],
  },
};

const PLAN_TYPE_BY_KEY: Record<PaidPlanKey, PlanType> = {
  STARTER: CreateCheckoutSessionRequestPlanTypeEnum.Starter,
  PROFESSIONAL: CreateCheckoutSessionRequestPlanTypeEnum.Professional,
};

const CARD_ORDER: PlanKey[] = ['FREE_TRIAL', 'STARTER', 'PROFESSIONAL'];

// One shared "how many users" value drives every card's price at once — each plan
// applies it against its own base seats/extra-seat price, so all three stay in sync.
const MIN_HEADCOUNT = 1;
const MAX_HEADCOUNT = Math.max(...Object.values(PLAN_CONFIG).map((c) => c.maxSeats));

// Feature checklist shown in the "Compare features" table below the cards.
const FEATURE_MATRIX: { label: string; values: Record<PlanKey, boolean> }[] = [
  { label: 'Staff Profile Management', values: { FREE_TRIAL: true, STARTER: true, PROFESSIONAL: true } },
  { label: 'Company Profile Management', values: { FREE_TRIAL: false, STARTER: false, PROFESSIONAL: true } },
  { label: 'Estimates & Invoices (500/mo)', values: { FREE_TRIAL: false, STARTER: false, PROFESSIONAL: true } },
  { label: 'Real-Time Job Tracking & Site Visits', values: { FREE_TRIAL: false, STARTER: true, PROFESSIONAL: true } },
  { label: 'Public Case Studies', values: { FREE_TRIAL: false, STARTER: false, PROFESSIONAL: true } },
  { label: 'No Contract — Cancel Anytime', values: { FREE_TRIAL: false, STARTER: true, PROFESSIONAL: true } },
];

export const SubscribePage: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('PROFESSIONAL');
  const [headcount, setHeadcount] = useState<number>(PLAN_CONFIG.PROFESSIONAL.baseSeats);
  const navigate = useNavigate();
  const { status, refresh } = useSubscription();
  const { showError } = useSnackbar();

  const isOnTrial = status?.status === SubscriptionStatusResponseStatusEnum.Trial;
  const isPaidPlanKey = (key: PlanKey): key is PaidPlanKey => key === 'STARTER' || key === 'PROFESSIONAL';

  // The slider's single headcount value is shared across every card — each plan just
  // applies it against its own base seats and extra-seat price, so moving the slider
  // updates all three prices at once, each according to its own plan's rules.
  const getPricingInfo = (planKey: PaidPlanKey) => {
    const config = PLAN_CONFIG[planKey];
    const extraSeats = computeExtraSeatsFromHeadcount(headcount, config.baseSeats);
    const monthlyTotal = computePlanMonthlyTotal({
      basePrice: config.basePrice,
      extraSeats,
      extraSeatPrice: config.extraSeatPrice,
      storageBlocks: 0,
      extraStorageBlockPrice: 0,
    });
    const totalSeats = Math.max(config.baseSeats, headcount);

    return { extraSeats, totalSeats, monthlyTotal };
  };

  const handleSubscribe = async () => {
    if (!isPaidPlanKey(selectedPlan)) return;
    const planType = PLAN_TYPE_BY_KEY[selectedPlan];
    const info = getPricingInfo(selectedPlan);
    setLoadingPlan(planType);
    try {
      const { data } = await subscriptionService.createCheckout({
        planType,
        extraSeats: info.extraSeats,
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

  const selectedConfig = PLAN_CONFIG[selectedPlan];
  const isLoadingSelected = isPaidPlanKey(selectedPlan) && loadingPlan === PLAN_TYPE_BY_KEY[selectedPlan];
  const orderDisabled = !isPaidPlanKey(selectedPlan) || isLoadingSelected;
  const orderButtonText = !isPaidPlanKey(selectedPlan)
    ? isOnTrial
      ? 'Current Plan'
      : 'Included at Signup'
    : isLoadingSelected
      ? 'Loading...'
      : 'Order';

  return (
    <S.PageWrapper>
      <S.HeadingWrapper>
        <S.Eyebrow>
          <S.EyebrowLine />
          <span>Price</span>
          <S.EyebrowLine />
        </S.Eyebrow>
        <Typography variant="h4" fontWeight={700}>
          Upgrade Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose the plan that fits your team.
        </Typography>
      </S.HeadingWrapper>

      <S.UniversalControlBar>
        <S.UsersInfo>
          <S.UsersIconCircle>
            <PersonOutlineIcon fontSize="small" sx={{ color: floowColors.text.heading }} />
          </S.UsersIconCircle>
          <S.UsersTextGroup>
            <Typography variant="body2" fontWeight={600}>
              Users
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Starting at {selectedConfig.baseSeats} users
            </Typography>
          </S.UsersTextGroup>
        </S.UsersInfo>

        <S.SliderWrapper>
          <S.SeatSlider
            value={headcount}
            min={MIN_HEADCOUNT}
            max={MAX_HEADCOUNT}
            step={1}
            valueLabelDisplay="on"
            onChange={(_, value) => setHeadcount(value as number)}
            aria-label="Number of users"
          />
        </S.SliderWrapper>

        <S.OrderButton onClick={handleSubscribe} disabled={orderDisabled}>
          {orderButtonText}
        </S.OrderButton>
      </S.UniversalControlBar>

      <S.CardsRow role="radiogroup" aria-label="Choose a plan">
        {CARD_ORDER.map((planKey) => {
          const config = PLAN_CONFIG[planKey];
          const price = isPaidPlanKey(planKey) ? getPricingInfo(planKey).monthlyTotal : 0;

          return (
            <PricingCard
              key={planKey}
              planName={config.label}
              planDescription={config.description}
              price={price}
              currency="$"
              pricePeriod="per month"
              featured={planKey === 'PROFESSIONAL'}
              features={config.features}
              selectable
              selected={selectedPlan === planKey}
              onSelect={() => setSelectedPlan(planKey)}
            />
          );
        })}
      </S.CardsRow>

      <S.ComparisonSection>
        <Typography variant="h6" fontWeight={700}>
          Compare features
        </Typography>
        <S.ComparisonCard>
          <TableContainer>
            <S.ComparisonTable>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{PLAN_CONFIG.FREE_TRIAL.label}</TableCell>
                  <TableCell>{PLAN_CONFIG.STARTER.label}</TableCell>
                  <TableCell>
                    <S.FeaturedColumnHeader>
                      {PLAN_CONFIG.PROFESSIONAL.label}
                      <S.FeaturedChip>Most Popular</S.FeaturedChip>
                    </S.FeaturedColumnHeader>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Seats</TableCell>
                  <TableCell>{PLAN_CONFIG.FREE_TRIAL.baseSeats}</TableCell>
                  <TableCell>{getPricingInfo('STARTER').totalSeats}</TableCell>
                  <TableCell>{getPricingInfo('PROFESSIONAL').totalSeats}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jobs/month</TableCell>
                  <TableCell>{PLAN_CONFIG.FREE_TRIAL.jobsLimit}</TableCell>
                  <TableCell>{PLAN_CONFIG.STARTER.jobsLimit}</TableCell>
                  <TableCell>{PLAN_CONFIG.PROFESSIONAL.jobsLimit}</TableCell>
                </TableRow>
                {FEATURE_MATRIX.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell>{row.label}</TableCell>
                    {(['FREE_TRIAL', 'STARTER', 'PROFESSIONAL'] as PlanKey[]).map((planKey) => (
                      <TableCell key={planKey}>
                        <S.FeatureBadge included={row.values[planKey]}>
                          {row.values[planKey] ? (
                            <CheckIcon fontSize="small" sx={{ color: floowColors.success.main }} />
                          ) : (
                            <RemoveIcon fontSize="small" sx={{ color: floowColors.text.secondary }} />
                          )}
                        </S.FeatureBadge>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </S.ComparisonTable>
          </TableContainer>
        </S.ComparisonCard>
      </S.ComparisonSection>
    </S.PageWrapper>
  );
};
