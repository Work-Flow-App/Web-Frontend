import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../components/UI/PageWrapper';
import Table from '../../components/UI/Table/Table';
import type { ITableColumn, ITableAction } from '../../components/UI/Table/ITable';
import { workerService, type WorkerInvitationStatus } from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import { StatusBadge, InvitationsContainer } from './InvitationsPage.styles';

interface InvitationTableRow {
  id: number;
  invitationId: number;
  email: string;
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
        (invitation: WorkerInvitationStatus) => ({
          id: invitation.invitationId,
          invitationId: invitation.invitationId,
          email: invitation.email,
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

  // Handle resend invitation
  const handleResendInvitation = useCallback(
    async (row: InvitationTableRow) => {
      try {
        await workerService.sendWorkerInvitation({ email: row.email });
        showSuccess(`Invitation resent to ${row.email}`);
        fetchInvitations();
      } catch (error) {
        console.error('Error resending invitation:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to resend invitation';
        showError(errorMessage);
      }
    },
    [showSuccess, showError, fetchInvitations]
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
    []
  );

  // Table actions - Resend for expired invitations
  const tableActions: ITableAction<InvitationTableRow>[] = useMemo(
    () => [
      {
        id: 'resend',
        label: 'Resend',
        icon: <SendIcon fontSize="small" />,
        onClick: handleResendInvitation,
        show: (row) => row.status === 'EXPIRED',
        color: 'primary' as const,
      },
    ],
    [handleResendInvitation]
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
          showActions
          actions={tableActions}
        />
      </PageWrapper>
    </InvitationsContainer>
  );
};
