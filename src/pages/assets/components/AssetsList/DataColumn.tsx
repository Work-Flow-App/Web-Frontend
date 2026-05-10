import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { StatusBadge } from './StatusBadge';

export interface AssetTableRow {
  id: number;
  assetRef?: number;
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
 * Generate asset columns for the table
 */
export const generateAssetColumns = (fmt: (val?: number | null) => string): ITableColumn<AssetTableRow>[] => [
  {
    id: 'id',
    label: 'Asset ID',
    accessor: 'assetRef',
    sortable: true,
    width: 'auto',
    render: (row) => row.assetRef ?? row.id,
  },
  {
    id: 'name',
    label: 'Asset Name',
    accessor: 'name',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'purchasePrice',
    label: 'Purchase Price',
    accessor: 'purchasePrice',
    sortable: true,
    width: 'auto',
    render: (row) => (row.purchasePrice != null ? fmt(row.purchasePrice) : '-'),
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
    id: 'currentLocation',
    label: 'Location',
    accessor: 'currentLocation',
    sortable: true,
    width: 'auto',
    render: (row) => row.currentLocation || '-',
  },
  {
    id: 'status',
    label: 'Status',
    accessor: 'status',
    sortable: true,
    width: 'auto',
    render: (row) => <StatusBadge status={row.status} />,
  },
];
