import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '../../../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../../services/api';
import type { CompanyPostGroupResponse } from '../../../../../../services/api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import {
  Wrapper,
  AddRow,
  GroupList,
  GroupRow,
  GroupName,
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
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    updateModalTitle('Manage Post Groups');
    updateGlobalModalInnerConfig({ confirmButtonOnly: true, confirmModalButtonText: 'Done' });
    updateOnClose(() => onClose());
    updateOnConfirm(() => onClose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (action: () => Promise<void>, errorMessage: string) => {
    setBusy(true);
    try {
      await action();
      onGroupsChange();
    } catch (error) {
      showError(extractErrorMessage(error, errorMessage));
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    run(async () => {
      const res = await companyService.createPostGroup(companyId, { name });
      setItems((prev) => [...prev, res.data]);
      setNewName('');
      showSuccess('Group created.');
    }, 'Failed to create group.');
  };

  const handleUpdate = (group: CompanyPostGroupResponse) => {
    const name = editName.trim();
    if (!group.id || !name) return;
    run(async () => {
      const res = await companyService.updatePostGroup(companyId, group.id!, { name, description: group.description });
      setItems((prev) => prev.map((g) => (g.id === group.id ? res.data : g)));
      setEditingId(null);
      showSuccess('Group updated.');
    }, 'Failed to update group.');
  };

  const handleDelete = (groupId: number) => {
    run(async () => {
      await companyService.deletePostGroup(companyId, groupId);
      setItems((prev) => prev.filter((g) => g.id !== groupId));
      setDeletingId(null);
      showSuccess('Group deleted.');
    }, 'Failed to delete group.');
  };

  return (
    <Wrapper>
      <AddRow>
        <TextField
          size="small"
          fullWidth
          placeholder="New group name, e.g. Safety Updates"
          value={newName}
          disabled={busy}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
        />
        <Button size="small" variant="contained" color="primary" disabled={busy || !newName.trim()} onClick={handleCreate}>
          Add
        </Button>
      </AddRow>

      {items.length === 0 ? (
        <EmptyText>No groups yet. Groups let you organise posts and filter the feed by topic.</EmptyText>
      ) : (
        <GroupList>
          {items.map((group) => (
            <GroupRow key={group.id}>
              {editingId === group.id ? (
                <>
                  <TextField
                    size="small"
                    fullWidth
                    autoFocus
                    value={editName}
                    disabled={busy}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUpdate(group);
                      }
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <GroupActions>
                    <IconButton
                      size="small"
                      variant="text"
                      color="primary"
                      aria-label="Save group"
                      disabled={busy || !editName.trim()}
                      onClick={() => handleUpdate(group)}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="text"
                      color="secondary"
                      aria-label="Cancel editing"
                      onClick={() => setEditingId(null)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </GroupActions>
                </>
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
                  <GroupName>{group.name}</GroupName>
                  <GroupActions>
                    <IconButton
                      size="small"
                      variant="text"
                      color="secondary"
                      aria-label="Rename group"
                      disabled={busy}
                      onClick={() => {
                        setDeletingId(null);
                        setEditingId(group.id ?? null);
                        setEditName(group.name || '');
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
