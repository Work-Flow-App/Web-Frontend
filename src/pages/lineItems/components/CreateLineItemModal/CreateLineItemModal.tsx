import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { FormField } from '../../../../components/UI/FormComponents';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { lineItemService } from '../../../../services/api';
import type { LineItemCreateRequest, LineItemResponse, LineItemUpdateRequest } from '../../../../services/api';

export interface CreateLineItemModalProps {
  lineItem?: LineItemResponse;
  onSuccess: (data: LineItemResponse) => void;
}

type FormValues = {
  productCode: string;
  productDescription: string;
  additionalDetails: string;
  unitPrice: string;
  quantity: string;
  vatRate: string;
  coreOrSub: { label: string; value: string };
};

const coreOrSubOptions = [
  { label: 'CORE', value: 'CORE' },
  { label: 'SUB', value: 'SUB' },
];

const defaultCoreOrSub = { label: 'CORE', value: 'CORE' };

export const CreateLineItemModal: React.FC<CreateLineItemModalProps> = ({ lineItem, onSuccess }) => {
  const isEdit = !!lineItem;

  const methods = useForm<FormValues>({
    defaultValues: {
      productCode: lineItem?.productCode || '',
      productDescription: lineItem?.productDescription || '',
      additionalDetails: lineItem?.additionalDetails || '',
      unitPrice: String(lineItem?.unitPrice ?? '0'),
      quantity: String(lineItem?.quantity ?? '1'),
      vatRate: String(lineItem?.vatRate ?? '0'),
      coreOrSub: lineItem?.coreOrSub
        ? { label: lineItem.coreOrSub, value: lineItem.coreOrSub }
        : defaultCoreOrSub,
    },
  });
  const { showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const formRef = useRef(methods);
  formRef.current = methods;

  useEffect(() => {
    updateModalTitle(isEdit ? 'Edit Line Item' : 'Create Line Item');
    updateGlobalModalInnerConfig({ confirmModalButtonText: isEdit ? 'Save' : 'Create' });
    setSkipResetModal?.(true);
  }, [isEdit, updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal]);

  useEffect(() => {
    updateOnConfirm(() => {
      const values = formRef.current.getValues();

      if (!values.productCode || !values.productDescription) {
        showError('Product code and description are required');
        return;
      }

      const coreOrSubValue = (values.coreOrSub?.value || 'CORE') as LineItemCreateRequest['coreOrSub'];

      if (isEdit && lineItem?.id) {
        const payload: LineItemUpdateRequest = {
          productCode: values.productCode,
          productDescription: values.productDescription,
          additionalDetails: values.additionalDetails || undefined,
          unitPrice: parseFloat(values.unitPrice) || 0,
          quantity: parseInt(values.quantity) || 1,
          vatRate: parseFloat(values.vatRate) || 0,
          coreOrSub: coreOrSubValue as LineItemUpdateRequest['coreOrSub'],
        };

        lineItemService
          .update(lineItem.id, payload)
          .then((res) => onSuccess(res.data))
          .catch(() => showError('Failed to update line item'));
      } else {
        const payload: LineItemCreateRequest = {
          productCode: values.productCode,
          productDescription: values.productDescription,
          additionalDetails: values.additionalDetails || undefined,
          unitPrice: parseFloat(values.unitPrice) || 0,
          quantity: parseInt(values.quantity) || 1,
          vatRate: parseFloat(values.vatRate) || 0,
          coreOrSub: coreOrSubValue,
        };

        lineItemService
          .create(payload)
          .then((res) => onSuccess(res.data))
          .catch(() => showError('Failed to create line item'));
      }
    });
  }, [isEdit, lineItem, updateOnConfirm, onSuccess, showError]);

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormField label="Product Code" required>
            <Input name="productCode" placeHolder="e.g. PROD-001" fullWidth />
          </FormField>
          <FormField label="Type" required>
            <Dropdown
              name="coreOrSub"
              preFetchedOptions={coreOrSubOptions}
              placeHolder="Select type"
              defaultValue={defaultCoreOrSub}
              disableClearable
              disablePortal
              fullWidth
              skipDefaultReset
            />
          </FormField>
        </Box>

        <FormField label="Description" required>
          <Input name="productDescription" placeHolder="Product description" fullWidth />
        </FormField>

        <FormField label="Additional Details">
          <TextArea name="additionalDetails" placeHolder="Any additional details..." rows={2} fullWidth />
        </FormField>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormField label="Unit Price (£)" required>
            <Input name="unitPrice" type="number" placeHolder="0.00" fullWidth inputProps={{ min: 0, step: 0.01 }} />
          </FormField>
          <FormField label="Quantity" required>
            <Input name="quantity" type="number" placeHolder="1" fullWidth inputProps={{ min: 1 }} />
          </FormField>
          <FormField label="VAT Rate (%)" required>
            <Input name="vatRate" type="number" placeHolder="0" fullWidth inputProps={{ min: 0, max: 100, step: 0.1 }} />
          </FormField>
        </Box>
      </Box>
    </FormProvider>
  );
};
