import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { workerService, workflowService, assetService } from '../../../../../services/api';
import type { WorkerResponse, WorkflowResponse, AssetResponse } from '../../../../../services/api';
import type { WizardData } from '../AddJobWizard';
import GoogleMap from '../../../../../components/UI/GoogleMap/GoogleMap';
import type { PlaceDetails } from '../../../../../components/UI/GoogleMap';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '../../../../../config/googleMaps';

interface Step3Props {
  onStepComplete: (data: Partial<WizardData>) => void;
  initialData: WizardData;
}

interface SelectableBoxProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}

const SelectableItem: React.FC<SelectableBoxProps> = ({ label, sublabel, selected, onClick }) => (
  <Chip
    label={
      sublabel ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.25 }}>
          <Typography variant="caption" fontWeight={600} lineHeight={1.3}>{label}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.65rem' }}>{sublabel}</Typography>
        </Box>
      ) : label
    }
    onClick={onClick}
    variant={selected ? 'filled' : 'outlined'}
    color={selected ? 'primary' : 'default'}
    sx={{
      height: 'auto',
      borderRadius: 1.5,
      cursor: 'pointer',
      fontWeight: selected ? 700 : 400,
      transition: 'all 0.15s ease',
      ...(selected && {
        boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
      }),
    }}
  />
);

interface SelectableSectionProps {
  label: string;
  loading: boolean;
  emptyMessage: string;
  children: React.ReactNode;
  isEmpty: boolean;
}

const SelectableSection: React.FC<SelectableSectionProps> = ({
  label,
  loading,
  emptyMessage,
  children,
  isEmpty,
}) => (
  <Box>
    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
      {label}
    </Typography>
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
        minHeight: 64,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: isEmpty || loading ? 'center' : 'flex-start',
        justifyContent: isEmpty || loading ? 'center' : 'flex-start',
      }}
    >
      {loading ? (
        <Typography variant="body2" color="text.disabled">Loading…</Typography>
      ) : isEmpty ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', px: 1 }}>
          {emptyMessage}
        </Typography>
      ) : (
        children
      )}
    </Box>
  </Box>
);

export const Step3AssignDetails: React.FC<Step3Props> = ({ onStepComplete, initialData }) => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnConfirm,
    setSkipResetModal,
    updateActiveScreen,
    activeScreen,
  } = useGlobalModalInnerContext();

  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [selectedWorkerId, setSelectedWorkerId] = useState<number | undefined>(initialData.assignedWorkerId);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | undefined>(initialData.workflowId);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>(initialData.assetIds ?? []);

  // Selected location from the map search
  const [selectedLocation, setSelectedLocation] = useState<PlaceDetails | null>(
    initialData.address
      ? {
          address: initialData.address.fullAddress,
          location: {
            lat: initialData.address.latitude ?? GOOGLE_MAPS_CONFIG.defaultCenter.lat,
            lng: initialData.address.longitude ?? GOOGLE_MAPS_CONFIG.defaultCenter.lng,
          },
        }
      : null
  );

  const mapCenter = selectedLocation?.location ?? GOOGLE_MAPS_CONFIG.defaultCenter;
  const mapZoom = selectedLocation ? 15 : GOOGLE_MAPS_CONFIG.defaultZoom;

  const handleLocationSelect = (place: PlaceDetails) => {
    setSelectedLocation(place);
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoadingWorkers(true);
        const resp = await workerService.getAllWorkers();
        setWorkers(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoadingWorkers(false);
      }
    };

    const fetchWorkflows = async () => {
      try {
        setLoadingWorkflows(true);
        const resp = await workflowService.getAllWorkflows();
        setWorkflows(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching workflows:', error);
      } finally {
        setLoadingWorkflows(false);
      }
    };

    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const resp = await assetService.getAllAssets(0, 100, false, true);
        const assetsData = resp.data.content || [];
        const available = assetsData.filter(
          (a: AssetResponse) => a.available === true && a.archived !== true
        );
        setAssets(available);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchWorkers();
    fetchWorkflows();
    fetchAssets();
  }, []);

  const workerOptions = useMemo(() => workers.map((w) => ({ label: w.name || '', id: w.id! })), [workers]);
  const workflowOptions = useMemo(() => workflows.map((w) => ({ label: w.name || '', id: w.id! })), [workflows]);
  const assetOptions = useMemo(() => assets.map((a) => ({ label: a.name || '', id: a.id! })), [assets]);

  const handleWorkerClick = (id: number) => setSelectedWorkerId((prev) => (prev === id ? undefined : id));
  const handleWorkflowClick = (id: number) => setSelectedWorkflowId((prev) => (prev === id ? undefined : id));
  const handleAssetClick = (id: number) =>
    setSelectedAssetIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      onStepComplete({
        assignedWorkerId: selectedWorkerId,
        workflowId: selectedWorkflowId,
        assetIds: selectedAssetIds.length > 0 ? selectedAssetIds : undefined,
        address: selectedLocation
          ? {
              fullAddress: selectedLocation.address,
              latitude: selectedLocation.location.lat,
              longitude: selectedLocation.location.lng,
            }
          : undefined,
      });
      updateActiveScreen(activeScreen + 1);
    };
  }, [selectedWorkerId, selectedWorkflowId, selectedAssetIds, selectedLocation, onStepComplete, updateActiveScreen, activeScreen]);

  useEffect(() => {
    updateModalTitle('Assign Details');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Next' });
    setSkipResetModal?.(true);
    updateOnConfirm(() => onConfirmRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      <SelectableSection
        label="Assign Worker"
        loading={loadingWorkers}
        isEmpty={!loadingWorkers && workerOptions.length === 0}
        emptyMessage="No workers found. Add workers from the Workers section, or continue without assigning one."
      >
        {workerOptions.map((w) => (
          <SelectableItem key={w.id} label={w.label} selected={selectedWorkerId === w.id} onClick={() => handleWorkerClick(w.id)} />
        ))}
      </SelectableSection>

      <SelectableSection
        label="Workflow"
        loading={loadingWorkflows}
        isEmpty={!loadingWorkflows && workflowOptions.length === 0}
        emptyMessage="No workflows found. Create a workflow from the Workflows section, or continue without one."
      >
        {workflowOptions.map((w) => (
          <SelectableItem key={w.id} label={w.label} selected={selectedWorkflowId === w.id} onClick={() => handleWorkflowClick(w.id)} />
        ))}
      </SelectableSection>

      <SelectableSection
        label="Assets"
        loading={loadingAssets}
        isEmpty={!loadingAssets && assetOptions.length === 0}
        emptyMessage="All assets are currently assigned to other jobs, or none have been created yet."
      >
        {assetOptions.map((a) => (
          <SelectableItem key={a.id} label={a.label} selected={selectedAssetIds.includes(a.id)} onClick={() => handleAssetClick(a.id)} />
        ))}
      </SelectableSection>

      {/* Location — search address and pin it on the map */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Location
        </Typography>

        {isGoogleMapsConfigured() ? (
          <Box sx={{ height: 300, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <GoogleMap
              center={mapCenter}
              zoom={mapZoom}
              markers={selectedLocation ? [selectedLocation] : []}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              showSearchBox
              height="300px"
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Google Maps API key not configured.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
