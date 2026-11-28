import { describe, expect, it } from 'vitest';
import { NotificationPreferenceResponseNotificationTypeEnum } from '../../../../workflow-api';
import type { NotificationPreferenceResponse } from '../../../services/api';
import {
  HIDDEN_TYPES,
  PREFERENCE_SECTIONS,
  applyUpdate,
  toPreferenceSections,
  toUpdateRequest,
} from './notificationPreferenceRows';

const ALL_TYPES = Object.values(NotificationPreferenceResponseNotificationTypeEnum);

/** What GET /notifications/preferences returns for a user who never changed anything. */
const defaults = (): NotificationPreferenceResponse[] =>
  ALL_TYPES.map((notificationType) => ({ notificationType, inAppEnabled: true, emailEnabled: true, pushEnabled: true }));

describe('PREFERENCE_SECTIONS', () => {
  it('has a row for every notification type the API knows, apart from the hidden ones', () => {
    // Fails when the backend adds a type, so it gets a label instead of being impossible to turn off
    const shown = PREFERENCE_SECTIONS.flatMap((section) => section.rows.flatMap((row) => row.types));
    const missing = ALL_TYPES.filter((type) => !shown.includes(type) && !HIDDEN_TYPES.includes(type));

    expect(missing).toEqual([]);
    expect(new Set(shown).size).toBe(shown.length);
  });

  it('never offers FORCE_LOGOUT, which the backend always sends', () => {
    const shown = toPreferenceSections(defaults()).flatMap((section) => section.rows.flatMap((row) => row.types));

    expect(shown).not.toContain('FORCE_LOGOUT');
  });
});

describe('toPreferenceSections', () => {
  it('shows a grouped row as on only when every type in it is on', () => {
    const preferences = defaults().map((preference) =>
      preference.notificationType === 'STEP_COMMENT_UPDATED' ? { ...preference, pushEnabled: false } : preference
    );

    const row = toPreferenceSections(preferences)
      .flatMap((section) => section.rows)
      .find((r) => r.label === 'Comments on a step');

    expect(row).toMatchObject({ types: ['STEP_COMMENT_ADDED', 'STEP_COMMENT_UPDATED'], inAppEnabled: true, pushEnabled: false });
  });

  it('leaves out rows and sections for types an older backend does not send', () => {
    const preferences = defaults().filter((preference) => !preference.notificationType?.startsWith('FORM_'));

    const sections = toPreferenceSections(preferences);

    expect(sections.map((section) => section.title)).not.toContain('Forms');
    expect(sections.map((section) => section.title)).toContain('Assets');
  });

  it('shows nothing when the backend sends nothing', () => {
    expect(toPreferenceSections([])).toEqual([]);
  });
});

describe('toUpdateRequest', () => {
  it('switches one channel for every type in the row and leaves the others out', () => {
    expect(toUpdateRequest({ types: ['STEP_ATTACHMENT_ADDED', 'STEP_ATTACHMENT_UPDATED'] }, 'pushEnabled', false)).toEqual({
      preferences: [
        { notificationType: 'STEP_ATTACHMENT_ADDED', pushEnabled: false },
        { notificationType: 'STEP_ATTACHMENT_UPDATED', pushEnabled: false },
      ],
    });
  });
});

describe('applyUpdate', () => {
  it('changes only the channel in the request, for only the types in it', () => {
    const before = defaults();
    const after = applyUpdate(before, toUpdateRequest({ types: ['USER_MENTIONED'] }, 'inAppEnabled', false));

    expect(after.find((p) => p.notificationType === 'USER_MENTIONED')).toEqual({
      notificationType: 'USER_MENTIONED',
      inAppEnabled: false,
      emailEnabled: true,
      pushEnabled: true,
    });
    expect(after.filter((p) => p.notificationType !== 'USER_MENTIONED')).toEqual(
      before.filter((p) => p.notificationType !== 'USER_MENTIONED')
    );
  });
});
