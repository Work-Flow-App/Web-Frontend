import { LeaveType } from '../../../services/api';

// Reuses the theme's categorical chart palette so leave types stay visually distinct
// without inventing new design tokens.
export type LeaveColorKey = 'chart_tertiary' | 'chart_secondary' | 'chart_quaternary' | 'chart_primary';

export const LEAVE_TYPE_COLOR_KEY: Record<LeaveType, LeaveColorKey> = {
  [LeaveType.Annual]: 'chart_tertiary',
  [LeaveType.Sick]: 'chart_secondary',
  [LeaveType.Unpaid]: 'chart_quaternary',
  [LeaveType.Other]: 'chart_primary',
};
