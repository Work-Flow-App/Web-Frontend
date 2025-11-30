import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { StatusPill, MemberInfo, MemberName, MemberEmail } from '../../../../components/UI/Table/Table.styles';

export interface WorkerTableRow {
  id: number;
  name: string;
  email: string;
  username: string;
  telephone: string;
  mobile: string;
  role: string;
  jobAssignments: number;
  status: 'active' | 'deactivated' | 'pending';
  addedOn: string;
}

export const columns: ITableColumn<WorkerTableRow>[] = [
  {
    id: 'addedOn',
    label: 'Added on',
    accessor: 'addedOn',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'name',
    label: 'Member',
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
    id: 'jobAssignments',
    label: 'Job Assignments',
    accessor: 'jobAssignments',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    width: 'auto',
    render: (row) => <StatusPill status={row.status}>{row.status}</StatusPill>,
  },
];
