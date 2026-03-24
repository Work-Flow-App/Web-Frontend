import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useForm, FormProvider, useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { companyClientService } from '../../../../../services/api';
import type { JobResponse, ClientResponse, LineItemResponse } from '../../../../../services/api';
import { FormField } from '../../../../../components/UI/FormComponents';
import { Input } from '../../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../../components/UI/Forms/Dropdown';
import { IconButton } from '../../../../../components/UI/Button/IconButton';
import { Button } from '../../../../../components/UI/Button';
import { Loader } from '../../../../../components/UI/Loader/Loader';

const VAT_OPTIONS = [
  { label: '0%', value: '0' },
  { label: '5%', value: '5' },
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
];

const DEFAULT_VAT = { label: '0%', value: '0' };

type DropdownValue = { label: string; value: string };

type ServiceRow = {
  service: DropdownValue | null;
  qty: string;
  price: string;
  vatRate: DropdownValue;
};

type FormValues = {
  clientId: DropdownValue | null;
  rows: ServiceRow[];
};

const defaultRow: ServiceRow = {
  service: null,
  qty: '1',
  price: '0',
  vatRate: DEFAULT_VAT,
};

const fmt = (v: number) => `£${v.toFixed(2)}`;

const resolveVat = (vatRate?: number): DropdownValue => {
  const vatStr = String(Math.round(vatRate || 0));
  return VAT_OPTIONS.find((o) => o.value === vatStr) || { label: `${vatStr}%`, value: vatStr };
};

// Build VAT options for a row, adding the actual rate if it's non-standard
const getVatOptions = (vatRate?: number) => {
  if (!vatRate) return VAT_OPTIONS;
  const vatStr = String(Math.round(vatRate));
  if (VAT_OPTIONS.some((o) => o.value === vatStr)) return VAT_OPTIONS;
  const custom = { label: `${vatStr}%`, value: vatStr };
  return [...VAT_OPTIONS, custom].sort((a, b) => Number(a.value) - Number(b.value));
};

const buildRowsFromLineItems = (items: LineItemResponse[]): ServiceRow[] =>
  items.map((item) => ({
    service: {
      label: item.productDescription || item.productCode || '',
      value: String(item.id ?? item.productCode ?? ''),
    },
    qty: String(item.quantity || 1),
    price: String(item.unitPrice || 0),
    vatRate: resolveVat(item.vatRate),
  }));

// Reactive per-row total — uses same rows-array watch as InvoiceTotals (avoids FieldPath template literal issues)
const RowTotal: React.FC<{ index: number; control: Control<FormValues> }> = ({
  index,
  control,
}) => {
  const rows = (useWatch({ control, name: 'rows' }) as ServiceRow[]) || [];
  const row = rows[index];
  const total = row
    ? (parseFloat(row.qty) || 0) *
      (parseFloat(row.price) || 0) *
      (1 + (parseFloat(row.vatRate?.value) || 0) / 100)
    : 0;
  return (
    <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
      {fmt(total)}
    </Typography>
  );
};

// Reactive summary totals
const InvoiceTotals: React.FC<{ control: Control<FormValues> }> = ({ control }) => {
  const rows = (useWatch({ control, name: 'rows' }) as ServiceRow[]) || [];
  const subtotal = rows.reduce(
    (s, r) => s + (parseFloat(r.qty) || 0) * (parseFloat(r.price) || 0),
    0
  );
  const totalVat = rows.reduce(
    (s, r) =>
      s +
      (parseFloat(r.qty) || 0) *
        (parseFloat(r.price) || 0) *
        ((parseFloat(r.vatRate?.value) || 0) / 100),
    0
  );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        Subtotal: {fmt(subtotal)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        VAT: {fmt(totalVat)}
      </Typography>
      <Typography variant="body1" fontWeight={700}>
        Total: {fmt(subtotal + totalVat)}
      </Typography>
    </Box>
  );
};

