import React, { useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { SetupForm } from '../SetupForm';
import { assetGroupService } from '../../../../services/api';
import type { AssetGroupResponse, PagedModelAssetGroupResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useFetch } from '../../../../hooks';
import { columns, type AssetGroupTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const {
    data: groupsPage,
    loading,
    refetch: fetchGroups,
  } = useFetch<PagedModelAssetGroupResponse>(() => assetGroupService.getAllAssetGroups(), [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load asset groups')),
  });

  const rawGroups = useMemo(() => groupsPage?.content ?? [], [groupsPage]);

  const groups = useMemo((): AssetGroupTableRow[] => {
    return rawGroups.map((group: AssetGroupResponse) => ({
      id: group.id || 0,
      name: group.name || '',
      description: group.description || '',
      createdAt: group.createdAt ? new Date(group.createdAt).toLocaleDateString() : '',
    }));
  }, [rawGroups]);

  const handleAddGroup = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addAssetGroup',
      children: (
        <SetupForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchGroups();
          }}
        />
      ),
    });
  }, [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchGroups]);

  const handleEditGroup = useCallback(
    (row: AssetGroupTableRow) => {
      const assetGroup = rawGroups.find((group) => group.id === row.id);
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editAssetGroup',
        children: (
          <SetupForm
            isModal={true}
            assetGroup={assetGroup}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchGroups();
            }}
          />
        ),
      });
    },
    [rawGroups, setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchGroups]
  );

  const handleDeleteGroup = useCallback(
    (row: AssetGroupTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteAssetGroup',
        children: (
          <ConfirmationModal
            title="Delete Asset Group"
            message={`Are you sure you want to delete "${row.name}"?`}
            description="Assets in this group will remain, but will no longer be grouped. This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await assetGroupService.deleteAssetGroup(row.id);
                showSuccess(`${row.name} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchGroups();
              } catch (error) {
                console.error('Error deleting asset group:', error);
                showError(extractErrorMessage(error, 'Failed to delete asset group'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
    },
    [showSuccess, showError, fetchGroups, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const tableActions: ITableAction<AssetGroupTableRow>[] = useMemo(
    () => [
      { id: 'edit', label: 'Edit', onClick: handleEditGroup },
      { id: 'delete', label: 'Delete', onClick: handleDeleteGroup, color: 'error' as const },
    ],
    [handleEditGroup, handleDeleteGroup]
  );

  return (
    <PageWrapper
      title="Asset Groups"
      description="Organize assets into groups to make them easier to find and assign."
      actions={[
        {
          label: 'Add Group',
          onClick: handleAddGroup,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search asset groups"
    >
      <Table<AssetGroupTableRow>
        columns={columns}
        data={groups}
        selectable
        showActions
        actions={tableActions}
        loading={loading}
        emptyMessage="No asset groups found. Add your first group to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
        view={false}
      />
    </PageWrapper>
  );
};
