import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { StatusBadge } from './StatusBadge';

export interface AssetTableRow {
  id: number;
  name: string;
  assetTag?: string;
  serialNumber?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  currentValue?: number;
  status: 'available' | 'in-use' | 'archived';
  currentLocation?: string;
  available: boolean;
  archived: boolean;
  createdAt?: string;
}

/**
 * Asset table columns configuration
 */
export const assetColumns: ITableColumn<AssetTableRow>[] = [
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
  // {
  //   id: 'currentValue',
  //   label: 'Current Value',
  //   accessor: 'currentValue',
  //   sortable: true,
  //   width: 'auto',
  //   render: (row) => (row.currentValue !== undefined ? `$${row.currentValue.toFixed(2)}` : '-'),
  // },
  {
    id: 'currentLocation',
    label: 'Location',
    accessor: 'currentLocation',
    sortable: true,
    width: 'auto',
    render: (row) => row.currentLocation || '-',
  },
  // {
  //   id: 'createdAt',
  //   label: 'Created',
  //   accessor: 'createdAt',
  //   sortable: true,
  //   width: 'auto',
  //   render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'),
  // },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    sortable: true,
    width: 'auto',
    render: (row) => <StatusBadge status={row.status} />,
  },
];
