import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { UPGRADE_PROMPT_EVENT, type UpgradePromptDetail } from '../../../utils/subscriptionErrors';
import { PRO_FEATURE_MESSAGE } from '../../../utils/errorHandler';

/**
 * Shown when a request fails with a Pro-only or plan-limit 402 (see handlePaymentRequired).
 * The subscription is still active, so this only offers the upgrade; nothing else is blocked.
 */
export const UpgradePrompt: React.FC = () => {
  const [prompt, setPrompt] = useState<UpgradePromptDetail | null>(null);
  const navigate = useNavigate();
  const { status } = useSubscription();
  const { canManageSubscription } = useCompanyRole();

  useEffect(() => {
    const onPrompt = (event: Event) => {
      const { detail } = event as CustomEvent<UpgradePromptDetail>;
      // When several requests fail together, keep the first prompt
      setPrompt((current) => current ?? detail);
    };
    window.addEventListener(UPGRADE_PROMPT_EVENT, onPrompt);
    return () => window.removeEventListener(UPGRADE_PROMPT_EVENT, onPrompt);
  }, []);

  if (!prompt) return null;

  const isProFeature = prompt.kind === 'upgrade';
  const title = isProFeature ? 'This is a Pro feature' : "You've reached your plan's limit";
  const body = isProFeature ? PRO_FEATURE_MESSAGE : (prompt.message ?? 'Upgrade your plan to raise it.');

  // Professional is the top plan, so its limits are raised with add-ons in billing
  const action = !canManageSubscription
    ? null
    : status?.planType === 'PROFESSIONAL'
      ? { label: 'Go to billing', to: '/company/profile?tab=billing' }
      : { label: 'Upgrade', to: '/subscribe' };

  const close = () => setPrompt(null);

  return (
    <Dialog open onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
        {!canManageSubscription && (
          <DialogContentText sx={{ mt: 1 }}>Ask your account admin to upgrade.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>{action ? 'Not now' : 'OK'}</Button>
        {action && (
          <Button
            variant="contained"
            onClick={() => {
              close();
              navigate(action.to);
            }}
          >
            {action.label}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
