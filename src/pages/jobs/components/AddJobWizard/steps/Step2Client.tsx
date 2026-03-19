import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, mixed } from 'yup';
import { Box, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField, FormRow } from '../../../../../components/UI/FormComponents';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { Input } from '../../../../../components/UI/Forms/Input';
import { companyClientService } from '../../../../../services/api';
import type { ClientResponse } from '../../../../../services/api';
import type { WizardData } from '../AddJobWizard';

const step2Schema = object({
  clientMode: string().required(),
  clientId: mixed().when('clientMode', {
    is: 'select',
    then: () => mixed().notRequired(),
    otherwise: () => mixed().notRequired(),
  }),
  clientName: string().when('clientMode', {
    is: 'create',
    then: () =>
      string()
        .required('Client name is required')
        .min(2, 'Must be at least 2 characters')
        .max(150, 'Must be 150 characters or less'),
    otherwise: () => string().notRequired(),
  }),
  clientEmail: string().when('clientMode', {
    is: 'create',
    then: () => string().email('Must be a valid email address').notRequired(),
    otherwise: () => string().notRequired(),
  }),
  clientTelephone: string().max(20, 'Must be 20 characters or less').notRequired(),
  clientMobile: string().max(20, 'Must be 20 characters or less').notRequired(),
  clientAddress: string().max(255, 'Must be 255 characters or less').notRequired(),
});

type Step2FormData = {
  clientMode: 'select' | 'create';
  clientId?: { label: string; value: string } | null;
  clientName?: string;
  clientEmail?: string;
  clientTelephone?: string;
  clientMobile?: string;
  clientAddress?: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(step2Schema) as any,
    defaultValues: {
      clientMode: 'select',
      clientId: null,
      clientName: initialData.newClientData?.name ?? '',
      clientEmail: initialData.newClientData?.email ?? '',
      clientTelephone: initialData.newClientData?.telephone ?? '',
      clientMobile: initialData.newClientData?.mobile ?? '',
      clientAddress: initialData.newClientData?.address ?? '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const clientMode = watch('clientMode');

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
      if (match) {
        setValue('clientMode', 'select');
        setValue('clientId', match);
      }
    } else if (initialData.newClientData) {
      setValue('clientMode', 'create');
    }
  }, [loadingClients, clientOptions, initialData.clientId, initialData.newClientData, setValue]);

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit((data) => {
        const update: Partial<WizardData> = {};

        if (data.clientMode === 'select' && data.clientId) {
          update.clientId = Number((data.clientId as { value: string }).value);
          update.newClientData = undefined;
        } else if (data.clientMode === 'create' && data.clientName) {
          update.newClientData = {
            name: data.clientName,
            email: data.clientEmail || undefined,
            telephone: data.clientTelephone || undefined,
            mobile: data.clientMobile || undefined,
            address: data.clientAddress || undefined,
          };
          update.clientId = undefined;
        } else {
          // neither mode filled — proceed without a client
          update.clientId = undefined;
          update.newClientData = undefined;
        }

        onStepComplete(update);
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
          Associate a client with this job (optional).
        </Typography>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Client
          </Typography>

          <ToggleButtonGroup
            value={clientMode}
            exclusive
            onChange={(_, val) => val && setValue('clientMode', val)}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="select">Select Existing</ToggleButton>
            <ToggleButton value="create">Create New</ToggleButton>
          </ToggleButtonGroup>

          {clientMode === 'select' && (
            <FormField label="Client">
              {!loadingClients && clientOptions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No clients available. Switch to <strong>Create New</strong> to add one.
                </Typography>
              ) : (
                <Dropdown
                  name="clientId"
                  preFetchedOptions={clientOptions}
                  placeHolder="Select client (optional)"
                  isPreFetchLoading={loadingClients}
                  disablePortal={true}
                  fullWidth={true}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  error={errors.clientId as any}
                />
              )}
            </FormField>
          )}

          {clientMode === 'create' && (
            <>
              <FormField label="Client Name" required>
                <Input name="clientName" placeholder="Enter client name" hideErrorMessage={false} />
              </FormField>
              <FormRow>
                <FormField label="Email">
                  <Input name="clientEmail" placeholder="Enter email address" type="email" hideErrorMessage={false} />
                </FormField>
                <FormField label="Telephone">
                  <Input name="clientTelephone" placeholder="Enter telephone number" hideErrorMessage={false} />
                </FormField>
              </FormRow>
              <FormRow>
                <FormField label="Mobile">
                  <Input name="clientMobile" placeholder="Enter mobile number" hideErrorMessage={false} />
                </FormField>
                <FormField label="Address">
                  <Input name="clientAddress" placeholder="Enter address" hideErrorMessage={false} />
                </FormField>
              </FormRow>
            </>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
};
