import { Box, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { ITableColumn } from '../../components/UI/Table/ITable';
import { StatusBadge, InvitationLinkText, CopyButton } from './InvitationsPage.styles';
import type { Theme } from '@mui/material/styles';

export interface InvitationTableRow {
  id: number;
  invitationId: number;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
}

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

export const createInvitationColumns = (
  handleCopyInvitationLink: (row: InvitationTableRow) => void,
  theme: Theme
): ITableColumn<InvitationTableRow>[] => [
  {
    id: 'email',
    label: 'Email Address',
    accessor: 'email',
    sortable: true,
  },
  {
    id: 'invitationLink',
    label: 'Invitation Link',
    render: (row) => {
      const invitationLink = `${window.location.origin}/signup/worker?token=${row.token}`;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InvitationLinkText>
            {invitationLink}
          </InvitationLinkText>
          <Tooltip title="Copy invitation link">
            <CopyButton
              size="small"
              onClick={() => handleCopyInvitationLink(row)}
            >
              <ContentCopyIcon fontSize="small" />
            </CopyButton>
          </Tooltip>
        </Box>
      );
    },
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
    label: 'Sent Date',
    sortable: true,
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    id: 'expiresAt',
    label: 'Expires',
    sortable: true,
    render: (row) => new Date(row.expiresAt).toLocaleDateString(),
  },
  {
    id: 'usedAt',
    label: 'Accepted Date',
    sortable: true,
    render: (row) =>
      row.usedAt ? new Date(row.usedAt).toLocaleDateString() : '-',
  },
];
