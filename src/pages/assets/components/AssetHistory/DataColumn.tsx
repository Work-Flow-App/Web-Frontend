import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface AssetHistoryRow {
  id: number;
  assignmentId: number;
  jobId?: number;
  assignedWorkerId?: number;
  assignedAt: string;
  returnedAt?: string;
  durationDays?: number;
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
    label: 'Job ID',
    accessor: 'jobId',
    sortable: true,
    width: 100,
    render: (row) => row.jobId || '-',
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
    id: 'notes',
    label: 'Notes',
    accessor: 'notes',
    sortable: false,
    width: 'auto',
    render: (row) => row.notes || '-',
  },
];
