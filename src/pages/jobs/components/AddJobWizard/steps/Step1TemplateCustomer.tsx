import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, mixed } from 'yup';
import { Box, Divider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FormField, FormRow } from '../../../../../components/UI/FormComponents';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { Input } from '../../../../../components/UI/Forms/Input';
import { jobTemplateService, customerService } from '../../../../../services/api';
import type { JobTemplateResponse, CustomerResponse } from '../../../../../services/api';
import type { WizardData } from '../AddJobWizard';

const step1Schema = object({
  templateId: object().required('Please select a template'),
  customerMode: string().required(),
  customerId: mixed().when('customerMode', {
    is: 'select',
    then: () => object().required('Please select a customer'),
    otherwise: () => mixed().notRequired(),
  }),
  customerName: string().when('customerMode', {
    is: 'create',
    then: () =>
      string()
        .required('Customer name is required')
        .min(2, 'Must be at least 2 characters')
        .max(150, 'Must be 150 characters or less'),
    otherwise: () => string().notRequired(),
  }),
  customerEmail: string().when('customerMode', {
    is: 'create',
    then: () => string().email('Must be a valid email address').notRequired(),
    otherwise: () => string().notRequired(),
  }),
  customerTelephone: string().max(20, 'Must be 20 characters or less').notRequired(),
  customerMobile: string().max(20, 'Must be 20 characters or less').notRequired(),
  customerStreet: string().max(255, 'Must be 255 characters or less').notRequired(),
  customerCity: string().max(100, 'Must be 100 characters or less').notRequired(),
  customerPostalCode: string().max(20, 'Must be 20 characters or less').notRequired(),
  customerCountry: string().max(100, 'Must be 100 characters or less').notRequired(),
});

type Step1FormData = {
  templateId: { label: string; value: string } | null;
  customerMode: 'select' | 'create';
  customerId?: { label: string; value: string } | null;
  customerName?: string;
  customerEmail?: string;
  customerTelephone?: string;
  customerMobile?: string;
  customerStreet?: string;
  customerCity?: string;
  customerPostalCode?: string;
  customerCountry?: string;
};

interface Step1Props {
  onStepComplete: (data: Partial<WizardData>) => void;
  initialData: WizardData;
}

