export const JobStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export const JOB_STATUS_OPTIONS = [
  { label: 'Pending', value: JobStatus.PENDING },
  { label: 'In Progress', value: JobStatus.IN_PROGRESS },
  { label: 'Completed', value: JobStatus.COMPLETED },
  { label: 'Cancelled', value: JobStatus.CANCELLED },
];
