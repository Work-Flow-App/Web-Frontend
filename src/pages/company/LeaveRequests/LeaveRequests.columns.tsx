import type { ITableColumn } from '../../../components/UI/Table/ITable';
import { Badge } from '../../../components/UI/Badge';
import type { BadgeVariant } from '../../../components/UI/Badge/Badge.types';
import { LEAVE_TYPE_OPTIONS } from '../../../services/api';
import type { LeaveRequestResponse } from '../../../services/api';

export interface LeaveRequestTableRow {
  id: number;
  workerName: string;
  type: LeaveRequestResponse['type'];
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestResponse['status'];
  raw: LeaveRequestResponse;
}

const LEAVE_STATUS_VARIANT: Record<LeaveRequestResponse['status'], BadgeVariant> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

const typeLabel = (value: LeaveRequestResponse['type']) =>
  LEAVE_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value;

export const createLeaveRequestColumns = (): ITableColumn<LeaveRequestTableRow>[] => [
  {
    id: 'workerName',
    label: 'Worker',
    accessor: 'workerName',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'type',
    label: 'Type',
    width: 'auto',
    render: (row) => typeLabel(row.type),
  },
  {
    id: 'startDate',
    label: 'Start Date',
    accessor: 'startDate',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'endDate',
    label: 'End Date',
    accessor: 'endDate',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'reason',
    label: 'Reason',
    accessor: 'reason',
    width: 'auto',
  },
  {
    id: 'status',
    label: 'Status',
    width: 'auto',
    render: (row) => (
      <Badge variant={LEAVE_STATUS_VARIANT[row.status] ?? 'default'} size="small">
        {row.status}
      </Badge>
    ),
  },
];

export const mapLeaveRequestToRow = (req: LeaveRequestResponse): LeaveRequestTableRow => ({
  id: req.id,
  workerName: req.workerName || `Worker #${req.workerId}`,
  type: req.type,
  startDate: req.startDate,
  endDate: req.endDate,
  reason: req.reason || '-',
  status: req.status,
  raw: req,
});
