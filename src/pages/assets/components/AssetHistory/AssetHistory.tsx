import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import { assetService } from '../../../../services/api';
import type { AssetAssignmentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI';
import { Box, Typography } from '@mui/material';
import { assetHistoryColumns, type AssetHistoryRow } from './DataColumn';

export const AssetHistory: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [history, setHistory] = useState<AssetHistoryRow[]>([]);
  const [assetName, setAssetName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch asset history
  const fetchHistory = useCallback(async () => {
    if (!assetId) return;

    try {
      setLoading(true);

      // Fetch asset details for name
      const assetResponse = await assetService.getAssetById(Number(assetId));
      setAssetName(assetResponse.data.name || `Asset #${assetId}`);

      // Fetch assignment history
      const historyResponse = await assetService.getAssetHistory(Number(assetId));
      const historyData = Array.isArray(historyResponse.data) ? historyResponse.data : [];

      // Transform to table format
      const transformedData: AssetHistoryRow[] = historyData.map((assignment: AssetAssignmentResponse) => ({
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
      console.error('Error fetching asset history:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load asset history';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [assetId, showError]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return <Loader />;
  }

  return (
    <PageWrapper
      title={`Assignment History - ${assetName}`}
      description="View all assignments and returns for this asset."
      actions={[
        {
          label: 'Back to Assets',
          onClick: () => navigate('/company/assets'),
          variant: 'outlined',
        },
      ]}
    >
      {history.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No assignment history found for this asset.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This asset has never been assigned to a job.
          </Typography>
        </Box>
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
    </PageWrapper>
  );
};
