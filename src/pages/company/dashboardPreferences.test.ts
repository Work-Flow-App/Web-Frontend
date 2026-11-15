import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_QUICK_ACTIONS,
  DEFAULT_WIDGETS,
  clearLegacyPreferences,
  hasNoSavedChoices,
  mergeQuickActions,
  mergeWidgets,
  readLegacyPreferences,
} from './dashboardPreferences';

function storageWith(items: Record<string, string>) {
  return { getItem: (key: string) => items[key] ?? null };
}

describe('mergeWidgets', () => {
  it.each([[undefined], [[]]])('returns the defaults when nothing is saved (%j)', (saved) => {
    expect(mergeWidgets(saved)).toEqual(DEFAULT_WIDGETS);
  });

  it('applies saved visibility and order but keeps the frontend label', () => {
    const merged = mergeWidgets([{ id: 'map', label: 'Old name', visible: false, order: 99 }]);

    expect(merged[merged.length - 1]).toEqual({ id: 'map', label: 'Live Job Locations', visible: false, order: 99 });
  });

  it('drops widgets the frontend no longer has and adds new ones', () => {
    const merged = mergeWidgets([{ id: 'tasks', visible: false, order: 0 }]);

    expect(merged.map((w) => w.id)).toEqual(DEFAULT_WIDGETS.map((w) => w.id));
  });
});

describe('mergeQuickActions', () => {
  it('applies saved visibility to known actions only', () => {
    const merged = mergeQuickActions([
      { id: 'new_job', visible: false },
      { id: 'gone', visible: false },
    ]);

    expect(merged).toHaveLength(DEFAULT_QUICK_ACTIONS.length);
    expect(merged.find((a) => a.id === 'new_job')?.visible).toBe(false);
    expect(merged.find((a) => a.id === 'add_worker')?.visible).toBe(true);
  });
});

describe('readLegacyPreferences', () => {
  it('returns null when this browser has nothing stored', () => {
    expect(readLegacyPreferences(storageWith({}))).toBeNull();
  });

  it('reads all three stored values', () => {
    const legacy = readLegacyPreferences(
      storageWith({
        workfloow_dashboard_widgets_config: JSON.stringify([{ id: 'map', visible: false, order: 1 }]),
        workfloow_dashboard_quick_actions_config: JSON.stringify([{ id: 'new_job', visible: false }]),
        workfloow_primary_workflow_id: '42',
      })
    );

    expect(legacy?.primaryWorkflowId).toBe(42);
    expect(legacy?.widgets?.find((w) => w.id === 'map')?.visible).toBe(false);
    expect(legacy?.quickActions?.find((a) => a.id === 'new_job')?.visible).toBe(false);
  });

  it('ignores corrupt values instead of throwing', () => {
    const legacy = readLegacyPreferences(
      storageWith({ workfloow_dashboard_widgets_config: '{not json', workfloow_primary_workflow_id: 'abc' })
    );

    expect(legacy).toBeNull();
  });
});

describe('clearLegacyPreferences', () => {
  it('removes every legacy key', () => {
    const removeItem = vi.fn();
    clearLegacyPreferences({ removeItem });

    expect(removeItem.mock.calls.flat()).toEqual([
      'workfloow_dashboard_widgets_config',
      'workfloow_dashboard_quick_actions_config',
      'workfloow_primary_workflow_id',
    ]);
  });
});

describe('hasNoSavedChoices', () => {
  it('is true when the server reports empty preferences', () => {
    expect(hasNoSavedChoices({})).toBe(true);
    expect(hasNoSavedChoices({ widgets: [], quickActions: [] })).toBe(true);
    expect(hasNoSavedChoices(undefined)).toBe(true);
  });

  it('is false once anything has been saved, even if everything is visible', () => {
    expect(hasNoSavedChoices({ widgets: DEFAULT_WIDGETS })).toBe(false);
    expect(hasNoSavedChoices({ quickActions: DEFAULT_QUICK_ACTIONS })).toBe(false);
    expect(hasNoSavedChoices({ primaryWorkflowId: 1 })).toBe(false);
  });
});
