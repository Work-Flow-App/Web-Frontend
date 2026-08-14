import { SubscriptionStatusResponseStatusEnum } from '../../workflow-api';
import { useSubscription } from '../contexts/SubscriptionContext';

const MUTATION_ALLOWED_STATUSES: SubscriptionStatusResponseStatusEnum[] = [
  SubscriptionStatusResponseStatusEnum.Trial,
  SubscriptionStatusResponseStatusEnum.Active,
  SubscriptionStatusResponseStatusEnum.PastDue,
];

export interface UseCanMutateResult {
  canMutate: boolean;
  reason: string | null;
  isLoading: boolean;
}

/**
 * Whether the current company can perform mutating actions (create/edit/delete),
 * based on subscription status. This is a proactive UX check only — the server
 * (402 response, handled centrally in axiosConfig.ts) is the real enforcement point.
 *
 * @returns {Object} - { canMutate: boolean, reason: string | null, isLoading: boolean }
 * - canMutate: false when the subscription is PAUSED/CANCELLED/EXPIRED
 * - reason: human-readable explanation to show the user when canMutate is false
 *
 * @example
 * ```tsx
 * const { canMutate, reason } = useCanMutate();
 *
 * const handleAddJob = () => {
 *   if (!canMutate) {
 *     showError(reason ?? 'Your subscription is inactive.');
 *     return;
 *   }
 *   // ...proceed
 * };
 * ```
 */
export function useCanMutate(): UseCanMutateResult {
  const { status, isLoading } = useSubscription();

  if (!status?.status) {
    return { canMutate: true, reason: null, isLoading };
  }

  const allowed = MUTATION_ALLOWED_STATUSES.includes(status.status);

  return {
    canMutate: allowed,
    reason: allowed ? null : 'Your subscription is inactive. Reactivate your plan to continue creating or editing.',
    isLoading,
  };
}
