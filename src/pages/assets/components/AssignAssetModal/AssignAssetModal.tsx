import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { assetService, workerService, AssetAssignmentCreateRequestExplicitLocationTypeEnum } from '../../../../services/api';
import type {
  AssetResponse,
  WorkerResponse,
  AddressRequest,
  AddressResponse,
  AssetAssignmentResponseLocationTypeEnum,
} from '../../../../services/api';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { Input } from '../../../../components/UI/Forms/Input';
import { FormField } from '../../../../components/UI/FormComponents';
import { Loader } from '../../../../components/UI';
import LocationMapField from '../../../jobs/components/JobFormFields/LocationMapField';
import * as S from './AssignAssetModal.styles';

export interface AssignAssetModalProps {
  jobId: number;
  onSuccess?: () => void;
  editAssignment?: {
    assignmentId: number;
    assetId: number;
    assetName: string;
    assignedWorkerId?: number;
    notes?: string;
    locationType?: AssetAssignmentResponseLocationTypeEnum;
    address?: AddressResponse;
    expectedDurationDays?: number;
  };
}

const LOCATION_TYPE_OPTIONS = [
  { label: "Job Site (uses the job's address)", value: AssetAssignmentCreateRequestExplicitLocationTypeEnum.JobSite },
  { label: "Warehouse (uses the asset's warehouse address)", value: AssetAssignmentCreateRequestExplicitLocationTypeEnum.Warehouse },
  { label: 'With Worker', value: AssetAssignmentCreateRequestExplicitLocationTypeEnum.WorkerLocation },
  { label: 'Custom Address', value: AssetAssignmentCreateRequestExplicitLocationTypeEnum.Custom },
];

