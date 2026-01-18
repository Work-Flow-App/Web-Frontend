import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import type { WorkflowTableRow } from '../../../../types/workflow';

/**
 * Define workflow table columns
 */
export const workflowColumns: ITableColumn<WorkflowTableRow>[] = [
  {
    id: 'id',
    label: 'ID',
    accessor: 'id',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'name',
    label: 'Workflow Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'description',
    label: 'Description',
    accessor: 'description',
    sortable: true,
    width: 'auto',
    render: (row) => row.description || '-',
  },
  {
    id: 'createdAt',
    label: 'Created',
    accessor: 'createdAt',
    sortable: true,
    width: 'auto',
    render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
  },
];
