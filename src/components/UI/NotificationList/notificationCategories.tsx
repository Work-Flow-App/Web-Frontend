import type { ReactNode } from 'react';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { floowColors } from '../../../theme/colors';

export interface NotificationCategoryMeta {
  /** Stable key used for filter-chip grouping, e.g. 'jobs', 'crm', 'general'. */
  id: string;
  label: string;
  color: string;
  bg: string;
  icon: ReactNode;
}

/**
 * Floow is a combined CRM + ERP platform, so notification `type` values arrive
 * from many different domains (jobs, workforce, billing, ...). The backend enum
 * of known types is intentionally small and will keep growing, so instead of a
 * strict 1:1 map we bucket by keyword — any new `type` that mentions e.g. "JOB"
 * or "INVOICE" slots into the right group automatically, with no frontend
 * change required. Anything that matches nothing falls back to "General".
 */
const CATEGORY_RULES: Array<{
  id: string;
  label: string;
  color: string;
  bg: string;
  icon: ReactNode;
  match: RegExp;
}> = [
  {
    id: 'jobs',
    label: 'Jobs & Workflow',
    color: floowColors.blue.main,
    bg: floowColors.blue[50],
    icon: <WorkOutlineOutlinedIcon fontSize="small" />,
    match: /JOB|VISIT|WORKFLOW|TASK|STEP|SCHEDULE/,
  },
  {
    id: 'workforce',
    label: 'Workforce',
    color: floowColors.indigo.main,
    bg: 'rgba(99, 102, 241, 0.12)',
    icon: <PeopleOutlineOutlinedIcon fontSize="small" />,
    match: /WORKER|INVITATION|COMPLIANCE|LEAVE|STAFF|EMPLOYEE/,
  },
  {
    id: 'crm',
    label: 'Clients & CRM',
    color: floowColors.success.main,
    bg: floowColors.success.light,
    icon: <BusinessCenterOutlinedIcon fontSize="small" />,
    match: /CLIENT|CUSTOMER|LEAD|DEAL|CONTACT/,
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    color: floowColors.warning.main,
    bg: floowColors.warning.light,
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    match: /INVOICE|PAYMENT|BILLING|SUBSCRIPTION|TRIAL/,
  },
  {
    id: 'assets',
    label: 'Assets',
    color: '#0D9488',
    bg: 'rgba(13, 148, 136, 0.12)',
    icon: <BuildOutlinedIcon fontSize="small" />,
    match: /ASSET|MAINTENANCE|EQUIPMENT/,
  },
  {
    id: 'documents',
    label: 'Documents & Forms',
    color: floowColors.chart.quinary,
    bg: 'rgba(156, 39, 176, 0.12)',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    match: /FORM|DOCUMENT|TEMPLATE|REPORT/,
  },
  {
    id: 'security',
    label: 'Account & Security',
    color: floowColors.error.main,
    bg: floowColors.error.light,
    icon: <LockOutlinedIcon fontSize="small" />,
    match: /LOGOUT|LOGIN|SECURITY|PASSWORD|SESSION/,
  },
];

const GENERAL_CATEGORY: NotificationCategoryMeta = {
  id: 'general',
  label: 'General',
  color: floowColors.grey[500],
  bg: floowColors.grey[100],
  icon: <NotificationsNoneOutlinedIcon fontSize="small" />,
};

/** "VISIT_LOG_ADDED" -> "Visit log added" — used only as a display label for unmapped types. */
function humanize(type: string): string {
  const words = type.toLowerCase().split('_').filter(Boolean);
  if (words.length === 0) return GENERAL_CATEGORY.label;
  return `${words[0][0].toUpperCase()}${words[0].slice(1)}${words.length > 1 ? ' ' + words.slice(1).join(' ') : ''}`;
}

/** Resolves a notification `type` string to display metadata + a filter-chip group id. */
export function getNotificationCategory(type?: string): NotificationCategoryMeta {
  if (!type) return GENERAL_CATEGORY;
  const rule = CATEGORY_RULES.find((r) => r.match.test(type));
  if (rule) return { id: rule.id, label: rule.label, color: rule.color, bg: rule.bg, icon: rule.icon };
  return { ...GENERAL_CATEGORY, label: humanize(type) };
}
