import { useEffect, useMemo, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { dashboardService } from '../../services/api';
import type { DashboardPreferencesUpdateRequest, RecentWorkflowActivityResponse } from '../../services/api';
import { queries } from '../../services/queries';
import { toJobLocationMarkers, toRecentWorkflowActivity } from './dashboardMappers';
import {
  clearLegacyPreferences,
  hasNoSavedChoices,
  mergeQuickActions,
  mergeWidgets,
  readLegacyPreferences,
} from './dashboardPreferences';

const RECENT_ACTIVITY_LIMIT = 10;

const selectRecentActivity = (activities: RecentWorkflowActivityResponse[]) =>
  activities.map(toRecentWorkflowActivity);

export function useRecentWorkflowActivity(enabled: boolean) {
  return useQuery({
    ...queries.recentWorkflowActivity(RECENT_ACTIVITY_LIMIT),
    select: selectRecentActivity,
    enabled,
  });
}

export function useJobLocationMarkers(enabled: boolean) {
  return useQuery({ ...queries.jobLocations(), select: toJobLocationMarkers, enabled });
}

// ─── Preferences ──────────────────────────────────────────────────────────────

const PREFERENCES_KEY = queries.dashboardPreferences().queryKey;
const SAVE_PREFERENCES_KEY = ['dashboard', 'preferences', 'save'];

function useSavePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: SAVE_PREFERENCES_KEY,
    // Saves must reach the server in order, or an older widget list could overwrite a newer one
    scope: { id: 'dashboard-preferences' },
    // The server leaves any field that isn't sent as it was
    mutationFn: async (changes: DashboardPreferencesUpdateRequest) =>
      (await dashboardService.updatePreferences(changes)).data,
    onMutate: async (changes) => {
      await queryClient.cancelQueries({ queryKey: PREFERENCES_KEY });
      const previous = queryClient.getQueryData(PREFERENCES_KEY);
      queryClient.setQueryData(PREFERENCES_KEY, { ...previous, ...changes });
      return { previous };
    },
    onError: (_error, _next, context) => {
      queryClient.setQueryData(PREFERENCES_KEY, context?.previous);
    },
    onSettled: (saved, error) => {
      // A response from a save with more queued behind it would undo their optimistic state
      if (queryClient.isMutating({ mutationKey: SAVE_PREFERENCES_KEY }) > 1) return;
      if (error) {
        void queryClient.invalidateQueries({ queryKey: PREFERENCES_KEY });
      } else {
        queryClient.setQueryData(PREFERENCES_KEY, saved);
      }
    },
  });
}

export function useDashboardPreferences() {
  const { showError } = useSnackbar();
  const query = useQuery(queries.dashboardPreferences());
  const { mutate } = useSavePreferences();

  const savedWidgets = query.data?.widgets;
  const savedQuickActions = query.data?.quickActions;
  const widgets = useMemo(() => mergeWidgets(savedWidgets), [savedWidgets]);
  const quickActions = useMemo(() => mergeQuickActions(savedQuickActions), [savedQuickActions]);

  /** Applies at once and saves in the background, rolling back if the save fails. */
  const update = (changes: DashboardPreferencesUpdateRequest) => {
    mutate(changes, {
      onError: () => showError('Could not save your dashboard preferences. Please try again.'),
    });
  };

  return {
    widgets,
    quickActions,
    primaryWorkflowId: query.data?.primaryWorkflowId ?? null,
    /** False only while the first load is in flight; if it fails the dashboard falls back to the defaults. */
    isReady: !query.isPending,
    update,
  };
}

/**
 * Preferences used to live in localStorage. Moves them to the server the first
 * time this browser loads the dashboard, unless the user has already saved
 * choices from elsewhere, which win. Failures are silent and retried next load.
 */
export function useMigrateLegacyPreferences() {
  const queryClient = useQueryClient();
  const query = useQuery(queries.dashboardPreferences());
  const { mutate } = useSavePreferences();
  const started = useRef(false);

  useEffect(() => {
    if (!query.isSuccess || started.current) return;
    started.current = true;

    const legacy = readLegacyPreferences();
    if (!legacy) return;

    if (!hasNoSavedChoices(query.data)) {
      clearLegacyPreferences();
      return;
    }

    // localStorage isn't per-account, so the old primary may be a workflow this company doesn't have
    void queryClient
      .fetchQuery(queries.workflows())
      .catch(() => [])
      .then((workflows) => {
        const primaryExists = workflows.some((workflow) => workflow.id === legacy.primaryWorkflowId);
        mutate(
          { ...legacy, primaryWorkflowId: primaryExists ? legacy.primaryWorkflowId : undefined },
          { onSuccess: () => clearLegacyPreferences() }
        );
      });
  }, [query.isSuccess, query.data, queryClient, mutate]);
}
