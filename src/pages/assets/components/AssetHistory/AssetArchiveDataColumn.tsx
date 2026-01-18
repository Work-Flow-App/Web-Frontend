import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface AssetArchiveRow {
  id: number;
  name: string;
  assetTag?: string;
  serialNumber?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  archivedAt?: string;
}

/**
 * Asset archive table columns configuration
 */
export const assetArchiveColumns: ITableColumn<AssetArchiveRow>[] = [
  {
    id: 'id',
    label: 'Asset ID',
    accessor: 'id',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'name',
    label: 'Asset Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'assetTag',
    label: 'Asset Tag',
    accessor: 'assetTag',
    sortable: true,
    width: 'auto',
    render: (row) => row.assetTag || '-',
  },
  {
    id: 'serialNumber',
    label: 'Serial Number',
    accessor: 'serialNumber',
    sortable: true,
    width: 'auto',
    render: (row) => row.serialNumber || '-',
  },
  {
    id: 'purchasePrice',
    label: 'Purchase Price',
    accessor: 'purchasePrice',
    sortable: true,
    width: 'auto',
    render: (row) => (row.purchasePrice ? `$${row.purchasePrice.toFixed(2)}` : '-'),
  },
  {
    id: 'purchaseDate',
    label: 'Purchase Date',
    accessor: 'purchaseDate',
    sortable: true,
    width: 'auto',
    render: (row) => (row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : '-'),
  },
  {
    id: 'archivedAt',
    label: 'Archived Date',
    accessor: 'archivedAt',
    sortable: true,
    width: 'auto',
    render: (row) => (row.archivedAt ? new Date(row.archivedAt).toLocaleDateString() : '-'),
  },
];
