import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SubscriptionStatusResponseStatusEnum } from '../../../workflow-api';
import { subscriptionService } from '../../services/api/subscription';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
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

const MANAGEABLE_STATUSES = [
  SubscriptionStatusResponseStatusEnum.Active,
  SubscriptionStatusResponseStatusEnum.PastDue,
  SubscriptionStatusResponseStatusEnum.Paused,
  SubscriptionStatusResponseStatusEnum.Cancelled,
];

const SUBSCRIBE_STATUSES = [
  SubscriptionStatusResponseStatusEnum.Expired,
  SubscriptionStatusResponseStatusEnum.Paused,
  SubscriptionStatusResponseStatusEnum.Cancelled,
];

export const BillingSettings: React.FC = () => {
  const { status, refresh } = useSubscription();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  if (!status) return null;

  const currentStatus = status.status as SubscriptionStatusResponseStatusEnum | undefined;
  const statusConfig = currentStatus ? STATUS_CONFIG[currentStatus] : undefined;

  const canManageBilling = currentStatus
    ? MANAGEABLE_STATUSES.includes(currentStatus)
    : false;

  const canCancel = currentStatus === SubscriptionStatusResponseStatusEnum.Active;

  const needsSubscription = currentStatus
    ? SUBSCRIBE_STATUSES.includes(currentStatus)
    : false;

  const handleManageBilling = async () => {
    setLoadingPortal(true);
    try {
      const { data } = await subscriptionService.getPortalUrl();
      window.open((data as Record<string, string>).portalUrl, '_blank');
    } catch {
      showError('Failed to open billing portal. Please try again.');
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
    } catch {
      showError('Failed to cancel subscription. Please try again.');
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
          {statusConfig && (
            <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
          )}
        </S.StatusRow>

        {status.trialEndsAt && (
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

        <Divider />

        <S.ActionsRow>
          {needsSubscription && (
            <Button variant="contained" onClick={() => navigate('/subscribe')}>
              Subscribe
            </Button>
          )}
          {canManageBilling && (
            <Button
              variant="outlined"
              onClick={handleManageBilling}
              disabled={loadingPortal}
              startIcon={loadingPortal ? <CircularProgress size={16} /> : undefined}
            >
              Manage Billing
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Subscription
            </Button>
          )}
        </S.ActionsRow>
      </S.SectionWrapper>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => !cancelling && setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your subscription will be cancelled at the end of the current billing period. You'll keep
            full access until then.
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
    </>
  );
};
