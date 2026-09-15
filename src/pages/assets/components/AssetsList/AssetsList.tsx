import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { StandaloneDropdown } from '../../../../components/UI/Forms/Dropdown';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { assetService, assetGroupService, AssetResponseLocationTypeEnum } from '../../../../services/api';
import type { AssetResponse, AssetGroupResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { generateAssetColumns, type AssetTableRow } from './DataColumn';
import { AssetForm } from '../AssetForm';
import { formatAddress } from '../../../../utils/googleGeocoding';

const formatAssetLocation = (asset: AssetResponse): string => {
  switch (asset.locationType) {
    case AssetResponseLocationTypeEnum.Warehouse:
      return formatAddress(asset.warehouseAddress) || 'Warehouse';
    case AssetResponseLocationTypeEnum.JobSite:
      return formatAddress(asset.address) || 'On Job Site';
    case AssetResponseLocationTypeEnum.WorkerLocation:
      return 'With Worker';
    case AssetResponseLocationTypeEnum.Custom:
      return formatAddress(asset.address) || 'Custom Location';
    default:
      return formatAddress(asset.warehouseAddress);
  }
};

export const AssetsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAutoOpened = useRef(false);
  const [assets, setAssets] = useState<AssetTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<number | ''>('');
  const [groups, setGroups] = useState<AssetGroupResponse[]>([]);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const { formatCurrency } = useCurrency();

  // Fetch groups for the group filter dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await assetGroupService.getAllAssetGroups();
        setGroups(response.data.content || []);
      } catch (error) {
        console.error('Error fetching asset groups:', error);
      }
    };

    fetchGroups();
  }, []);

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);

      // Determine filter params based on status filter
      let archived: boolean | undefined;
      let available: boolean | undefined;

      if (statusFilter === 'available') {
        archived = false;
        available = true;
      } else if (statusFilter === 'in-use') {
        archived = false;
        available = false;
      } else if (statusFilter === 'archived') {
        archived = true;
      }

      const response = await assetService.getAllAssets(0, 100, archived, available, groupFilter || undefined);
      const assetsData = response.data.content ? Array.isArray(response.data.content) ? response.data.content : [] : [];

      // Transform API response to table format
      const transformedData: AssetTableRow[] = assetsData.map((asset: AssetResponse) => {
        // Determine status based on available and archived flags
        let status: AssetTableRow['status'] = 'available';
        if (asset.archived) {
          status = 'archived';
        } else if (!asset.available) {
          status = 'in-use';
        }

        return {
          id: asset.id || 0,
          assetRef: asset.assetRef,
          name: asset.name || '',
          assetTag: asset.assetTag,
          serialNumber: asset.serialNumber,
          purchasePrice: asset.purchasePrice,
          purchaseDate: asset.purchaseDate,
          currentValue: undefined, // Will fetch separately if needed
          status,
          currentLocation: formatAssetLocation(asset),
          groupName: asset.groupName,
          available: asset.available || false,
          archived: asset.archived || false,
          createdAt: asset.createdAt,
        };
      });
      setAssets(transformedData);
    } catch (error) {
      console.error('Error fetching assets:', error);
      showError(extractErrorMessage(error, 'Failed to load assets'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, groupFilter, showError]);

  // Load assets on mount and when filters change
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Handle add asset
  const handleAddAsset = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addAsset',
      children: (
        <AssetForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchAssets();
          }}
        />
      ),
    });
  }, [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchAssets]);

  // Automatically trigger asset creation modal if ?openAddModal=true query parameter is present in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('openAddModal') === 'true' && !loading && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      navigate('/company/assets', { replace: true });
      handleAddAsset();
    }
  }, [location.search, loading, navigate, handleAddAsset]);

  // Handle edit asset
  const handleEditAsset = useCallback(
    (asset: AssetTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editAsset',
        children: (
          <AssetForm
            isModal={true}
            assetId={asset.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchAssets();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchAssets]
  );

  // Handle archive asset
  const handleArchiveAsset = useCallback(
    (asset: AssetTableRow) => {
      // Prevent archiving if asset is in use
      if (!asset.available) {
        showError('Cannot archive asset that is currently in use. Return it first.');
        return;
      }

      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'archiveAsset',
        children: (
          <ConfirmationModal
            title="Archive Asset"
            message={`Are you sure you want to archive "${asset.name}"?`}
            description="Archived assets cannot be assigned to jobs. This action can be reversed if needed."
            variant="warning"
            confirmButtonText="Archive"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await assetService.archiveAsset(asset.id);
                showSuccess(`${asset.name} archived successfully`);
                resetGlobalModalOuterProps();
                fetchAssets();
              } catch (error) {
                console.error('Error archiving asset:', error);
                showError(extractErrorMessage(error, 'Failed to archive asset'));
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
    [showSuccess, showError, fetchAssets, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Handle view asset history
  const handleViewHistory = useCallback(
    (asset: AssetTableRow) => {
      // Navigate to asset detail/history page
      navigate(`/company/assets/${asset.id}/history`);
    },
    [navigate]
  );

  // Handle row click to navigate to history
  const handleRowClick = useCallback(
    (asset: AssetTableRow) => {
      navigate(`/company/assets/${asset.id}/history`);
    },
    [navigate]
  );

  // Generate columns
  const assetColumns = useMemo(() => {
    return generateAssetColumns(formatCurrency);
  }, [formatCurrency]);

  // Define table actions
  const tableActions: ITableAction<AssetTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditAsset,
      },
      {
        id: 'history',
        label: 'Assignment History',
        onClick: handleViewHistory,
      },
      {
        id: 'archive',
        label: 'Archive',
        onClick: handleArchiveAsset,
        color: 'warning' as const,
        show: (row) => !row.archived,
      },
    ],
    [handleEditAsset, handleViewHistory, handleArchiveAsset]
  );

  // Status filter options for dropdown
  const statusFilterOptions = [
    { label: 'All Assets', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'In Use', value: 'in-use' },
    { label: 'Archived', value: 'archived' },
  ];

  // Group filter options for the header's group dropdown
  const groupFilterOptions = useMemo(
    () => [
      { label: 'All Groups', value: '' },
      ...groups.map((group) => ({ label: group.name || '', value: group.id || 0 })),
    ],
    [groups]
  );

  return (
    <PageWrapper
      title="All Assets"
      description="Manage your company assets and equipment."
      actions={[
        {
          label: 'Add Asset',
          onClick: handleAddAsset,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      headerExtra={
        <StandaloneDropdown
          name="assetGroupFilter"
          placeHolder="All Groups"
          preFetchedOptions={groupFilterOptions}
          defaultValue=""
          onChange={(value) => setGroupFilter((value as number | '') || '')}
          disableClearable
          hideErrorMessage
        />
      }
      dropdownOptions={statusFilterOptions}
      dropdownValue={statusFilter}
      onDropdownChange={(value) => setStatusFilter(value as string)}
      showSearch
      searchPlaceholder="Search assets..."
    >
      <Table<AssetTableRow>
        columns={assetColumns}
        data={assets}
        selectable
        showActions
        actions={tableActions}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No assets found. Add your first asset to get started."
        rowsPerPage={20}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
