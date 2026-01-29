import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import { Button } from '../../../../components/UI/Button';
import { assetService } from '../../../../services/api';
import type { AssetResponse, AssetAssignmentResponse, AssetValueResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI';
import { assetHistoryColumns, type AssetHistoryRow } from './DataColumn';
import { AssetArchiveTab } from './AssetArchiveTab';
import * as S from './AssetHistory.styles';

export const AssetHistory: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [asset, setAsset] = useState<AssetResponse | null>(null);
  const [assetValue, setAssetValue] = useState<AssetValueResponse | null>(null);
  const [history, setHistory] = useState<AssetHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch asset data
  const fetchAssetData = useCallback(async () => {
    if (!assetId) return;

    try {
      setLoading(true);

      // Fetch asset details
      const assetResponse = await assetService.getAssetById(Number(assetId));
      setAsset(assetResponse.data);

      // Fetch asset value (depreciation info)
      try {
        const valueResponse = await assetService.getAssetValue(Number(assetId));
        setAssetValue(valueResponse.data);
      } catch {
        // Value endpoint might not be available for all assets
        setAssetValue(null);
      }

      // Fetch assignment history
      const historyResponse = await assetService.getAssetHistory(Number(assetId));
      const historyData = Array.isArray(historyResponse.data) ? historyResponse.data : [];

      // Transform to table format
      const transformedData: AssetHistoryRow[] = historyData.map((assignment: AssetAssignmentResponse) => ({
        id: assignment.assignmentId || 0,
        assignmentId: assignment.assignmentId || 0,
        jobId: assignment.jobId,
        assignedWorkerId: assignment.assignedWorkerId,
        assignedAt: assignment.assignedAt || '',
        returnedAt: assignment.returnedAt,
        durationDays: assignment.durationDays,
        status: assignment.status,
        notes: assignment.notes,
      }));

      setHistory(transformedData);
    } catch (error) {
      console.error('Error fetching asset data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load asset details';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [assetId, showError]);

  useEffect(() => {
    fetchAssetData();
  }, [fetchAssetData]);

  // Determine asset status
  const getAssetStatus = (): 'available' | 'in-use' | 'archived' => {
    if (!asset) return 'available';
    if (asset.archived) return 'archived';
    if (!asset.available) return 'in-use';
    return 'available';
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in-use':
        return 'In Use';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return `$${amount.toFixed(2)}`;
  };

  const handleBackToAssets = () => {
    navigate('/company/assets');
  };

  if (loading) {
    return <Loader />;
  }

  if (!asset) {
    return (
      <PageWrapper title="" description="">
        <S.LoaderContainer>
          <S.NotFoundText>Asset not found</S.NotFoundText>
        </S.LoaderContainer>
      </PageWrapper>
    );
  }

  const status = getAssetStatus();

  return (
    <PageWrapper title="" description="">
      <S.ContentContainer>
        <S.DetailsGrid>
          {/* Asset Overview Card */}
          <S.AssetOverviewCard>
            <S.HeaderRow>
              <S.AssetTitle>{asset.name}</S.AssetTitle>
              <Button onClick={handleBackToAssets} variant="outlined" startIcon={<ArrowBackIcon />}>
                Back to Assets
              </Button>
            </S.HeaderRow>
            {asset.description && <S.AssetDescription>{asset.description}</S.AssetDescription>}

            <S.MetadataRow>
              <S.MetadataColumn>
                <S.MetadataLabel>Status</S.MetadataLabel>
                <S.StatusBadge statusType={status}>{getStatusLabel(status)}</S.StatusBadge>
              </S.MetadataColumn>

              <S.MetadataColumn>
                <S.MetadataLabel>Asset ID</S.MetadataLabel>
                <S.MetadataValue>#{asset.id}</S.MetadataValue>
              </S.MetadataColumn>

              {asset.assetTag && (
                <S.MetadataColumn>
                  <S.MetadataLabel>Asset Tag</S.MetadataLabel>
                  <S.MetadataValue>{asset.assetTag}</S.MetadataValue>
                </S.MetadataColumn>
              )}

              {asset.serialNumber && (
                <S.MetadataColumn>
                  <S.MetadataLabel>Serial Number</S.MetadataLabel>
                  <S.MetadataValue>{asset.serialNumber}</S.MetadataValue>
                </S.MetadataColumn>
              )}

              <S.MetadataColumn>
                <S.MetadataLabel>Purchase Price</S.MetadataLabel>
                <S.MetadataValue>{formatCurrency(asset.purchasePrice)}</S.MetadataValue>
              </S.MetadataColumn>

              {assetValue?.currentValue !== undefined && (
                <S.MetadataColumn>
                  <S.MetadataLabel>Current Value</S.MetadataLabel>
                  <S.MetadataValue>{formatCurrency(assetValue.currentValue)}</S.MetadataValue>
                </S.MetadataColumn>
              )}

              <S.TagsContainer>
                {asset.archived ? <S.Tag color="#9E9E9E">Archived</S.Tag> : <S.Tag color="#2196F3">Active</S.Tag>}
              </S.TagsContainer>
            </S.MetadataRow>
          </S.AssetOverviewCard>

          {/* Tabs Section */}
          <S.DetailsSection>
            <S.TabsContainer>
              <S.TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
                Asset Details
              </S.TabButton>
              <S.TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                Assignment History
              </S.TabButton>
              <S.TabButton active={activeTab === 'archives'} onClick={() => setActiveTab('archives')}>
                Archived Assets
              </S.TabButton>
            </S.TabsContainer>

            <S.TabContent>
              {/* Asset Details Tab */}
              {activeTab === 'details' && (
                <Box>
                  <S.DetailRow>
                    <S.DetailLabel>Asset Name</S.DetailLabel>
                    <S.DetailValue>{asset.name || '-'}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Description</S.DetailLabel>
                    <S.DetailValue>{asset.description || '-'}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Asset Tag</S.DetailLabel>
                    <S.DetailValue>{asset.assetTag || '-'}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Serial Number</S.DetailLabel>
                    <S.DetailValue>{asset.serialNumber || '-'}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Purchase Price</S.DetailLabel>
                    <S.DetailValue>{formatCurrency(asset.purchasePrice)}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Purchase Date</S.DetailLabel>
                    <S.DetailValue>{formatDate(asset.purchaseDate)}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Depreciation Rate</S.DetailLabel>
                    <S.DetailValue>
                      {asset.depreciationRate !== undefined ? `${asset.depreciationRate}%` : '-'}
                    </S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Salvage Value</S.DetailLabel>
                    <S.DetailValue>{formatCurrency(asset.salvageValue)}</S.DetailValue>
                  </S.DetailRow>
                  {assetValue && (
                    <>
                      <S.DetailRow>
                        <S.DetailLabel>Current Value</S.DetailLabel>
                        <S.DetailValue>{formatCurrency(assetValue.currentValue)}</S.DetailValue>
                      </S.DetailRow>
                      <S.DetailRow>
                        <S.DetailLabel>Total Depreciation</S.DetailLabel>
                        <S.DetailValue>{formatCurrency(assetValue.totalDepreciation)}</S.DetailValue>
                      </S.DetailRow>
                      <S.DetailRow>
                        <S.DetailLabel>Days Owned</S.DetailLabel>
                        <S.DetailValue>{assetValue.daysOwned ?? '-'}</S.DetailValue>
                      </S.DetailRow>
                      <S.DetailRow>
                        <S.DetailLabel>Years Owned</S.DetailLabel>
                        <S.DetailValue>
                          {assetValue.yearsOwned !== undefined ? assetValue.yearsOwned.toFixed(2) : '-'}
                        </S.DetailValue>
                      </S.DetailRow>
                    </>
                  )}
                  <S.DetailRow>
                    <S.DetailLabel>Status</S.DetailLabel>
                    <S.DetailValue>
                      <S.StatusBadge statusType={status}>{getStatusLabel(status)}</S.StatusBadge>
                    </S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Created At</S.DetailLabel>
                    <S.DetailValue>{formatDate(asset.createdAt)}</S.DetailValue>
                  </S.DetailRow>
                  <S.DetailRow>
                    <S.DetailLabel>Updated At</S.DetailLabel>
                    <S.DetailValue>{formatDate(asset.updatedAt)}</S.DetailValue>
                  </S.DetailRow>
                </Box>
              )}

              {/* Assignment History Tab */}
              {activeTab === 'history' && (
                <Box>
                  {history.length === 0 ? (
                    <S.EmptyStateContainer>
                      <S.EmptyStateTitle>No assignment history found for this asset.</S.EmptyStateTitle>
                      <S.EmptyStateSubtitle>This asset has never been assigned to a job.</S.EmptyStateSubtitle>
                    </S.EmptyStateContainer>
                  ) : (
                    <Table<AssetHistoryRow>
                      columns={assetHistoryColumns}
                      data={history}
                      selectable={false}
                      showActions={false}
                      loading={false}
                      emptyMessage="No assignment history available."
                      rowsPerPage={20}
                      showPagination={true}
                    />
                  )}
                </Box>
              )}

              {/* Archived Assets Tab */}
              {activeTab === 'archives' && <AssetArchiveTab />}
            </S.TabContent>
          </S.DetailsSection>
        </S.DetailsGrid>
      </S.ContentContainer>
    </PageWrapper>
  );
};
