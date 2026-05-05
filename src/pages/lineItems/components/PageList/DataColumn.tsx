import React from 'react';
import { Chip } from '@mui/material';
import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface LineItemTableRow {
  id: number;
  productCode: string;
  productDescription: string;
  additionalDetails: string;
  coreOrSub: string;
  unitPrice: number;
  quantity: number;
  vatRate: number;
  netAmount: number;
  vatAmount: number;
  totalAmount: number;
  createdAt: string;
}

export const getColumns = (fmt: (val?: number | null) => string): ITableColumn<LineItemTableRow>[] => [
  {
    id: 'productCode',
    label: 'Product Code',
    accessor: 'productCode',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'productDescription',
    label: 'Description',
    accessor: 'productDescription',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'coreOrSub',
    label: 'Type',
    width: 'auto',
    render: (row) => (
      <Chip
        label={row.coreOrSub}
        size="small"
        color={row.coreOrSub === 'CORE' ? 'primary' : 'default'}
        variant="outlined"
      />
    ),
  },
  {
    id: 'unitPrice',
    label: 'Unit Price',
    align: 'right',
    width: 'auto',
    render: (row) => fmt(row.unitPrice),
  },
  {
    id: 'quantity',
    label: 'Qty',
    accessor: 'quantity',
    align: 'right',
    width: 'auto',
  },
  {
    id: 'vatRate',
    label: 'VAT %',
    align: 'right',
    width: 'auto',
    render: (row) => `${row.vatRate}%`,
  },
  {
    id: 'netAmount',
    label: 'Net',
    align: 'right',
    width: 'auto',
    render: (row) => fmt(row.netAmount),
  },
  {
    id: 'vatAmount',
    label: 'VAT',
    align: 'right',
    width: 'auto',
    render: (row) => fmt(row.vatAmount),
  },
  {
    id: 'totalAmount',
    label: 'Total',
    align: 'right',
    width: 'auto',
    render: (row) => fmt(row.totalAmount),
  },
];
