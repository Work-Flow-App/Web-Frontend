import React, { useEffect, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, IconButton } from '../../../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../../services/api';
import type { CompanyPostGroupResponse } from '../../../../../../services/api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import { PostGroupForm } from '../PostGroupForm';
import type { PostGroupFormValues } from '../PostGroupForm/IPostGroupForm';
import {
  Wrapper,
  SectionLabel,
  GroupList,
  GroupRow,
  GroupText,
  GroupName,
  GroupDescription,
  GroupActions,
  ConfirmText,
  EmptyText,
} from './ManagePostGroups.styles';

interface ManagePostGroupsProps {
  companyId: number;
  groups: CompanyPostGroupResponse[];
  onGroupsChange: () => void;
  onClose: () => void;
}

export const ManagePostGroups: React.FC<ManagePostGroupsProps> = ({ companyId, groups, onGroupsChange, onClose }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  // Local copy so the list updates immediately; the parent refetches in the background.
  const [items, setItems] = useState<CompanyPostGroupResponse[]>(groups);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    updateModalTitle('Manage Post Groups');
    updateGlobalModalInnerConfig({ confirmButtonOnly: true, confirmModalButtonText: 'Done' });
    updateOnClose(() => onClose());
    updateOnConfirm(() => onClose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Runs a group mutation; resolves true on success so the form can react. */
  const run = async (action: () => Promise<void>, errorMessage: string): Promise<boolean> => {
    setBusy(true);
    try {
      await action();
      onGroupsChange();
      return true;
    } catch (error) {
      showError(extractErrorMessage(error, errorMessage));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const toRequest = (values: PostGroupFormValues) => ({
    name: values.name,
    description: values.description || undefined,
  });

  const handleCreate = (values: PostGroupFormValues) =>
    run(async () => {
      const res = await companyService.createPostGroup(companyId, toRequest(values));
      setItems((prev) => [...prev, res.data]);
      showSuccess('Group created.');
    }, 'Failed to create group.');

  const handleUpdate = (groupId: number, values: PostGroupFormValues) =>
    run(async () => {
      const res = await companyService.updatePostGroup(companyId, groupId, toRequest(values));
      setItems((prev) => prev.map((g) => (g.id === groupId ? res.data : g)));
      setEditingId(null);
      showSuccess('Group updated.');
    }, 'Failed to update group.');

  const handleDelete = (groupId: number) =>
    run(async () => {
      await companyService.deletePostGroup(companyId, groupId);
      setItems((prev) => prev.filter((g) => g.id !== groupId));
      setDeletingId(null);
      showSuccess('Group deleted.');
    }, 'Failed to delete group.');

  return (
    <Wrapper>
      <SectionLabel>New group</SectionLabel>
      <PostGroupForm submitLabel="Add Group" busy={busy} onSubmit={handleCreate} />

      <SectionLabel>Groups</SectionLabel>
      {items.length === 0 ? (
        <EmptyText>No groups yet. Groups let you organise posts and filter the feed by topic.</EmptyText>
      ) : (
        <GroupList>
          {items.map((group) => (
            <GroupRow key={group.id}>
              {editingId === group.id ? (
                <PostGroupForm
                  group={group}
                  submitLabel="Save"
                  busy={busy}
                  onSubmit={(values) => handleUpdate(group.id!, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : deletingId === group.id ? (
                <>
                  <ConfirmText>Delete &ldquo;{group.name}&rdquo;? Posts in it will become ungrouped.</ConfirmText>
                  <GroupActions>
                    <Button size="small" variant="text" color="secondary" onClick={() => setDeletingId(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      disabled={busy}
                      onClick={() => handleDelete(group.id!)}
                    >
                      Delete
                    </Button>
                  </GroupActions>
                </>
              ) : (
                <>
                  <GroupText>
                    <GroupName>{group.name}</GroupName>
                    {group.description && <GroupDescription>{group.description}</GroupDescription>}
                  </GroupText>
                  <GroupActions>
                    <IconButton
                      size="small"
                      variant="text"
                      color="secondary"
                      aria-label="Edit group"
                      disabled={busy}
                      onClick={() => {
                        setDeletingId(null);
                        setEditingId(group.id ?? null);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="text"
                      color="secondary"
                      aria-label="Delete group"
                      disabled={busy}
                      onClick={() => {
                        setEditingId(null);
                        setDeletingId(group.id ?? null);
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </GroupActions>
                </>
              )}
            </GroupRow>
          ))}
        </GroupList>
      )}
    </Wrapper>
  );
};
