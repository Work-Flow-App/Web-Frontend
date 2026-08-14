import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { Badge } from '../../../../components/UI/Badge';

export interface AssetHistoryRow {
  id: number;
  assignmentId: number;
  jobId?: number;
  /** Human-facing job number (shown elsewhere in the app as "Job No", e.g. "#13") —
   * display this, not the raw internal `jobId`, whenever showing a job reference to a user. */
  jobRef?: number;
  assignedWorkerId?: number;
  assignedAt: string;
  returnedAt?: string;
  durationDays?: number;
  expectedDurationDays?: number;
  slaBreached?: boolean;
  status?: string;
  notes?: string;
}

/**
 * Asset history table columns configuration
 */
export const assetHistoryColumns: ITableColumn<AssetHistoryRow>[] = [
  {
    id: 'assignmentId',
    label: 'Assignment ID',
    accessor: 'assignmentId',
    sortable: true,
    width: 120,
  },
  {
    id: 'jobId',
    label: 'Job No',
    accessor: 'jobId',
    sortable: true,
    width: 100,
    // Show the human-facing job number ("#13"), not the raw internal jobId —
    // matches the "Job No" label used everywhere else a job is referenced
    // (e.g. Job Details). Fall back to the raw id only for older records that
    // predate jobRef being populated.
    render: (row) => {
      const num = row.jobRef ?? row.jobId;
      return num ? `#${num}` : '-';
    },
  },
  {
    id: 'assignedWorkerId',
    label: 'Worker ID',
    accessor: 'assignedWorkerId',
    sortable: true,
    width: 120,
    render: (row) => row.assignedWorkerId || '-',
  },
  {
    id: 'assignedAt',
    label: 'Assigned Date',
    accessor: 'assignedAt',
    sortable: true,
    width: 'auto',
    render: (row) => (row.assignedAt ? new Date(row.assignedAt).toLocaleDateString() : '-'),
  },
  {
    id: 'returnedAt',
    label: 'Returned Date',
    accessor: 'returnedAt',
    sortable: true,
    width: 'auto',
    render: (row) => (row.returnedAt ? new Date(row.returnedAt).toLocaleDateString() : 'Still Assigned'),
  },
  {
    id: 'durationDays',
    label: 'Duration (Days)',
    accessor: 'durationDays',
    sortable: true,
    width: 140,
    render: (row) => (row.durationDays !== undefined ? `${row.durationDays} days` : '-'),
  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    sortable: true,
    width: 120,
    render: (row) => row.status || '-',
  },
  {
    id: 'sla',
    label: 'SLA',
    accessor: 'slaBreached',
    sortable: false,
    width: 'auto',
    render: (row) => {
      if (!row.returnedAt && row.slaBreached) {
        return (
          <Badge variant="error" size="small">
            Breached
          </Badge>
        );
      }
      if (row.expectedDurationDays !== undefined && row.expectedDurationDays !== null) {
        return `Expected ${row.expectedDurationDays} ${row.expectedDurationDays === 1 ? 'day' : 'days'}`;
      }
      return '-';
    },
  },
  {
    id: 'notes',
    label: 'Notes',
    accessor: 'notes',
    sortable: false,
    width: 'auto',
    render: (row) => row.notes || '-',
  },
];
