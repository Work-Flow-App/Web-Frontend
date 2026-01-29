import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import Table from '../../../../components/UI/Table/Table';
import { assetService } from '../../../../services/api';
import type { AssetResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { assetArchiveColumns, type AssetArchiveRow } from './AssetArchiveDataColumn';
import * as S from './AssetHistory.styles';

export const AssetArchiveTab: React.FC = () => {
  const { showError } = useSnackbar();
  const [archivedAssets, setArchivedAssets] = useState<AssetArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assetService.getAllAssets(0, 100, true);
      const assetsData = response.data.content
        ? Array.isArray(response.data.content)
          ? response.data.content
          : []
        : [];

      // Filter only assets where archived is true
      const archivedOnly = assetsData.filter((asset: AssetResponse) => asset.archived === true);

      const transformedData: AssetArchiveRow[] = archivedOnly.map((asset: AssetResponse) => ({
        id: asset.id || 0,
        name: asset.name || '',
        assetTag: asset.assetTag,
        serialNumber: asset.serialNumber,
        purchasePrice: asset.purchasePrice,
        purchaseDate: asset.purchaseDate,
        archivedAt: asset.updatedAt,
      }));

      setArchivedAssets(transformedData);
    } catch (error) {
      console.error('Error fetching archived assets:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load archived assets';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchArchivedAssets();
  }, [fetchArchivedAssets]);

  if (archivedAssets.length === 0 && !loading) {
    return (
      <S.EmptyStateContainer>
        <S.EmptyStateTitle>No archived assets found.</S.EmptyStateTitle>
        <S.EmptyStateSubtitle>
          Archived assets will appear here when you archive them from the assets list.
        </S.EmptyStateSubtitle>
      </S.EmptyStateContainer>
    );
  }

  return (
    <Box>
      <Table<AssetArchiveRow>
        columns={assetArchiveColumns}
        data={archivedAssets}
        selectable={false}
        showActions={false}
        loading={loading}
        emptyMessage="No archived assets available."
        rowsPerPage={20}
        showPagination={true}
      />
    </Box>
  );
};
