import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { Search } from '../../../../components/UI/Search';
import { IconButton } from '../../../../components/UI/Button';
import { Badge } from '../../../../components/UI/Badge';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { assetService, assetGroupService, AssetResponseLocationTypeEnum } from '../../../../services/api';
import type { AssetResponse, AssetGroupResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { generateAssetColumns, type AssetTableRow } from './DataColumn';
import { AssetForm } from '../AssetForm';
import { formatAddress } from '../../../../utils/googleGeocoding';
import { AssetFilterPanel, type AssetFilterState } from './AssetFilterPanel';
import {
  HeaderControls,
  FilterButtonWrapper,
  FilterCountBadge,
  FilterTuneIcon,
  ChipsRow,
  FilterChip,
  ClearAllChip,
} from './AssetFilterPanel.styles';

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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);

  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const { formatCurrency } = useCurrency();

  // Debounce search input -> searchQuery
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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
      const assetsData = response.data.content ? (Array.isArray(response.data.content) ? response.data.content : []) : [];

      // Transform API response to table format
      const transformedData: AssetTableRow[] = assetsData.map((asset: AssetResponse) => {
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
          currentValue: undefined,
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

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Client-side search filtering
  const displayAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets;
    const query = searchQuery.toLowerCase().trim();
    return assets.filter((asset) => {
      return (
        asset.name.toLowerCase().includes(query) ||
        (asset.assetRef && String(asset.assetRef).toLowerCase().includes(query)) ||
        (asset.assetTag && asset.assetTag.toLowerCase().includes(query)) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(query)) ||
        (asset.groupName && asset.groupName.toLowerCase().includes(query)) ||
        (asset.currentLocation && asset.currentLocation.toLowerCase().includes(query))
      );
    });
  }, [assets, searchQuery]);

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

  const handleViewHistory = useCallback(
    (asset: AssetTableRow) => {
      navigate(`/company/assets/${asset.id}/history`);
    },
    [navigate]
  );

  const handleRowClick = useCallback(
    (asset: AssetTableRow) => {
      navigate(`/company/assets/${asset.id}/history`);
    },
    [navigate]
  );

  const assetColumns = useMemo(() => {
    return generateAssetColumns(formatCurrency);
  }, [formatCurrency]);

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

  const statusFilterOptions = useMemo(
    () => [
      { label: 'All Assets', value: 'all' },
      { label: 'Available', value: 'available' },
      { label: 'In Use', value: 'in-use' },
      { label: 'Archived', value: 'archived' },
    ],
    []
  );

  const groupFilterOptions = useMemo(
    () => [
      { label: 'All Groups', value: '' },
      ...groups.map((group) => ({ label: group.name || '', value: group.id || 0 })),
    ],
    [groups]
  );

  const handleApplyFilters = useCallback((filters: AssetFilterState) => {
    setStatusFilter(filters.status);
    setGroupFilter(filters.group);
  }, []);

  const handleResetFilters = useCallback(() => {
    setStatusFilter('all');
    setGroupFilter('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setStatusFilter('all');
    setGroupFilter('');
    setSearchInput('');
    setSearchQuery('');
    setSearchKey((k) => k + 1);
  }, []);

  // Active badge count: +1 for group filter if set, +1 for status filter if not 'all'
  const activeBadgeCount = (groupFilter !== '' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);
  const hasActiveFilters = activeBadgeCount > 0;

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onDelete: () => void }[] = [];

    if (searchQuery) {
      chips.push({
        key: 'search',
        label: `"${searchQuery}"`,
        onDelete: () => {
          setSearchInput('');
          setSearchQuery('');
          setSearchKey((k) => k + 1);
        },
      });
    }

    if (groupFilter !== '') {
      const selectedGroup = groups.find((g) => g.id === groupFilter);
      chips.push({
        key: 'group',
        label: `Group: ${selectedGroup?.name || groupFilter}`,
        onDelete: () => setGroupFilter(''),
      });
    }

    if (statusFilter !== 'all') {
      const selectedStatus = statusFilterOptions.find((s) => s.value === statusFilter);
      chips.push({
        key: 'status',
        label: `Status: ${selectedStatus?.label || statusFilter}`,
        onDelete: () => setStatusFilter('all'),
      });
    }

    return chips;
  }, [searchQuery, groupFilter, statusFilter, groups, statusFilterOptions]);

  const currentFilterState: AssetFilterState = useMemo(
    () => ({
      status: statusFilter,
      group: groupFilter,
    }),
    [statusFilter, groupFilter]
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
        <HeaderControls>
          <Search
            key={searchKey}
            placeholder="Search assets..."
            onChange={setSearchInput}
            onSearch={(v) => {
              setSearchInput(v);
              setSearchQuery(v);
            }}
            size="small"
          />
          <FilterButtonWrapper>
            <IconButton
              variant="outlined"
              color={hasActiveFilters ? 'primary' : 'secondary'}
              size="small"
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              aria-label="Open filters"
            >
              <FilterTuneIcon />
            </IconButton>
            {hasActiveFilters && (
              <FilterCountBadge>
                <Badge variant="primary" size="small">
                  {activeBadgeCount}
                </Badge>
              </FilterCountBadge>
            )}
          </FilterButtonWrapper>
        </HeaderControls>
      }
    >
      {activeChips.length > 0 && (
        <ChipsRow>
          {activeChips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onDelete={chip.onDelete} size="small" variant="outlined" />
          ))}
          {activeChips.length > 1 && <ClearAllChip label="Clear all" size="small" onClick={clearAllFilters} />}
        </ChipsRow>
      )}

      <Table<AssetTableRow>
        columns={assetColumns}
        data={displayAssets}
        selectable
        showActions
        actions={tableActions}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage={
          activeChips.length > 0
            ? 'No assets match the current filters.'
            : 'No assets found. Add your first asset to get started.'
        }
        rowsPerPage={20}
        showPagination={true}
        enableStickyLeft={true}
      />

      <AssetFilterPanel
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        currentFilters={currentFilterState}
        groupOptions={groupFilterOptions}
        statusOptions={statusFilterOptions}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </PageWrapper>
  );
};
