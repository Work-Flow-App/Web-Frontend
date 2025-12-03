import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface FieldTableRow {
  id: number;
  templateId?: number;
  name: string;
  label: string;
  jobFieldType: string;
  required: boolean;
  options?: string;
  orderIndex?: number;
}

export const fieldColumns: ITableColumn<FieldTableRow>[] = [
  {
    id: 'label',
    label: 'Field Label',
    accessor: 'label',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'name',
    label: 'Field Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'jobFieldType',
    label: 'Type',
    accessor: 'jobFieldType',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'required',
    label: 'Required',
    sortable: true,
    width: 'auto',
    render: (row) => (row.required ? 'Yes' : 'No'),
  },
  {
    id: 'options',
    label: 'Options',
    accessor: 'options',
    sortable: false,
    width: 'auto',
    render: (row) => row.options || '-',
  },
  {
    id: 'orderIndex',
    label: 'Order',
    accessor: 'orderIndex',
    sortable: true,
    width: 'auto',
    render: (row) => row.orderIndex?.toString() || '-',
  },
];
