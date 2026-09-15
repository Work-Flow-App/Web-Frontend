import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface AssetGroupTableRow {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export const columns: ITableColumn<AssetGroupTableRow>[] = [
  {
    id: 'name',
    label: 'Group Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'description',
    label: 'Description',
    accessor: 'description',
    width: 'auto',
    render: (row) => row.description || '-',
  },
  {
    id: 'createdAt',
    label: 'Added on',
    accessor: 'createdAt',
    sortable: true,
    width: 'auto',
  },
];
