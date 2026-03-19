import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField, FormRow } from '../../../../../components/UI/FormComponents';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { workerService, workflowService, assetService } from '../../../../../services/api';
import type { WorkerResponse, WorkflowResponse, AssetResponse } from '../../../../../services/api';
import type { WizardData } from '../AddJobWizard';

type Step3FormData = {
  assignedWorkerId?: { label: string; value: string } | null;
  workflowId?: { label: string; value: string } | null;
  assetIds?: Array<{ label: string; value: string }>;
};

interface Step3Props {
  onStepComplete: (data: Partial<WizardData>) => void;
  initialData: WizardData;
}

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

  const methods = useForm<Step3FormData>({
    defaultValues: {
      assignedWorkerId: null,
      workflowId: null,
      assetIds: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, setValue } = methods;

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

  const workerOptions = useMemo(
    () => workers.map((w) => ({ label: w.name || '', value: w.id?.toString() || '' })),
    [workers]
  );

  const workflowOptions = useMemo(
    () => workflows.map((w) => ({ label: w.name || '', value: w.id?.toString() || '' })),
    [workflows]
  );

  const assetOptions = useMemo(
    () => assets.map((a) => ({ label: a.name || '', value: a.id?.toString() || '' })),
    [assets]
  );

  // Pre-populate from initialData when options load
  useEffect(() => {
    if (!loadingWorkers && initialData.assignedWorkerId && workerOptions.length > 0) {
      const match = workerOptions.find((w) => w.value === initialData.assignedWorkerId?.toString());
      if (match) setValue('assignedWorkerId', match);
    }
  }, [loadingWorkers, workerOptions, initialData.assignedWorkerId, setValue]);

  useEffect(() => {
    if (!loadingWorkflows && initialData.workflowId && workflowOptions.length > 0) {
      const match = workflowOptions.find((w) => w.value === initialData.workflowId?.toString());
      if (match) setValue('workflowId', match);
    }
  }, [loadingWorkflows, workflowOptions, initialData.workflowId, setValue]);

  useEffect(() => {
    if (!loadingAssets && initialData.assetIds && initialData.assetIds.length > 0 && assetOptions.length > 0) {
      const matched = initialData.assetIds
        .map((id) => assetOptions.find((a) => a.value === id.toString()))
        .filter((a): a is { label: string; value: string } => !!a);
      if (matched.length > 0) setValue('assetIds', matched);
    }
  }, [loadingAssets, assetOptions, initialData.assetIds, setValue]);

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit((data) => {
        const workerIdNum = data.assignedWorkerId
          ? Number((data.assignedWorkerId as { value: string }).value)
          : undefined;
        const workflowIdNum = data.workflowId
          ? Number((data.workflowId as { value: string }).value)
          : undefined;
        const assetIdsArr = Array.isArray(data.assetIds)
          ? data.assetIds
              .map((a) => Number((a as { value: string }).value))
              .filter((n) => !isNaN(n))
          : [];

        onStepComplete({
          assignedWorkerId: workerIdNum,
          workflowId: workflowIdNum,
          assetIds: assetIdsArr.length > 0 ? assetIdsArr : undefined,
        });
        updateActiveScreen(activeScreen + 1);
      })();
    };
  }, [handleSubmit, onStepComplete, updateActiveScreen, activeScreen]);

  useEffect(() => {
    updateModalTitle('Assign Details');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Next' });
    setSkipResetModal?.(true);
    updateOnConfirm(() => onConfirmRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <FormRow>
          <FormField label="Assigned Worker">
            <Dropdown
              name="assignedWorkerId"
              preFetchedOptions={workerOptions}
              placeHolder={
                workerOptions.length === 0 && !loadingWorkers
                  ? 'No workers available'
                  : 'Select worker (optional)'
              }
              isPreFetchLoading={loadingWorkers}
              disablePortal={true}
              fullWidth={true}
              disabled={workerOptions.length === 0 && !loadingWorkers}
            />
          </FormField>

          <FormField label="Workflow">
            <Dropdown
              name="workflowId"
              preFetchedOptions={workflowOptions}
              placeHolder={
                workflowOptions.length === 0 && !loadingWorkflows
                  ? 'No workflows available'
                  : 'Select workflow (optional)'
              }
              isPreFetchLoading={loadingWorkflows}
              disablePortal={true}
              fullWidth={true}
              disabled={workflowOptions.length === 0 && !loadingWorkflows}
            />
          </FormField>
        </FormRow>

        <FormField label="Assets">
          <Dropdown
            name="assetIds"
            preFetchedOptions={assetOptions}
            placeHolder={
              assetOptions.length === 0 && !loadingAssets
                ? 'No available assets - all assets are currently in use'
                : 'Select assets (optional)'
            }
            isPreFetchLoading={loadingAssets}
            disablePortal={true}
            fullWidth={true}
            disabled={assetOptions.length === 0 && !loadingAssets}
            multiple={true}
            helperText={
              !loadingAssets && assetOptions.length === 0
                ? 'All assets are currently assigned to other jobs.'
                : undefined
            }
          />
        </FormField>
      </Box>
    </FormProvider>
  );
};
