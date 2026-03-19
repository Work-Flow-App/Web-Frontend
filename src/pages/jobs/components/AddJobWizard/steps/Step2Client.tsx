import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField } from '../../../../../components/UI/FormComponents';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { companyClientService } from '../../../../../services/api';
import type { ClientResponse } from '../../../../../services/api';
import type { WizardData } from '../AddJobWizard';

type Step2FormData = {
  clientId?: { label: string; value: string } | null;
};

interface Step2Props {
  onStepComplete: (data: Partial<WizardData>) => void;
  initialData: WizardData;
}

export const Step2Client: React.FC<Step2Props> = ({ onStepComplete, initialData }) => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnConfirm,
    setSkipResetModal,
    updateActiveScreen,
    activeScreen,
  } = useGlobalModalInnerContext();

  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const methods = useForm<Step2FormData>({
    defaultValues: { clientId: null },
    mode: 'onChange',
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const resp = await companyClientService.getAllClients();
        setClients(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchClients();
  }, []);

  const clientOptions = useMemo(
    () => clients.map((c) => ({ label: c.name || '', value: c.id?.toString() || '' })),
    [clients]
  );

  // Pre-populate from initialData when options load
  useEffect(() => {
    if (!loadingClients && initialData.clientId && clientOptions.length > 0) {
      const match = clientOptions.find((c) => c.value === initialData.clientId?.toString());
      if (match) setValue('clientId', match);
    }
  }, [loadingClients, clientOptions, initialData.clientId, setValue]);

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit((data) => {
        const clientIdNum =
          data.clientId ? Number((data.clientId as { value: string }).value) : undefined;
        onStepComplete({ clientId: clientIdNum });
        updateActiveScreen(activeScreen + 1);
      })();
    };
  }, [handleSubmit, onStepComplete, updateActiveScreen, activeScreen]);

  useEffect(() => {
    updateModalTitle('Select Client');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Next' });
    setSkipResetModal?.(true);
    updateOnConfirm(() => onConfirmRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Typography variant="body2" color="text.secondary">
          Select a client to associate with this job (optional).
        </Typography>
        <FormField label="Client">
          <Dropdown
            name="clientId"
            preFetchedOptions={clientOptions}
            placeHolder={
              clientOptions.length === 0 && !loadingClients
                ? 'No clients available'
                : 'Select client (optional)'
            }
            isPreFetchLoading={loadingClients}
            disablePortal={true}
            fullWidth={true}
            disabled={clientOptions.length === 0 && !loadingClients}
          />
        </FormField>
      </Box>
    </FormProvider>
  );
};
