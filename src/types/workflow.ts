import type {
  WorkflowStepResponse,
  JobWorkflowStepResponse,
} from '../services/api';

/**
 * Workflow table row for data table display
 */
export interface WorkflowTableRow {
  id: number;
  name: string;
  description?: string;
  companyId?: number;
  stepCount?: number;
  createdAt?: string;
}

/**
 * Workflow step for drag-and-drop builder
 */
export interface WorkflowStepItem extends WorkflowStepResponse {
  id: number;
  workflowId: number;
  name: string;
  description?: string;
  orderIndex: number;
  optional?: boolean;
}

/**
 * Job Workflow table row for data table display
 */
export interface JobWorkflowTableRow {
  id: number;
  jobId: number;
  jobName?: string;
  workflowName?: string;
  status: string;
  currentStep?: string;
  completionPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Job Workflow step with extended info for display
 */
export interface JobWorkflowStepItem extends JobWorkflowStepResponse {
  id: number;
  name: string;
  description?: string;
  orderIndex: number;
  startedAt?: string;
  completedAt?: string;
  assignedWorkerIds?: Set<number>;
  assignedWorkerNames?: string[];
}

/**
 * Standard Workflow Step Status
 * Following industry-standard workflow management patterns
 */
export const WorkflowStepStatus = {
  // Backend statuses (matching API)
  INITIATED: 'INITIATED',
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
} as const;

/**
 * User-friendly status labels and their mapping
 * Standard workflow progression: To Do → In Progress → Done
 */
export const WORKFLOW_STATUS_DISPLAY = {
  // To Do states (not yet started)
  NOT_STARTED: { label: 'To Do', color: 'default' as const, order: 1 },
  INITIATED: { label: 'Ready', color: 'default' as const, order: 2 },
  PENDING: { label: 'Pending', color: 'warning' as const, order: 3 },

  // In Progress states (actively working)
  STARTED: { label: 'In Progress', color: 'info' as const, order: 4 },
  ONGOING: { label: 'In Progress', color: 'info' as const, order: 5 },

  // Done states (finished)
  COMPLETED: { label: 'Done', color: 'success' as const, order: 6 },
  SKIPPED: { label: 'Skipped', color: 'error' as const, order: 7 },
};

/**
 * Workflow status options for dropdowns
 * Organized by workflow phase
 */
export const WORKFLOW_STATUS_OPTIONS = [
  { label: 'To Do', value: WorkflowStepStatus.NOT_STARTED, group: 'Not Started' },
  { label: 'Ready', value: WorkflowStepStatus.INITIATED, group: 'Not Started' },
  { label: 'Pending', value: WorkflowStepStatus.PENDING, group: 'Waiting' },
  { label: 'In Progress', value: WorkflowStepStatus.STARTED, group: 'Active' },
  { label: 'Done', value: WorkflowStepStatus.COMPLETED, group: 'Completed' },
  { label: 'Skipped', value: WorkflowStepStatus.SKIPPED, group: 'Completed' },
];

/**
 * Get status color for badge display
 * Maps backend status to UI color scheme
 */
export function getWorkflowStatusColor(status: string): 'success' | 'error' | 'warning' | 'info' | 'default' {
  const displayInfo = WORKFLOW_STATUS_DISPLAY[status as keyof typeof WORKFLOW_STATUS_DISPLAY];
  return displayInfo?.color || 'default';
}

/**
 * Get user-friendly status label
 */
export function getWorkflowStatusLabel(status: string): string {
  const displayInfo = WORKFLOW_STATUS_DISPLAY[status as keyof typeof WORKFLOW_STATUS_DISPLAY];
  return displayInfo?.label || status;
}

/**
 * Calculate workflow completion percentage
 */
export function calculateWorkflowProgress(steps: JobWorkflowStepResponse[]): number {
  if (!steps || steps.length === 0) return 0;

  const completedSteps = steps.filter(
    step => step.status === WorkflowStepStatus.COMPLETED
  ).length;

  return Math.round((completedSteps / steps.length) * 100);
}

/**
 * Get current step name from workflow
 */
export function getCurrentStepName(steps: JobWorkflowStepResponse[]): string | undefined {
  const currentStep = steps.find(
    step => step.status === WorkflowStepStatus.STARTED || step.status === WorkflowStepStatus.ONGOING
  );
  return currentStep?.name;
}
