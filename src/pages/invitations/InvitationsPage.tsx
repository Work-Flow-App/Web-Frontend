import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../components/UI/PageWrapper';
import Table from '../../components/UI/Table/Table';
import { workerService, type WorkerInvitationStatus } from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { InvitationsContainer } from './InvitationsPage.styles';
import { createInvitationColumns, type InvitationTableRow } from './InvitationsPage.columns';

export const InvitationsPage: React.FC = () => {
  const theme = useTheme();
  const [invitations, setInvitations] = useState<InvitationTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | number>('ALL');
  const { showError, showSuccess } = useSnackbar();

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerService.getWorkerInvitations();

      const transformedData: InvitationTableRow[] = response?.map((invitation: WorkerInvitationStatus) => ({
        id: invitation.invitationId,
        invitationId: invitation.invitationId,
        email: invitation.email,
        token: invitation.token,
        status: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
        usedAt: invitation.usedAt,
      }));

      setInvitations(transformedData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load invitations';
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
      const invitationLink = `${window?.location?.origin}/signup/worker?token=${row?.token}`;
      navigator.clipboard?.writeText(invitationLink)?.then(
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
  const columns = useMemo(
    () => createInvitationColumns(handleCopyInvitationLink, theme),
    [handleCopyInvitationLink, theme]
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