export interface CreateInvoiceModalProps {
  job: JobResponse;
  lineItems?: LineItemResponse[];
  onSuccess: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  job,
  lineItems,
  onSuccess,
}) => {
  const { showError, showSuccess } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const methods = useForm<FormValues>({
    defaultValues: {
      clientId: null,
      rows:
        lineItems && lineItems.length > 0
          ? buildRowsFromLineItems(lineItems)
          : [{ ...defaultRow }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'rows' });

  const formRef = useRef(methods);
  formRef.current = methods;

  // Modal title & button
  useEffect(() => {
    updateModalTitle('Create Invoice');
    updateGlobalModalInnerConfig({ confirmModalButtonText: 'Generate Invoice' });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal]);

  // Fetch clients and pre-select if job already has one
  useEffect(() => {
    companyClientService
      .getAllClients()
      .then((res) => {
        const data = (res.data as ClientResponse[]) || [];
        setClients(data);
        if (job.clientId) {
          const match = data.find((c) => c.id === job.clientId);
          if (match) {
            formRef.current.setValue('clientId', {
              label: match.name || '',
              value: String(match.id),
            });
          }
        }
      })
      .catch(() => showError('Failed to load clients'))
      .finally(() => setLoading(false));
  }, [job.clientId, showError]);

  // Confirm / Generate Invoice
  useEffect(() => {
    updateOnConfirm(() => {
      const values = formRef.current.getValues();

      if (!values.clientId?.value) {
        showError('Please select a client');
        return;
      }
      if (!values.rows.some((r) => r.service?.label?.trim())) {
        showError('Please add at least one service');
        return;
      }

      // TODO: call invoiceService.create(...) when the API is available
      showSuccess('Invoice generated successfully');
      onSuccess();
    });
  }, [updateOnConfirm, showError, showSuccess, onSuccess]);

  // Auto-fill qty / price / vatRate when user picks a service from the dropdown
  const handleServiceChange = (index: number, value: string | number) => {
    const item = lineItems?.find(
      (li) => String(li.id) === String(value) || li.productCode === String(value)
    );
    if (item) {
      methods.setValue(`rows.${index}.qty`, String(item.quantity || 1));
      methods.setValue(`rows.${index}.price`, String(item.unitPrice || 0));
      methods.setValue(`rows.${index}.vatRate`, resolveVat(item.vatRate));
    }
  };

  const clientOptions = useMemo(
    () => clients.map((c) => ({ label: c.name || '', value: String(c.id) })),
    [clients]
  );

  const serviceOptions = useMemo(
    () =>
      (lineItems || []).map((item) => ({
        label: item.productDescription || item.productCode || '',
        value: String(item.id ?? item.productCode ?? ''),
      })),
    [lineItems]
  );

  if (loading) return <Loader size={32} centered minHeight="120px" />;

  const GRID = '3fr 60px 100px 90px 1fr 32px';

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Client + Job */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormField label="Client" required>
            <Dropdown
              name="clientId"
              preFetchedOptions={clientOptions}
              placeHolder="Select client"
              disablePortal
              fullWidth
              skipDefaultReset
            />
          </FormField>

          <FormField label="Job">
            <Input
              name="_job"
              defaultValue={`Job #${job.id ?? '—'}`}
              placeHolder=""
              fullWidth
              readOnly
            />
          </FormField>
        </Box>

        {/* Line items table */}
        <Box>
          {/* Headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: GRID, gap: 1, mb: 0.75, px: 0.5 }}>
            {['Service', 'Qty', 'Price', 'VAT %', 'Total', ''].map((h, i) => (
              <Typography
                key={h || `col-${i}`}
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={i === 4 ? { textAlign: 'right' } : undefined}
              >
                {h}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: GRID,
                gap: 1,
                mb: 1,
                alignItems: 'center',
              }}
            >
              {/* Service dropdown — pre-filled from estimate line items */}
              <Dropdown
                name={`rows.${index}.service`}
                preFetchedOptions={serviceOptions}
                placeHolder="Select service"
                disablePortal
                fullWidth
                skipDefaultReset
                onChange={(value) => handleServiceChange(index, value)}
              />

              <Input
                name={`rows.${index}.qty`}
                type="number"
                placeHolder="1"
                inputProps={{ min: 1 }}
              />

              <Input
                name={`rows.${index}.price`}
                type="number"
                placeHolder="0.00"
                inputProps={{ min: 0, step: 0.01 }}
              />

              <Dropdown
                name={`rows.${index}.vatRate`}
                preFetchedOptions={getVatOptions(lineItems?.[index]?.vatRate)}
                disableClearable
                disablePortal
                fullWidth
                skipDefaultReset
              />

              <RowTotal index={index} control={methods.control} />

              <IconButton
                size="small"
                variant="outlined"
                color="error"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                aria-label="Remove service row"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {/* Add row */}
          <Button
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => append({ ...defaultRow })}
          >
            Add Service
          </Button>
        </Box>

        <Divider />

        {/* Summary totals */}
        <InvoiceTotals control={methods.control} />
      </Box>
    </FormProvider>
  );
};
