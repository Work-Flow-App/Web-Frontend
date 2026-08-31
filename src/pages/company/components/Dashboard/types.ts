export type WidgetId =
  | 'map'
  | 'workflow_activity'
  | 'activity'
  | 'announcements'
  | 'donut'
  | 'due_jobs';

export interface WidgetConfig {
  id: WidgetId;
  label: string;
  visible: boolean;
  order: number;
}

export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  changeText: string;
  isPositive: boolean;
  iconType: 'bell' | 'target' | 'check' | 'alert' | 'briefcase';
}

export interface TaskData {
  id: number;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Completed';
  dueDate: string;
}

export interface ActivityLog {
  id: number;
  jobRef: string;
  action: string;
  user: string;
  timeAgo: string;
  type: 'status_change' | 'comment' | 'creation' | 'update';
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface JobStatusData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: any;
}

export interface QuickActionItem {
  label: string;
  subLabel: string;
  iconType: 'task' | 'job' | 'client' | 'report' | 'message';
}

export type QuickActionId =
  | 'new_job'
  | 'add_worker'
  | 'add_client'
  | 'add_asset'
  | 'add_customer'
  | 'create_form'
  | 'create_submission'
  | 'new_workflow'
  | 'create_template';

export interface QuickActionConfig {
  id: QuickActionId;
  label: string;
  visible: boolean;
}
