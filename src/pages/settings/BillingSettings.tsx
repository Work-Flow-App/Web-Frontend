import React, { useEffect, useState } from 'react';
import {
  Typography,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  LinearProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from 'react-router-dom';
import { getPaddleInstance, CheckoutEventNames, type PaddleEventData } from '@paddle/paddle-js';
import { SubscriptionStatusResponseStatusEnum } from '../../../workflow-api';
import type { UsageSummaryResponse } from '../../../workflow-api';
import { subscriptionService } from '../../services/api/subscription';
import { companyService } from '../../services/api/company';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { getAffiliateTid } from '../../utils/tracking';
import {
  inferPlanTierFromJobsLimit,
  computeCurrentStorageBlocks,
  computeCurrentExtraSeats,
} from '../../utils/subscriptionPricing';
import { floowColors } from '../../theme/colors';
import * as S from './BillingSettings.styled';

type ChipColor = 'success' | 'warning' | 'error' | 'default' | 'info';

interface StatusConfig {
  label: string;
  color: ChipColor;
}

const STATUS_CONFIG: Partial<Record<string, StatusConfig>> = {
  [SubscriptionStatusResponseStatusEnum.Active]: { label: 'Active', color: 'success' },
  [SubscriptionStatusResponseStatusEnum.Trial]: { label: 'Trial', color: 'info' },
  [SubscriptionStatusResponseStatusEnum.PastDue]: { label: 'Past Due', color: 'warning' },
  [SubscriptionStatusResponseStatusEnum.Paused]: { label: 'Paused', color: 'error' },
  [SubscriptionStatusResponseStatusEnum.Cancelled]: { label: 'Cancelled', color: 'error' },
  [SubscriptionStatusResponseStatusEnum.Expired]: { label: 'Expired', color: 'error' },
};

const MANAGEABLE_STATUSES: SubscriptionStatusResponseStatusEnum[] = [
  SubscriptionStatusResponseStatusEnum.Active,
  SubscriptionStatusResponseStatusEnum.PastDue,
  SubscriptionStatusResponseStatusEnum.Paused,
  SubscriptionStatusResponseStatusEnum.Cancelled,
];

const SUBSCRIBE_STATUSES: SubscriptionStatusResponseStatusEnum[] = [
  SubscriptionStatusResponseStatusEnum.Expired,
  SubscriptionStatusResponseStatusEnum.Paused,
  SubscriptionStatusResponseStatusEnum.Cancelled,
];

// Statuses where the company already has access and can move to a higher tier
// (as opposed to SUBSCRIBE_STATUSES, which need a brand new subscription).
const UPGRADE_STATUSES: SubscriptionStatusResponseStatusEnum[] = [
  SubscriptionStatusResponseStatusEnum.Trial,
  SubscriptionStatusResponseStatusEnum.Active,
  SubscriptionStatusResponseStatusEnum.PastDue,
];

const formatBytes = (bytes?: number): string => {
  if (!bytes) return '0 MB';
  const gb = bytes / 1_000_000_000;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(bytes / 1_000_000).toFixed(0)} MB`;
};

const meterColor = (used: number, limit: number, warningReached?: boolean): string => {
  if (limit > 0 && used >= limit) return floowColors.error.main;
  if (warningReached) return floowColors.warning.main;
  return floowColors.success.main;
};

export const BillingSettings: React.FC = () => {
  const { status, isLoading, refresh } = useSubscription();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [usage, setUsage] = useState<UsageSummaryResponse | null>(null);
  const [storageDialogOpen, setStorageDialogOpen] = useState(false);
  const [blocksToAdd, setBlocksToAdd] = useState(1);
  const [purchasingStorage, setPurchasingStorage] = useState(false);
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const [seatsToAdd, setSeatsToAdd] = useState(1);
  const [purchasingSeats, setPurchasingSeats] = useState(false);

  const loadUsage = () => {
    companyService
      .getUsage()
      .then((res) => setUsage(res.data))
      .catch((error) => showError(extractErrorMessage(error, 'Failed to load usage data')));
  };

  useEffect(() => {
    loadUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <S.SectionWrapper elevation={0}>
        <CircularProgress size={24} />
      </S.SectionWrapper>
    );
  }

  if (!status) {
    return (
      <S.SectionWrapper elevation={0}>
        <S.SectionHeader>
          <Typography variant="h6" fontWeight={600}>
            Billing & Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have an active subscription yet.
          </Typography>
        </S.SectionHeader>
        <S.ActionsRow>
          <Button variant="contained" size="small" onClick={() => navigate('/subscribe')}>
            Subscribe Now
          </Button>
        </S.ActionsRow>
      </S.SectionWrapper>
    );
  }

  const currentStatus = status.status as SubscriptionStatusResponseStatusEnum | undefined;
  const statusConfig = currentStatus ? STATUS_CONFIG[currentStatus] : undefined;

  const canManageBilling = currentStatus ? MANAGEABLE_STATUSES.includes(currentStatus) : false;

  const canCancel = currentStatus === SubscriptionStatusResponseStatusEnum.Active;

  const needsSubscription = currentStatus ? SUBSCRIBE_STATUSES.includes(currentStatus) : false;

  const canUpgrade = currentStatus ? UPGRADE_STATUSES.includes(currentStatus) : false;

  // The API doesn't expose which paid tier a company is on directly, but each tier has
  // a distinct jobs limit, so it can be identified from the usage summary.
  const currentTier = inferPlanTierFromJobsLimit(usage?.jobsLimit);
  const canBuyStorage = currentStatus === SubscriptionStatusResponseStatusEnum.Active && currentTier !== null;
  const storageFull = Boolean(
    usage?.storageLimitBytes && (usage.storageUsedBytes ?? 0) >= usage.storageLimitBytes
  );
  const canBuySeats = canBuyStorage;
  const seatsFull = Boolean(usage?.seatsLimit && (usage.activeWorkers ?? 0) >= usage.seatsLimit);

  const openStorageDialog = () => {
    setBlocksToAdd(1);
    setStorageDialogOpen(true);
  };

  const handleBuyStorage = async () => {
    if (!currentTier) return;
    setPurchasingStorage(true);
    try {
      const currentBlocks = computeCurrentStorageBlocks(currentTier, usage?.storageLimitBytes);
      const currentExtraSeats = computeCurrentExtraSeats(currentTier, usage?.seatsLimit);

      const { data } = await subscriptionService.createCheckout({
        planType: currentTier.key,
        extraSeats: currentExtraSeats,
        extraStorageBlocks: currentBlocks + blocksToAdd,
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
          successUrl: window.location.href,
        },
        // @ts-expect-error eventCallback is not in Paddle's CheckoutOpenOptions types but is supported at runtime
        eventCallback: (event: PaddleEventData) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
            showSuccess('Storage purchase complete.');
            setStorageDialogOpen(false);
            refresh();
            loadUsage();
          }
        },
      });
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to start storage checkout. Please try again.'));
    } finally {
      setPurchasingStorage(false);
    }
  };

  const openSeatDialog = () => {
    setSeatsToAdd(1);
    setSeatDialogOpen(true);
  };

  const handleBuySeat = async () => {
    if (!currentTier) return;
    setPurchasingSeats(true);
    try {
      const currentExtraSeats = computeCurrentExtraSeats(currentTier, usage?.seatsLimit);
      const currentBlocks = computeCurrentStorageBlocks(currentTier, usage?.storageLimitBytes);

      const { data } = await subscriptionService.createCheckout({
        planType: currentTier.key,
        extraSeats: currentExtraSeats + seatsToAdd,
        extraStorageBlocks: currentBlocks,
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
          successUrl: window.location.href,
        },
        // @ts-expect-error eventCallback is not in Paddle's CheckoutOpenOptions types but is supported at runtime
        eventCallback: (event: PaddleEventData) => {
          if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
            showSuccess('Seat purchase complete.');
            setSeatDialogOpen(false);
            refresh();
            loadUsage();
          }
        },
      });
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to start seat checkout. Please try again.'));
    } finally {
      setPurchasingSeats(false);
    }
  };

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const { data } = await subscriptionService.getPortalUrl();
      window.open((data as Record<string, string>).portalUrl, '_blank');
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to open billing portal. Please try again.'));
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      await subscriptionService.cancelSubscription();
      showSuccess('Subscription cancelled. You keep full access until the end of the billing period.');
      setCancelDialogOpen(false);
      refresh();
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to cancel subscription. Please try again.'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <S.SectionWrapper elevation={0}>
        <S.SectionHeader>
          <Typography variant="h6" fontWeight={600}>
            Billing & Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your subscription and billing details
          </Typography>
        </S.SectionHeader>

        <S.StatusRow>
          <S.LabelText>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
          </S.LabelText>
          {statusConfig && <Chip label={statusConfig.label} color={statusConfig.color} size="small" />}
        </S.StatusRow>

        {currentStatus === SubscriptionStatusResponseStatusEnum.Trial && status.trialEndsAt && (
          <S.StatusRow>
            <S.LabelText>
              <Typography variant="body2" color="text.secondary">
                Trial ends
              </Typography>
            </S.LabelText>
            <Typography variant="body2">
              {new Date(status.trialEndsAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </Typography>
          </S.StatusRow>
        )}

        {status.currentPeriodEnd && (
          <S.StatusRow>
            <S.LabelText>
              <Typography variant="body2" color="text.secondary">
                Current period ends
              </Typography>
            </S.LabelText>
            <Typography variant="body2">
              {new Date(status.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </Typography>
          </S.StatusRow>
        )}

        {usage && (
          <S.UsageSection>
            <Typography variant="subtitle2" fontWeight={600}>
              Usage
            </Typography>

            <S.MeterRow>
              <S.MeterLabelRow>
                <Typography variant="body2" color="text.secondary">
                  Jobs this month
                </Typography>
                <Typography variant="body2">
                  {usage.jobsUsedThisMonth ?? 0} / {usage.jobsLimit ?? 0}
                </Typography>
              </S.MeterLabelRow>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((usage.jobsUsedThisMonth ?? 0) / (usage.jobsLimit || 1)) * 100)}
                sx={{
                  borderRadius: '2px',
                  height: '6px',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: meterColor(usage.jobsUsedThisMonth ?? 0, usage.jobsLimit ?? 0, usage.jobsWarningThresholdReached),
                  },
                }}
              />
            </S.MeterRow>

            <S.MeterRow>
              <S.MeterLabelRow>
                <Typography variant="body2" color="text.secondary">
                  Storage
                </Typography>
                <S.MeterValueGroup>
                  <Typography variant="body2" color={storageFull ? 'error' : undefined}>
                    {formatBytes(usage.storageUsedBytes)} / {formatBytes(usage.storageLimitBytes)}
                  </Typography>
                  {canBuyStorage && (
                    <Button
                      variant={storageFull ? 'contained' : 'text'}
                      color={storageFull ? 'error' : 'primary'}
                      size="small"
                      onClick={openStorageDialog}
                    >
                      Buy Storage
                    </Button>
                  )}
                </S.MeterValueGroup>
              </S.MeterLabelRow>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((usage.storageUsedBytes ?? 0) / (usage.storageLimitBytes || 1)) * 100)}
                sx={{
                  borderRadius: '2px',
                  height: '6px',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: meterColor(
                      usage.storageUsedBytes ?? 0,
                      usage.storageLimitBytes ?? 0,
                      usage.storageWarningThresholdReached
                    ),
                  },
                }}
              />
            </S.MeterRow>

            <S.MeterRow>
              <S.MeterLabelRow>
                <Typography variant="body2" color="text.secondary">
                  Worker seats
                </Typography>
                <S.MeterValueGroup>
                  <Typography variant="body2" color={seatsFull ? 'error' : undefined}>
                    {usage.activeWorkers ?? 0} / {usage.seatsLimit ?? 0}
                  </Typography>
                  {canBuySeats && (
                    <Button
                      variant={seatsFull ? 'contained' : 'text'}
                      color={seatsFull ? 'error' : 'primary'}
                      size="small"
                      onClick={openSeatDialog}
                    >
                      Buy Extra Seat
                    </Button>
                  )}
                </S.MeterValueGroup>
              </S.MeterLabelRow>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, ((usage.activeWorkers ?? 0) / (usage.seatsLimit || 1)) * 100)}
                sx={{
                  borderRadius: '2px',
                  height: '6px',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: meterColor(usage.activeWorkers ?? 0, usage.seatsLimit ?? 0, usage.seatsWarningThresholdReached),
                  },
                }}
              />
            </S.MeterRow>
          </S.UsageSection>
        )}

        <Divider />

        <S.ActionsRow>
          {needsSubscription && (
            <Button variant="contained" onClick={() => navigate('/subscribe')}>
              Subscribe
            </Button>
          )}
          {canUpgrade && (
            <Button variant="contained" size="small" onClick={() => navigate('/subscribe')}>
              Upgrade Plan
            </Button>
          )}
          {canManageBilling && (
            <Button
              variant="outlined"
              onClick={handleManageBilling}
              disabled={loadingPortal}
              size="small"
              startIcon={loadingPortal ? <CircularProgress size={16} /> : undefined}
            >
              Manage Billing
            </Button>
          )}
          {canCancel && (
            <Button variant="outlined" size="small" color="error" onClick={() => setCancelDialogOpen(true)}>
              Cancel Subscription
            </Button>
          )}
        </S.ActionsRow>
      </S.SectionWrapper>

      <Dialog open={cancelDialogOpen} onClose={() => !cancelling && setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your subscription will be cancelled at the end of the current billing period. You'll keep full access until
            then.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} disabled={cancelling}>
            Keep Subscription
          </Button>
          <Button
            onClick={handleCancelSubscription}
            color="error"
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={16} /> : undefined}
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={storageDialogOpen} onClose={() => !purchasingStorage && setStorageDialogOpen(false)}>
        <DialogTitle>Buy Extra Storage</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            {currentTier &&
              `Each block adds ${currentTier.extraStorageBlockGB}GB for $${currentTier.extraStorageBlockPrice}/mo.`}
          </DialogContentText>
          <S.StepperControl>
            <IconButton
              size="small"
              onClick={() => setBlocksToAdd((n) => Math.max(1, n - 1))}
              disabled={blocksToAdd <= 1}
              aria-label="Decrease storage blocks"
            >
              <RemoveIcon />
            </IconButton>
            <S.StepperCount>{blocksToAdd}</S.StepperCount>
            <IconButton size="small" onClick={() => setBlocksToAdd((n) => n + 1)} aria-label="Increase storage blocks">
              <AddIcon />
            </IconButton>
          </S.StepperControl>
          {currentTier && (
            <DialogContentText sx={{ textAlign: 'center' }}>
              +{blocksToAdd * currentTier.extraStorageBlockGB}GB for +${blocksToAdd * currentTier.extraStorageBlockPrice}/mo
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStorageDialogOpen(false)} disabled={purchasingStorage}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBuyStorage}
            disabled={purchasingStorage}
            startIcon={purchasingStorage ? <CircularProgress size={16} /> : undefined}
          >
            Purchase
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={seatDialogOpen} onClose={() => !purchasingSeats && setSeatDialogOpen(false)}>
        <DialogTitle>Buy Extra Seats</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            {currentTier && `Each extra seat is $${currentTier.extraSeatPrice}/mo.`}
          </DialogContentText>
          <S.StepperControl>
            <IconButton
              size="small"
              onClick={() => setSeatsToAdd((n) => Math.max(1, n - 1))}
              disabled={seatsToAdd <= 1}
              aria-label="Decrease seats"
            >
              <RemoveIcon />
            </IconButton>
            <S.StepperCount>{seatsToAdd}</S.StepperCount>
            <IconButton size="small" onClick={() => setSeatsToAdd((n) => n + 1)} aria-label="Increase seats">
              <AddIcon />
            </IconButton>
          </S.StepperControl>
          {currentTier && (
            <DialogContentText sx={{ textAlign: 'center' }}>
              +{seatsToAdd} seat{seatsToAdd !== 1 ? 's' : ''} for +${seatsToAdd * currentTier.extraSeatPrice}/mo
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSeatDialogOpen(false)} disabled={purchasingSeats}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBuySeat}
            disabled={purchasingSeats}
            startIcon={purchasingSeats ? <CircularProgress size={16} /> : undefined}
          >
            Purchase
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
