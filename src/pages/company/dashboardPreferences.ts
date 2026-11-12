import type {
  DashboardPreferencesResponse,
  DashboardPreferencesUpdateRequest,
  QuickActionPreference,
  WidgetPreference,
} from '../../services/api';
import type { QuickActionConfig, WidgetConfig } from './components/Dashboard/types';

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'workflow_events', label: 'Workfloow Event', visible: true, order: 0 },
  { id: 'map', label: 'Live Job Locations', visible: true, order: 1 },
  { id: 'workflow_activity', label: 'Recent Workflow Activity', visible: true, order: 2 },
  { id: 'activity', label: 'Recent Activity', visible: true, order: 3 },
  { id: 'announcements', label: 'Company Announcements', visible: true, order: 4 },
  { id: 'donut', label: 'Job Status Overview', visible: true, order: 5 },
  // The id predates the widget's rename; it stays so saved preferences still apply
  { id: 'due_jobs', label: 'In-Progress Jobs', visible: true, order: 6 },
];

export const DEFAULT_QUICK_ACTIONS: QuickActionConfig[] = [
  { id: 'new_job', label: 'New Job', visible: true },
  { id: 'add_worker', label: 'Add Worker', visible: true },
  { id: 'add_client', label: 'Add Client', visible: true },
  { id: 'add_asset', label: 'Add Asset', visible: true },
  { id: 'add_customer', label: 'Add Customer', visible: true },
  { id: 'create_form', label: 'Create Form', visible: true },
  { id: 'create_submission', label: 'Create Submission', visible: true },
  { id: 'new_workflow', label: 'New Workflow', visible: true },
  { id: 'create_template', label: 'Create Job Template', visible: true },
];

/**
 * The frontend decides which widgets exist and what they are called; the server
 * only stores the user's choices. Unknown ids are dropped, and anything added
 * since the user last saved appears with its default.
 */
export function mergeWidgets(saved?: WidgetPreference[]): WidgetConfig[] {
  return DEFAULT_WIDGETS.map((widget) => {
    const match = saved?.find((item) => item.id === widget.id);
    return { ...widget, visible: match?.visible ?? widget.visible, order: match?.order ?? widget.order };
  }).sort((a, b) => a.order - b.order);
}

export function mergeQuickActions(saved?: QuickActionPreference[]): QuickActionConfig[] {
  return DEFAULT_QUICK_ACTIONS.map((action) => {
    const match = saved?.find((item) => item.id === action.id);
    return { ...action, visible: match?.visible ?? action.visible };
  });
}

// ─── One-time move of preferences that used to live in this browser ───────────

const LEGACY_WIDGETS_KEY = 'workfloow_dashboard_widgets_config';
const LEGACY_QUICK_ACTIONS_KEY = 'workfloow_dashboard_quick_actions_config';
const LEGACY_PRIMARY_WORKFLOW_KEY = 'workfloow_primary_workflow_id';

function parseList<T>(raw: string | null): T[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function readLegacyPreferences(
  storage: Pick<Storage, 'getItem'> = localStorage
): DashboardPreferencesUpdateRequest | null {
  const widgets = parseList<WidgetPreference>(storage.getItem(LEGACY_WIDGETS_KEY));
  const quickActions = parseList<QuickActionPreference>(storage.getItem(LEGACY_QUICK_ACTIONS_KEY));
  const primaryWorkflowId = Number(storage.getItem(LEGACY_PRIMARY_WORKFLOW_KEY)) || undefined;

  if (!widgets && !quickActions && !primaryWorkflowId) return null;
  return { primaryWorkflowId, widgets: mergeWidgets(widgets), quickActions: mergeQuickActions(quickActions) };
}

export function clearLegacyPreferences(storage: Pick<Storage, 'removeItem'> = localStorage): void {
  storage.removeItem(LEGACY_WIDGETS_KEY);
  storage.removeItem(LEGACY_QUICK_ACTIONS_KEY);
  storage.removeItem(LEGACY_PRIMARY_WORKFLOW_KEY);
}

/** Until the user first saves, the server reports no primary workflow and empty lists. */
export function hasNoSavedChoices(preferences?: DashboardPreferencesResponse): boolean {
  return (
    preferences?.primaryWorkflowId == null && !preferences?.widgets?.length && !preferences?.quickActions?.length
  );
}
