import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { assetService, workerService } from '../../../../services/api';
import type { AssetResponse, WorkerResponse } from '../../../../services/api';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { FormField } from '../../../../components/UI/FormComponents';
import { Loader } from '../../../../components/UI';

export interface AssignAssetModalProps {
  jobId: number;
  onSuccess?: () => void;
}

export const AssignAssetModal: React.FC<AssignAssetModalProps> = ({ jobId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, triggerSubmit } = useGlobalModalInnerContext();
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Set modal title and button
  useEffect(() => {
    updateModalTitle('Assign Asset to Job');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Assign Asset',
    });
  }, [updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch available assets and workers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch only available (not archived, not assigned) assets
        const assetsResponse = await assetService.getAllAssets(0, 100, false, true);
        const assetsData = assetsResponse.data.content ? Array.isArray(assetsResponse.data.content) ? assetsResponse.data.content : [] : [];
        setAssets(assetsData);

        // Fetch workers
        const workersResponse = await workerService.getAllWorkers();
        const workersData = Array.isArray(workersResponse.data) ? workersResponse.data : [];
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load assets and workers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showError]);

  // Handle submit via modal trigger
  useEffect(() => {
    const handleSubmit = async () => {
      if (!selectedAssetId) {
        showError('Please select an asset');
        return;
      }

      try {
        setSubmitting(true);

        await assetService.assignAsset({
          assetId: selectedAssetId,
          jobId,
          assignedWorkerId: selectedWorkerId || undefined,
          notes: notes || undefined,
        });

        const selectedAsset = assets.find(a => a.id === selectedAssetId);
        showSuccess(`${selectedAsset?.name || 'Asset'} assigned successfully`);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error assigning asset:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to assign asset';
        showError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    };

    if (triggerSubmit) {
      handleSubmit();
    }
  }, [triggerSubmit, selectedAssetId, jobId, selectedWorkerId, notes, assets, showSuccess, showError, onSuccess]);

  // Asset options for dropdown
  const assetOptions = useMemo(
    () =>
      assets.map((asset) => ({
        label: `${asset.name}${asset.assetTag ? ` (${asset.assetTag})` : ''}`,
        value: asset.id?.toString() || '',
      })),
    [assets]
  );

  // Worker options for dropdown
  const workerOptions = useMemo(
    () =>
      workers.map((worker) => ({
        label: worker.name || '',
        value: worker.id?.toString() || '',
      })),
    [workers]
  );

  if (loading) {
    return <Loader />;
  }

  if (assets.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No available assets to assign. All assets are either in use or archived.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormField label="Select Asset" required>
        <Dropdown
          name="assetId"
          preFetchedOptions={assetOptions}
          placeHolder="Select an asset"
          value={selectedAssetId ? { label: '', value: selectedAssetId.toString() } : null}
          onChange={(value) => {
            const assetId = typeof value === 'object' && value && 'value' in value ? parseInt(value.value) : null;
            setSelectedAssetId(assetId);
          }}
          disablePortal={true}
          fullWidth={true}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Assign to Worker (Optional)">
        <Dropdown
          name="workerId"
          preFetchedOptions={workerOptions}
          placeHolder="Select a worker (optional)"
          value={selectedWorkerId ? { label: '', value: selectedWorkerId.toString() } : null}
          onChange={(value) => {
            const workerId = typeof value === 'object' && value && 'value' in value ? parseInt(value.value) : null;
            setSelectedWorkerId(workerId);
          }}
          disablePortal={true}
          fullWidth={true}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Notes (Optional)">
        <TextArea
          name="notes"
          placeholder="Add any notes about this assignment..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          disabled={submitting}
        />
      </FormField>
    </Box>
  );
};