export const Step1TemplateCustomer: React.FC<Step1Props> = ({ onStepComplete, initialData }) => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnConfirm,
    setSkipResetModal,
    updateActiveScreen,
    activeScreen,
  } = useGlobalModalInnerContext();

  const [templates, setTemplates] = useState<JobTemplateResponse[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const methods = useForm<Step1FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(step1Schema) as any,
    defaultValues: {
      templateId: null,
      customerMode: 'select',
      customerId: null,
      customerName: initialData.newCustomerData?.name ?? '',
      customerEmail: initialData.newCustomerData?.email ?? '',
      customerTelephone: initialData.newCustomerData?.telephone ?? '',
      customerMobile: initialData.newCustomerData?.mobile ?? '',
      customerStreet: initialData.newCustomerData?.street ?? '',
      customerCity: initialData.newCustomerData?.city ?? '',
      customerPostalCode: initialData.newCustomerData?.postalCode ?? '',
      customerCountry: initialData.newCustomerData?.country ?? '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, setValue, formState: { errors } } = methods;
  const customerMode = watch('customerMode');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const resp = await jobTemplateService.getAllTemplates();
        setTemplates(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const resp = await customerService.getAllCustomers();
        setCustomers(Array.isArray(resp.data) ? resp.data : []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchTemplates();
    fetchCustomers();
  }, []);

  const templateOptions = useMemo(
    () => templates.map((t) => ({ label: t.name || '', value: t.id?.toString() || '' })),
    [templates]
  );

  const customerOptions = useMemo(
    () => customers.map((c) => ({ label: c.name || '', value: c.id?.toString() || '' })),
    [customers]
  );

  // Pre-populate template: use initialData if going back, otherwise use default template
  useEffect(() => {
    if (loadingTemplates || templateOptions.length === 0) return;

    if (initialData.templateId) {
      const match = templateOptions.find((t) => t.value === initialData.templateId?.toString());
      if (match) setValue('templateId', match);
    } else {
      const defaultTemplate = templates.find((t) => t.default === true);
      if (defaultTemplate) {
        const match = templateOptions.find((t) => t.value === defaultTemplate.id?.toString());
        if (match) setValue('templateId', match);
      }
    }
  }, [loadingTemplates, templateOptions, templates, initialData.templateId, setValue]);

  // Pre-populate customer from initialData when options load
  useEffect(() => {
    if (!loadingCustomers && initialData.customerId && customerOptions.length > 0) {
      const match = customerOptions.find((c) => c.value === initialData.customerId?.toString());
      if (match) {
        setValue('customerMode', 'select');
        setValue('customerId', match);
      }
    } else if (initialData.newCustomerData) {
      setValue('customerMode', 'create');
    }
  }, [loadingCustomers, customerOptions, initialData.customerId, initialData.newCustomerData, setValue]);

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit((data) => {
        const templateIdNum = Number((data.templateId as { value: string }).value);
        const update: Partial<WizardData> = { templateId: templateIdNum };

        if (data.customerMode === 'select' && data.customerId) {
          update.customerId = Number((data.customerId as { value: string }).value);
          update.newCustomerData = undefined;
        } else if (data.customerMode === 'create') {
          update.newCustomerData = {
            name: data.customerName!,
            email: data.customerEmail || undefined,
            telephone: data.customerTelephone || undefined,
            mobile: data.customerMobile || undefined,
            street: data.customerStreet || undefined,
            city: data.customerCity || undefined,
            postalCode: data.customerPostalCode || undefined,
            country: data.customerCountry || undefined,
          };
          update.customerId = undefined;
        }

        onStepComplete(update);
        updateActiveScreen(activeScreen + 1);
      })();
    };
  }, [handleSubmit, onStepComplete, updateActiveScreen, activeScreen]);

  // Wire modal on mount
  useEffect(() => {
    updateModalTitle('Select Template & Customer');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Next' });
    setSkipResetModal?.(true);
    updateOnConfirm(() => onConfirmRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <FormField label="Template" required>
          <Dropdown
            name="templateId"
            preFetchedOptions={templateOptions}
            placeHolder="Choose a job template"
            isPreFetchLoading={loadingTemplates}
            disablePortal={true}
            fullWidth={true}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error={errors.templateId as any}
          />
        </FormField>

        <Divider />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Customer
          </Typography>

          <ToggleButtonGroup
            value={customerMode}
            exclusive
            onChange={(_, val) => val && setValue('customerMode', val)}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="select">Select Existing</ToggleButton>
            <ToggleButton value="create">Create New</ToggleButton>
          </ToggleButtonGroup>

          {customerMode === 'select' && (
            <FormField label="Customer" required>
              <Dropdown
                name="customerId"
                preFetchedOptions={customerOptions}
                placeHolder="Select customer"
                isPreFetchLoading={loadingCustomers}
                disablePortal={true}
                fullWidth={true}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error={errors.customerId as any}
              />
            </FormField>
          )}

          {customerMode === 'create' && (
            <>
              <FormField label="Customer Name" required>
                <Input name="customerName" placeholder="Enter customer name" hideErrorMessage={false} />
              </FormField>
              <FormRow>
                <FormField label="Email">
                  <Input name="customerEmail" placeholder="Enter email address" type="email" hideErrorMessage={false} />
                </FormField>
                <FormField label="Telephone">
                  <Input name="customerTelephone" placeholder="Enter telephone number" hideErrorMessage={false} />
                </FormField>
              </FormRow>
              <FormRow>
                <FormField label="Mobile">
                  <Input name="customerMobile" placeholder="Enter mobile number" hideErrorMessage={false} />
                </FormField>
                <FormField label="Street">
                  <Input name="customerStreet" placeholder="Enter street" hideErrorMessage={false} />
                </FormField>
              </FormRow>
              <FormRow>
                <FormField label="City">
                  <Input name="customerCity" placeholder="Enter city" hideErrorMessage={false} />
                </FormField>
                <FormField label="Postal Code">
                  <Input name="customerPostalCode" placeholder="Enter postal code" hideErrorMessage={false} />
                </FormField>
              </FormRow>
              <FormField label="Country">
                <Input name="customerCountry" placeholder="Enter country" hideErrorMessage={false} />
              </FormField>
            </>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
};
