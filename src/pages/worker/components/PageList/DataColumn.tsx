import type { ITableColumn } from '../../../../components/UI/Table/ITable';
import { AvatarCell, Avatar, MemberInfo, MemberName, MemberEmail } from '../../../../components/UI/Table/Table.styles';
import { getInitials } from '../../../../utils/getInitials';

export interface WorkerTableRow {
  id: number;
  name: string;
  email: string;
  username: string;
  telephone: string;
  mobile: string;
  initials: string;
  photoUrl?: string;
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
    accessor: 'name',
    sortable: true,
    width: 'auto',
    render: (row) => (
      <AvatarCell>
        <Avatar>
          {row.photoUrl ? (
            <img src={row.photoUrl} alt={row.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            getInitials(row.name)
          )}
        </Avatar>
        <MemberInfo>
          <MemberName>{row.name}</MemberName>
          <MemberEmail>{row.email}</MemberEmail>
        </MemberInfo>
      </AvatarCell>
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
    id: 'initials',
    label: 'Initials',
    accessor: 'initials',
    sortable: true,
    width: 'auto',
  },
];
