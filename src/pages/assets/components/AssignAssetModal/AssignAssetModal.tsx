import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
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
  const methods = useForm();
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } = useGlobalModalInnerContext();
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Use refs so the registered onConfirm callback always sees latest values
  const stateRef = useRef({ selectedAssetId, selectedWorkerId, notes, assets, jobId, onSuccess });
  useEffect(() => {
    stateRef.current = { selectedAssetId, selectedWorkerId, notes, assets, jobId, onSuccess };
  }, [selectedAssetId, selectedWorkerId, notes, assets, jobId, onSuccess]);

  // Set modal title, button text, and skip auto-close so we control closing after async success
  useEffect(() => {
    updateModalTitle('Assign Asset to Job');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Assign Asset' });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal]);

  // Register the confirm handler once; it reads latest values via ref
  useEffect(() => {
    updateOnConfirm(async () => {
      const { selectedAssetId, selectedWorkerId, notes, assets, jobId, onSuccess } = stateRef.current;

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

        const selectedAsset = assets.find((a) => a.id === selectedAssetId);
        showSuccess(`${selectedAsset?.name || 'Asset'} assigned successfully`);
        onSuccess?.();
      } catch (error) {
        console.error('Error assigning asset:', error);
        showError(extractErrorMessage(error, 'Failed to assign asset'));
      } finally {
        setSubmitting(false);
      }
    });
  }, [updateOnConfirm, showSuccess, showError]);

  // Fetch available assets and workers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const assetsResponse = await assetService.getAllAssets(0, 100, false, true);
        const assetsData = assetsResponse.data.content
          ? Array.isArray(assetsResponse.data.content)
            ? assetsResponse.data.content
            : []
          : [];
        setAssets(assetsData);

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

  const assetOptions = useMemo(
    () =>
      assets.map((asset) => ({
        label: `${asset.name}${asset.assetTag ? ` (${asset.assetTag})` : ''}`,
        value: asset.id?.toString() || '',
      })),
    [assets]
  );

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
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormField label="Select Asset" required>
          <Dropdown
            name="assetId"
            preFetchedOptions={assetOptions}
            placeHolder="Select an asset"
            value={selectedAssetId ? selectedAssetId.toString() : undefined}
            onChange={(value) => {
              setSelectedAssetId(value ? parseInt(value as string) : null);
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
            value={selectedWorkerId ? selectedWorkerId.toString() : undefined}
            onChange={(value) => {
              setSelectedWorkerId(value ? parseInt(value as string) : null);
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
    </FormProvider>
  );
};