export const AssignAssetModal: React.FC<AssignAssetModalProps> = ({ jobId, onSuccess, editAssignment }) => {
  const methods = useForm();
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } = useGlobalModalInnerContext();
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(editAssignment?.assetId || null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(editAssignment?.assignedWorkerId || null);
  const [notes, setNotes] = useState(editAssignment?.notes || '');
  const [locationType, setLocationType] = useState<AssetAssignmentCreateRequestExplicitLocationTypeEnum>(
    editAssignment?.locationType ?? AssetAssignmentCreateRequestExplicitLocationTypeEnum.JobSite
  );
  const [expectedDurationDays, setExpectedDurationDays] = useState<number | undefined>(
    editAssignment?.expectedDurationDays
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!editAssignment;
  const isCustomLocation = locationType === AssetAssignmentCreateRequestExplicitLocationTypeEnum.Custom;

  // Prefill the custom address fields once, when editing an assignment that already has one
  useEffect(() => {
    const addr = editAssignment?.address;
    if (!addr) return;
    methods.setValue(
      'customAddressStreet',
      [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean).join(', ')
    );
    methods.setValue('customAddressLatitude', addr.latitude ?? null);
    methods.setValue('customAddressLongitude', addr.longitude ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dropdown's displayed selection is driven by react-hook-form's own field state,
  // not by the `value` prop — push our state into the form so it renders selected.
  useEffect(() => {
    methods.setValue('assetId', selectedAssetId != null ? selectedAssetId.toString() : null);
  }, [selectedAssetId, methods]);

  useEffect(() => {
    methods.setValue('workerId', selectedWorkerId != null ? selectedWorkerId.toString() : null);
  }, [selectedWorkerId, methods]);

  useEffect(() => {
    methods.setValue('explicitLocationType', locationType);
  }, [locationType, methods]);

  // Use refs so the registered onConfirm callback always sees latest values
  const stateRef = useRef({
    selectedAssetId,
    selectedWorkerId,
    notes,
    locationType,
    expectedDurationDays,
    assets,
    jobId,
    onSuccess,
  });
  useEffect(() => {
    stateRef.current = {
      selectedAssetId,
      selectedWorkerId,
      notes,
      locationType,
      expectedDurationDays,
      assets,
      jobId,
      onSuccess,
    };
  }, [selectedAssetId, selectedWorkerId, notes, locationType, expectedDurationDays, assets, jobId, onSuccess]);

  // Set modal title, button text, and skip auto-close so we control closing after async success.
  // isConfirmDisabled blocks double-clicking "Assign" while the request is in flight — without
  // it, a second click before the first request resolves would double-submit the assignment.
  useEffect(() => {
    updateModalTitle(isEditMode ? 'Edit Assignment' : 'Assign Asset to Job');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: submitting
        ? isEditMode
          ? 'Saving...'
          : 'Assigning...'
        : isEditMode
          ? 'Save Changes'
          : 'Assign Asset',
      isConfirmDisabled: submitting,
    });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal, isEditMode, submitting]);

  // Register the confirm handler once; it reads latest values via ref
  useEffect(() => {
    updateOnConfirm(async () => {
      const { selectedAssetId, selectedWorkerId, notes, locationType, expectedDurationDays, assets, jobId, onSuccess } =
        stateRef.current;

      if (!selectedAssetId && !isEditMode) {
        showError('Please select an asset');
        return;
      }

      // Only Custom needs an address from the user — Warehouse/Job Site/Worker are resolved server-side
      let customAddress: AddressRequest | undefined;
      if (locationType === AssetAssignmentCreateRequestExplicitLocationTypeEnum.Custom) {
        const values = methods.getValues();
        const addr: AddressRequest = {
          ...(values.customAddressStreet && { street: values.customAddressStreet }),
          ...(values.customAddressCity && { city: values.customAddressCity }),
          ...(values.customAddressState && { state: values.customAddressState }),
          ...(values.customAddressPostalCode && { postalCode: values.customAddressPostalCode }),
          ...(values.customAddressCountry && { country: values.customAddressCountry }),
          ...(values.customAddressLatitude != null && { latitude: values.customAddressLatitude }),
          ...(values.customAddressLongitude != null && { longitude: values.customAddressLongitude }),
        };
        if (Object.keys(addr).length > 0) customAddress = addr;
      }

      try {
        setSubmitting(true);
        if (isEditMode && editAssignment) {
          await assetService.updateAssignment(editAssignment.assignmentId, {
            assignedWorkerId: selectedWorkerId || undefined,
            notes: notes || undefined,
            explicitLocationType: locationType,
            expectedDurationDays: expectedDurationDays ?? undefined,
            ...(customAddress && { customAddress }),
          });
          showSuccess('Assignment updated successfully');
        } else {
          await assetService.assignAsset({
            assetId: selectedAssetId!,
            jobId,
            assignedWorkerId: selectedWorkerId || undefined,
            notes: notes || undefined,
            explicitLocationType: locationType,
            expectedDurationDays: expectedDurationDays ?? undefined,
            ...(customAddress && { customAddress }),
          });

          const selectedAsset = assets.find((a) => a.id === selectedAssetId);
          showSuccess(`${selectedAsset?.name || 'Asset'} assigned successfully`);
        }
        onSuccess?.();
      } catch (error) {
        console.error('Error assigning/updating asset:', error);
        showError(extractErrorMessage(error, `Failed to ${isEditMode ? 'update' : 'assign'} asset`));
      } finally {
        setSubmitting(false);
      }
    });
  }, [updateOnConfirm, showSuccess, showError, isEditMode, editAssignment]);

  // Fetch available assets and workers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!isEditMode) {
          const assetsResponse = await assetService.getAllAssets(0, 100, false, true);
          const assetsData = assetsResponse.data.content
            ? Array.isArray(assetsResponse.data.content)
              ? assetsResponse.data.content
              : []
            : [];
          setAssets(assetsData);
        }

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
  }, [showError, isEditMode]);

  const assetOptions = useMemo(() => {
    if (isEditMode && editAssignment) {
      return [{ label: editAssignment.assetName, value: editAssignment.assetId.toString() }];
    }
    return assets.map((asset) => ({
      label: `${asset.name}${asset.assetTag ? ` (${asset.assetTag})` : ''}`,
      value: asset.id?.toString() || '',
    }));
  }, [assets, isEditMode, editAssignment]);

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

  if (!isEditMode && assets.length === 0) {
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
        <FormField label="Asset" required>
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
            disabled={submitting || isEditMode}
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

        <FormField label="Asset Location">
          <S.LocationFieldWrapper>
            <Dropdown
              name="explicitLocationType"
              preFetchedOptions={LOCATION_TYPE_OPTIONS}
              placeHolder="Select location"
              value={locationType}
              onChange={(value) => {
                setLocationType(value as AssetAssignmentCreateRequestExplicitLocationTypeEnum);
              }}
              disablePortal={true}
              fullWidth={true}
              disabled={submitting}
            />
            <S.LocationHint variant="caption">
              Job Site and Warehouse addresses are resolved automatically — only Custom needs an address below.
            </S.LocationHint>
          </S.LocationFieldWrapper>
        </FormField>

        {isCustomLocation && (
          <FormField label="Custom Address">
            <LocationMapField namePrefix="customAddress" />
          </FormField>
        )}

        <FormField label="Expected Duration (Days) (Optional)">
          <Input
            type="number"
            name="expectedDurationDays"
            placeholder="e.g. 7"
            defaultValue={editAssignment?.expectedDurationDays}
            onChange={(e) => {
              const raw = e.target.value;
              setExpectedDurationDays(raw === '' ? undefined : Number(raw));
            }}
            hideErrorMessage={false}
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
