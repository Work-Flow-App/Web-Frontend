import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../components/UI/PageWrapper';
import Table from '../../components/UI/Table/Table';
import type { ITableColumn } from '../../components/UI/Table/ITable';
import { workerService, type WorkerInvitationStatus } from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { IconButton, Tooltip, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { StatusBadge, InvitationsContainer } from './InvitationsPage.styles';

interface InvitationTableRow {
  id: number;
  invitationId: number;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return '#FFA726'; // Orange/Yellow
    case 'ACCEPTED':
      return '#66BB6A'; // Green
    case 'EXPIRED':
      return '#9E9E9E'; // Gray
    default:
      return '#9E9E9E';
  }
};

export const InvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | number>('ALL');
  const { showError, showSuccess } = useSnackbar();

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerService.getWorkerInvitations();

      const transformedData: InvitationTableRow[] = response.map(
        (invitation: any) => ({
          id: invitation.invitationId,
          invitationId: invitation.invitationId,
          email: invitation.email,
          token: invitation.token || '',
          status: invitation.status,
          createdAt: invitation.createdAt,
          expiresAt: invitation.expiresAt,
          usedAt: invitation.usedAt,
        })
      );

      setInvitations(transformedData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load invitations';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Filter invitations based on status
  const filteredInvitations = useMemo(() => {
    if (statusFilter === 'ALL') return invitations;
    return invitations.filter((inv) => inv.status === statusFilter);
  }, [invitations, statusFilter]);

  // Handle copy invitation link
  const handleCopyInvitationLink = useCallback(
    (row: InvitationTableRow) => {
      const invitationLink = `${window.location.origin}/signup/worker?token=${row.token}`;
      navigator.clipboard.writeText(invitationLink).then(
        () => {
          showSuccess('Invitation link copied to clipboard!');
        },
        (err) => {
          console.error('Failed to copy link:', err);
          showError('Failed to copy invitation link');
        }
      );
    },
    [showSuccess, showError]
  );

  // Dropdown options for status filter
  const statusFilterOptions = useMemo(
    () => [
      { label: 'All Statuses', value: 'ALL' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Accepted', value: 'ACCEPTED' },
      { label: 'Expired', value: 'EXPIRED' },
    ],
    []
  );

  // Table columns
  const columns: ITableColumn<InvitationTableRow>[] = useMemo(
    () => [
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
              <Box
                sx={{
                  maxWidth: '250px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  color: '#64748b',
                }}
              >
                {invitationLink}
              </Box>
              <Tooltip title="Copy invitation link">
                <IconButton
                  size="small"
                  onClick={() => handleCopyInvitationLink(row)}
                  sx={{
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: '#e2e8f0',
                    },
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
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
          <StatusBadge color={getStatusColor(row.status)}>
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
    ],
    [handleCopyInvitationLink]
  );

  return (
    <InvitationsContainer>
      <PageWrapper
        title="Worker Invitations"
        description="View and manage all worker invitations sent from your company."
        showSearch
        searchPlaceholder="Search invitations by email"
        dropdownOptions={statusFilterOptions}
        dropdownValue={statusFilter}
        dropdownPlaceholder="All Statuses"
        onDropdownChange={setStatusFilter}
        headerExtra={
          <Tooltip title="Refresh invitations">
            <IconButton onClick={fetchInvitations} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Table<InvitationTableRow>
          columns={columns}
          data={filteredInvitations}
          loading={loading}
          emptyMessage="No invitations found. Send your first worker invitation to get started."
          rowsPerPage={10}
          showPagination={true}
          enableStickyLeft={true}
        />
      </PageWrapper>
    </InvitationsContainer>
  );
};
