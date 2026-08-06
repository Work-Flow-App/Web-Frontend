import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { Badge } from '../../../../components/UI/Badge';
import type { BadgeVariant } from '../../../../components/UI/Badge/Badge.types';
import type { FormSubmissionResponse } from '../../../../services/api';

export interface FormSubmissionTableRow {
  id: number;
  title: string;
  templateName: string;
  workerName: string;
  status: string;
}

export const mapSubmissionToRow = (s: FormSubmissionResponse): FormSubmissionTableRow => ({
  id: s.id ?? 0,
  title: s.title || s.templateName || 'Untitled Submission',
  templateName: s.templateName || '-',
  workerName: s.workerName || 'Unassigned',
  status: s.status || 'DRAFT',
});

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  DRAFT: 'default',
  SENT: 'warning',
  PENDING: 'warning',
  IN_PROGRESS: 'warning',
  SUBMITTED: 'success',
  COMPLETED: 'success',
};

const formatStatus = (status: string): string =>
  status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const formSubmissionColumns: ITableColumn<FormSubmissionTableRow>[] = [
  {
    id: 'title',
    label: 'Title',
    accessor: 'title',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'templateName',
    label: 'Template',
    accessor: 'templateName',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'workerName',
    label: 'Worker',
    accessor: 'workerName',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'status',
    label: 'Status',
    width: '140',
    render: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'default'} size="small">
        {formatStatus(row.status)}
      </Badge>
    ),
  },
];
