import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme, Box, Tabs, Tab } from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table from '../../../components/UI/Table/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import { InviteMemberForm } from './components/InviteMemberForm';
import { ChangeMemberRoleForm } from './components/ChangeMemberRoleForm';
import { companyMemberService } from '../../../services/api/companyMember';
import type { MemberResponse, MemberInvitationStatusResponse } from '../../../services/api/companyMember';
import { MemberResponseCompanyRoleEnum } from '../../../../workflow-api';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { TeamContainer } from './TeamPage.styles';
import {
  createMemberColumns,
  createInvitationColumns,
  type MemberTableRow,
  type InvitationTableRow,
} from './TeamPage.columns';

export const TeamPage: React.FC = () => {
  const theme = useTheme();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const { canInviteMembers, canManageRoles, isLoading: isRoleLoading } = useCompanyRole();

  const [members, setMembers] = useState<MemberTableRow[]>([]);
  const [invitations, setInvitations] = useState<InvitationTableRow[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const fetchMembers = useCallback(async () => {
    try {
      setLoadingMembers(true);
      const response = await companyMemberService.getMembers();
      const data = Array.isArray(response.data) ? response.data : [];
      setMembers(
        data.map((m: MemberResponse) => ({
          id: m.memberId ?? 0,
          memberId: m.memberId ?? 0,
          userId: m.userId ?? 0,
          name: m.name ?? '',
          email: m.email ?? '',
          username: m.username ?? '',
          companyRole: m.companyRole ?? '',
          joinedAt: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : '',
        }))
      );
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load team members.'));
    } finally {
      setLoadingMembers(false);
    }
  }, [showError]);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoadingInvitations(true);
      const response = await companyMemberService.getInvitations();
      const data = Array.isArray(response.data) ? response.data : [];
      setInvitations(
        data.map((inv: MemberInvitationStatusResponse) => ({
          id: inv.id ?? 0,
          email: inv.email ?? '',
          companyRole: inv.companyRole ?? '',
          status: inv.status ?? '',
          createdAt: inv.createdAt ?? '',
          expiresAt: inv.expiresAt ?? null,
          usedAt: inv.usedAt ?? null,
        }))
      );
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load invitations.'));
    } finally {
      setLoadingInvitations(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (activeTab === 1 && canInviteMembers) {
      fetchInvitations();
    }
  }, [activeTab, canInviteMembers, fetchInvitations]);

  const handleInviteMember = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'inviteMember',
      children: (
        <InviteMemberForm
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchInvitations();
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  const handleChangeRole = useCallback(
    (member: MemberTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'changeMemberRole',
        children: (
          <ChangeMemberRoleForm
            memberName={member.name || member.email}
            currentRole={member.companyRole}
            onConfirm={async (newRole) => {
              try {
                await companyMemberService.updateMemberRole(member.memberId, newRole);
                showSuccess(`${member.name || member.email} role updated.`);
                resetGlobalModalOuterProps();
                fetchMembers();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to update role.'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchMembers]
  );

  const handleRemoveMember = useCallback(
    (member: MemberTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'removeMember',
        children: (
          <ConfirmationModal
            title="Remove Member"
            message={`Remove ${member.name || member.email} from the team?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await companyMemberService.removeMember(member.memberId);
                showSuccess(`${member.name || member.email} removed.`);
                resetGlobalModalOuterProps();
                fetchMembers();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to remove member.'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchMembers]
  );

  const memberActions: ITableAction<MemberTableRow>[] = useMemo(() => {
    if (!canManageRoles) return [];
    return [
      {
        id: 'changeRole',
        label: 'Change Role',
        onClick: handleChangeRole,
        isDisabled: (row) => row.companyRole === MemberResponseCompanyRoleEnum.CompanyAdmin,
      },
      {
        id: 'remove',
        label: 'Remove',
        onClick: handleRemoveMember,
        color: 'error' as const,
        isDisabled: (row) => row.companyRole === MemberResponseCompanyRoleEnum.CompanyAdmin,
      },
    ];
  }, [canManageRoles, handleChangeRole, handleRemoveMember]);

  const memberColumns = useMemo(() => createMemberColumns(), []);
  const invitationColumns = useMemo(() => createInvitationColumns(theme), [theme]);

  const pageActions = useMemo(() => {
    if (!canInviteMembers || isRoleLoading) return [];
    return [
      {
        label: 'Invite Member',
        onClick: handleInviteMember,
        variant: 'contained' as const,
        color: 'primary' as const,
      },
    ];
  }, [canInviteMembers, isRoleLoading]);

  return (
    <TeamContainer>
      <PageWrapper
        title="Team"
        description="Manage your team members and pending invitations."
        actions={pageActions}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab
              icon={<GroupOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Members"
            />
            {canInviteMembers && (
              <Tab
                icon={<MailOutlineIcon fontSize="small" />}
                iconPosition="start"
                label="Invitations"
              />
            )}
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Table<MemberTableRow>
            columns={memberColumns}
            data={members}
            loading={loadingMembers}
            showActions={canManageRoles}
            actions={memberActions}
            emptyMessage="No team members found."
            rowsPerPage={10}
            showPagination={true}
            enableStickyLeft={true}
          />
        )}
        {activeTab === 1 && (
          <Table<InvitationTableRow>
            columns={invitationColumns}
            data={invitations}
            loading={loadingInvitations}
            emptyMessage="No invitations found. Invite your first team member to get started."
            rowsPerPage={10}
            showPagination={true}
            enableStickyLeft={true}
          />
        )}
      </PageWrapper>
    </TeamContainer>
  );
};
