import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface TemplateTableRow {
  id: number;
  name: string;
  description?: string;
  fieldCount: number;
  jobCount: number;
  createdAt: string;
}

export const columns: ITableColumn<TemplateTableRow>[] = [
  {
    id: 'name',
    label: 'Template Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'description',
    label: 'Description',
    accessor: 'description',
    sortable: false,
    width: 'auto',
    render: (row) => row.description || '-',
  },
  {
    id: 'fieldCount',
    label: '# of Fields',
    accessor: 'fieldCount',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'jobCount',
    label: '# of Jobs',
    accessor: 'jobCount',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'createdAt',
    label: 'Created',
    accessor: 'createdAt',
    sortable: true,
    width: 'auto',
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];
