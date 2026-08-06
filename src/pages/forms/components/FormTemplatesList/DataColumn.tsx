import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { Badge } from '../../../../components/UI/Badge';
import type { FormTemplateRequest } from '../../../../services/api';

export interface FormTemplateTableRow {
  id: number;
  name: string;
  description?: string;
  fieldCount: number;
  archived?: boolean;
  version?: number;
}

export const mapTemplateToRow = (t: FormTemplateRequest): FormTemplateTableRow => ({
  id: t.id ?? 0,
  name: t.name || 'Untitled Template',
  description: t.description,
  fieldCount: t.fields?.length ?? 0,
  archived: t.archived,
  version: t.version,
});

export const formTemplateColumns: ITableColumn<FormTemplateTableRow>[] = [
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
    label: 'Fields',
    accessor: 'fieldCount',
    sortable: true,
    width: '120',
  },
  {
    id: 'status',
    label: 'Status',
    width: '120',
    render: (row) => <Badge variant={row.archived ? 'default' : 'success'} size="small">{row.archived ? 'Archived' : 'Active'}</Badge>,
  },
];
