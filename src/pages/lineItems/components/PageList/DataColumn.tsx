import type { ITableColumn } from '../../../../components/UI/Table/ITable';

export interface LineItemTableRow {
  id: number;
  productCode: string;
  productDescription: string;
  additionalDetails: string;
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
