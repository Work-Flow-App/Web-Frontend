import React from 'react';
import { Box, Button, CircularProgress, Paper, Switch, Typography, styled } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../../services/api';
import type { NotificationPreferencesUpdateRequest } from '../../../services/api';
import { queries } from '../../../services/queries';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import {
  applyUpdate,
  toPreferenceSections,
  toUpdateRequest,
  type PreferenceChannel,
  type PreferenceRow,
} from './notificationPreferenceRows';

const PREFERENCES_KEY = queries.notificationPreferences().queryKey;
const SAVE_KEY = ['notifications', 'preferences', 'save'];

const CHANNELS: { channel: PreferenceChannel; label: string }[] = [
  { channel: 'inAppEnabled', label: 'In-app' },
  { channel: 'pushEnabled', label: 'Push (mobile app)' },
];

const Root = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const Section = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const GridRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr repeat(2, minmax(84px, 120px))',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2.5),
  '& + &': { borderTop: `1px solid ${theme.palette.divider}` },
  '& > :not(:first-of-type)': { justifySelf: 'center', textAlign: 'center' },
}));

const HeaderRow = styled(GridRow)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  backgroundColor: theme.palette.action.hover,
}));

function useSavePreferences() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationKey: SAVE_KEY,
    // Saves must reach the server in order, or an older response could undo a newer toggle
    scope: { id: 'notification-preferences' },
    mutationFn: async (request: NotificationPreferencesUpdateRequest) =>
      (await notificationService.updatePreferences(request)).data,
    onMutate: async (request) => {
      await queryClient.cancelQueries({ queryKey: PREFERENCES_KEY });
      const previous = queryClient.getQueryData(PREFERENCES_KEY);
      queryClient.setQueryData(PREFERENCES_KEY, (current) => applyUpdate(current ?? [], request));
      return { previous };
    },
    onError: (error, _request, context) => {
      queryClient.setQueryData(PREFERENCES_KEY, context?.previous);
      showError(extractErrorMessage(error, 'Could not save your notification settings. Please try again.'));
    },
    onSettled: (saved, error) => {
      // A response from a save with more queued behind it would undo their optimistic state
      if (queryClient.isMutating({ mutationKey: SAVE_KEY }) > 1) return;
      if (error) {
        void queryClient.invalidateQueries({ queryKey: PREFERENCES_KEY });
      } else {
        queryClient.setQueryData(PREFERENCES_KEY, saved);
        showSuccess('Notification settings saved.');
      }
    },
  });
}

/** Which notifications the signed-in user gets, per channel. Used by company users and workers. */
export const NotificationSettings: React.FC = () => {
  const { data, isPending, isError, refetch } = useQuery(queries.notificationPreferences());
  const { mutate } = useSavePreferences();

  const toggle = (row: PreferenceRow, channel: PreferenceChannel, enabled: boolean) =>
    mutate(toUpdateRequest(row, channel, enabled));

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Could not load your notification settings.
        </Typography>
        <Button variant="outlined" size="small" onClick={() => refetch()}>
          Try again
        </Button>
      </Box>
    );
  }

  const sections = toPreferenceSections(data);

  return (
    <Root>
      <Box>
        <Typography variant="h5" fontWeight={700} letterSpacing="-0.3px">
          Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Choose what you're notified about. In-app notifications appear under the bell; push notifications go to the
          Workfloow mobile app. Changes save straight away.
        </Typography>
      </Box>

      {sections.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          There are no notification settings to change.
        </Typography>
      )}

      {sections.map((section) => (
        <Section key={section.title} elevation={0}>
          <HeaderRow>
            <Typography variant="subtitle2" fontWeight={700}>
              {section.title}
            </Typography>
            {CHANNELS.map(({ channel, label }) => (
              <Typography key={channel} variant="caption" color="text.secondary" fontWeight={600}>
                {label}
              </Typography>
            ))}
          </HeaderRow>

          {section.rows.map((row) => (
            <GridRow key={row.label}>
              <Typography variant="body2">{row.label}</Typography>
              {CHANNELS.map(({ channel, label }) => (
                <Switch
                  key={channel}
                  size="small"
                  checked={row[channel]}
                  onChange={(_, checked) => toggle(row, channel, checked)}
                  slotProps={{ input: { 'aria-label': `${row.label}: ${label}` } }}
                />
              ))}
            </GridRow>
          ))}
        </Section>
      ))}
    </Root>
  );
};
