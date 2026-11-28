import type {
  NotificationPreferenceResponse,
  NotificationPreferencesUpdateRequest,
} from '../../../services/api';

/** The channels a user can switch. Email isn't sent yet, so it isn't offered. */
export type PreferenceChannel = 'inAppEnabled' | 'pushEnabled';

type NotificationType = NonNullable<NotificationPreferenceResponse['notificationType']>;

interface RowConfig {
  label: string;
  /** Saved together, e.g. a comment being added and being edited. */
  types: NotificationType[];
}

interface SectionConfig {
  title: string;
  rows: RowConfig[];
}

/**
 * Every notification type a user can turn off. FORCE_LOGOUT is left out: it's a security
 * signal the backend always sends, whatever the setting says.
 */
export const PREFERENCE_SECTIONS: SectionConfig[] = [
  {
    title: 'Jobs & Workflow',
    rows: [
      { label: 'Assigned to a step', types: ['WORKER_ASSIGNED'] },
      { label: 'Removed from a step', types: ['WORKER_UNASSIGNED'] },
      { label: 'Step status changed', types: ['STEP_STATUS_CHANGED'] },
      { label: 'Step completed', types: ['STEP_COMPLETED'] },
      { label: 'Comments on a step', types: ['STEP_COMMENT_ADDED', 'STEP_COMMENT_UPDATED'] },
      { label: 'Files added to a step', types: ['STEP_ATTACHMENT_ADDED', 'STEP_ATTACHMENT_UPDATED'] },
      { label: 'Site visit logged', types: ['VISIT_LOG_ADDED'] },
      { label: 'Step overdue', types: ['STEP_SLA_BREACHED'] },
    ],
  },
  {
    title: 'Mentions',
    rows: [
      { label: 'Someone @mentioned you', types: ['USER_MENTIONED'] },
      { label: 'Your @mention was delivered', types: ['MENTION_SENT'] },
    ],
  },
  {
    title: 'Forms',
    rows: [
      { label: 'Form assigned to you', types: ['FORM_ASSIGNED'] },
      { label: 'Form taken off you', types: ['FORM_UNASSIGNED'] },
      { label: 'Form submitted', types: ['FORM_SUBMITTED'] },
    ],
  },
  {
    title: 'Assets',
    rows: [
      { label: 'Asset assigned to you', types: ['ASSET_ASSIGNED'] },
      { label: 'Asset assignment changed', types: ['ASSET_ASSIGNMENT_UPDATED'] },
      { label: 'Asset returned', types: ['ASSET_RETURNED'] },
      { label: 'Asset location updated', types: ['ASSET_LOCATION_UPDATED'] },
      { label: 'Asset overdue', types: ['ASSET_SLA_BREACHED'] },
    ],
  },
];

export const HIDDEN_TYPES: NotificationType[] = ['FORCE_LOGOUT'];

export interface PreferenceRow {
  label: string;
  types: NotificationType[];
  /** On only when it's on for every type in the row. */
  inAppEnabled: boolean;
  pushEnabled: boolean;
}

export interface PreferenceSection {
  title: string;
  rows: PreferenceRow[];
}

/**
 * The rows to show for what the backend returned. A row whose types the backend doesn't
 * send (an older backend) is left out, and so is a section with no rows left.
 */
export function toPreferenceSections(preferences: NotificationPreferenceResponse[]): PreferenceSection[] {
  const byType = new Map(preferences.map((preference) => [preference.notificationType, preference]));

  return PREFERENCE_SECTIONS.map((section) => ({
    title: section.title,
    rows: section.rows.flatMap((row) => {
      const entries = row.types.map((type) => byType.get(type)).filter((entry) => entry != null);
      if (entries.length === 0) return [];
      return {
        label: row.label,
        types: entries.map((entry) => entry.notificationType!),
        inAppEnabled: entries.every((entry) => entry.inAppEnabled !== false),
        pushEnabled: entries.every((entry) => entry.pushEnabled !== false),
      };
    }),
  })).filter((section) => section.rows.length > 0);
}

/** Turns one channel on or off for every type in the row; other channels are left as they are. */
export function toUpdateRequest(
  row: Pick<PreferenceRow, 'types'>,
  channel: PreferenceChannel,
  enabled: boolean
): NotificationPreferencesUpdateRequest {
  return { preferences: row.types.map((notificationType) => ({ notificationType, [channel]: enabled })) };
}

/** The list as it will be once the request is saved, for showing the change straight away. */
export function applyUpdate(
  preferences: NotificationPreferenceResponse[],
  request: NotificationPreferencesUpdateRequest
): NotificationPreferenceResponse[] {
  return preferences.map((preference) => {
    const change = request.preferences.find((item) => item.notificationType === preference.notificationType);
    if (!change) return preference;
    // A channel left out of the request stays as it is
    return {
      ...preference,
      ...(change.inAppEnabled != null && { inAppEnabled: change.inAppEnabled }),
      ...(change.pushEnabled != null && { pushEnabled: change.pushEnabled }),
      ...(change.emailEnabled != null && { emailEnabled: change.emailEnabled }),
    };
  });
}
