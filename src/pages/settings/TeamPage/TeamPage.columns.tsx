import type { ITableColumn } from '../../../components/UI/Table/ITable';
import { StatusBadge } from './TeamPage.styles';
import type { Theme } from '@mui/material/styles';
import { MemberInfo, MemberName, MemberEmail } from '../../../components/UI/Table/Table.styles';

export interface MemberTableRow {
  id: number;
  memberId: number;
  userId: number;
  name: string;
  email: string;
  username: string;
  companyRole: string;
  joinedAt: string;
}

export interface InvitationTableRow {
  id: number;
  email: string;
  companyRole: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
}

const ROLE_COLORS: Record<string, string> = {
  COMPANY_ADMIN: '#ef4444',
  MANAGER: '#f59e0b',
  EDITOR: '#3b82f6',
  VIEWER: '#6b7280',
};

const ROLE_LABELS: Record<string, string> = {
  COMPANY_ADMIN: 'Admin',
  MANAGER: 'Manager',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

export const getStatusColor = (status: string, theme: Theme): string => {
  switch (status) {
    case 'PENDING':
      return theme.palette.colors.invitation_pending;
    case 'ACCEPTED':
      return theme.palette.colors.invitation_accepted;
    case 'EXPIRED':
      return theme.palette.colors.invitation_expired;
    default:
      return theme.palette.colors.invitation_expired;
  }
};

export const createMemberColumns = (): ITableColumn<MemberTableRow>[] => [
  {
    id: 'joinedAt',
    label: 'Joined',
    accessor: 'joinedAt',
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
      <MemberInfo>
        <MemberName>{row.name || row.username}</MemberName>
        <MemberEmail>{row.email}</MemberEmail>
      </MemberInfo>
    ),
  },
  {
    id: 'username',
    label: 'Username',
    accessor: 'username',
    sortable: true,
    width: 'auto',
  },
  {
    id: 'companyRole',
    label: 'Role',
    sortable: true,
    width: 'auto',
    render: (row) => (
      <StatusBadge color={ROLE_COLORS[row.companyRole] ?? '#6b7280'}>
        {ROLE_LABELS[row.companyRole] ?? row.companyRole}
      </StatusBadge>
    ),
  },
];

export const createInvitationColumns = (theme: Theme): ITableColumn<InvitationTableRow>[] => [
  {
    id: 'email',
    label: 'Email Address',
    accessor: 'email',
    sortable: true,
  },
  {
    id: 'companyRole',
    label: 'Role',
    sortable: true,
    render: (row) => (
      <StatusBadge color={ROLE_COLORS[row.companyRole] ?? '#6b7280'}>
        {ROLE_LABELS[row.companyRole] ?? row.companyRole}
      </StatusBadge>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => (
      <StatusBadge color={getStatusColor(row.status, theme)}>
        {row.status}
      </StatusBadge>
    ),
  },
  {
    id: 'createdAt',
    label: 'Sent',
    sortable: true,
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    id: 'expiresAt',
    label: 'Expires',
    sortable: true,
    render: (row) => new Date(row.expiresAt).toLocaleDateString(),
  },
];
