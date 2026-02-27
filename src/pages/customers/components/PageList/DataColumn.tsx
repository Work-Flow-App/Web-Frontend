import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { MemberInfo, MemberName, MemberEmail } from '../../../../components/UI/Table/Table.styles';

export interface CustomerTableRow {
  id: number;
  name: string;
  email: string;
  telephone: string;
  mobile: string;
  address: string;
  addedOn: string;
}

export const columns: ITableColumn<CustomerTableRow>[] = [
  {
    id: 'addedOn',
    label: 'Added on',
    accessor: 'addedOn',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'name',
    label: 'Customer',
    accessor: 'name',
    sortable: true,
    width: 'auto',
    render: (row) => (
      <MemberInfo>
        <MemberName>{row.name}</MemberName>
        <MemberEmail>{row.email}</MemberEmail>
      </MemberInfo>
    ),
  },
  {
    id: 'telephone',
    label: 'Telephone',
    accessor: 'telephone',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    accessor: 'mobile',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'address',
    label: 'Address',
    accessor: 'address',
    sortable: true,
    width: 'auto',
  },
];
