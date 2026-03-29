import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, TextField } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { estimateService } from '../../../../../services/api';
import type { LineItemResponse } from '../../../../../services/api';

const fmt = (v?: number) => (v !== undefined ? `£${v.toFixed(2)}` : '—');

const HEADERS = ['Product Code', 'Description', 'Unit Price', 'Qty', 'VAT %', 'Total'];
const GRID = '100px 1fr 100px 60px 70px 100px';

export interface CreateInvoiceModalProps {
  estimateId: number;
  lineItems?: LineItemResponse[];
  onSuccess: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  estimateId,
  lineItems = [],
  onSuccess,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const [dueDate, setDueDate] = useState('');
  const [reference, setReference] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    updateModalTitle('Create Invoice');
    setSkipResetModal?.(true);
  }, [updateModalTitle, setSkipResetModal]);

  useEffect(() => {
    updateGlobalModalInnerConfig({
      confirmModalButtonText: isGenerating ? 'Generating invoice...' : 'Generate Invoice',
      isConfirmDisabled: isGenerating,
    });
  }, [updateGlobalModalInnerConfig, isGenerating]);

  useEffect(() => {
    updateOnConfirm(async () => {
      setIsGenerating(true);
      try {
        const res = await estimateService.generateInvoice(estimateId, {
          lineItemIds: lineItems.map((li) => li.id!),
          dueDate: dueDate || undefined,
          reference: reference || undefined,
        });
        const url = res.data?.presignedUrl;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        showSuccess('Invoice generated successfully');
        onSuccess();
      } catch (err: unknown) {
        console.error('Generate invoice error:', err);
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to generate invoice. Please try again.';
        showError(msg);
        setIsGenerating(false);
      }
    });
  }, [updateOnConfirm, estimateId, lineItems, dueDate, reference, showSuccess, showError, onSuccess]);

  const totalNet = lineItems.reduce((s, li) => s + (li.netAmount ?? 0), 0);
  const totalVat = lineItems.reduce((s, li) => s + (li.vatAmount ?? 0), 0);
  const grandTotal = lineItems.reduce((s, li) => s + (li.totalAmount ?? 0), 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Due Date & Reference */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Due Date"
          type="date"
          size="small"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Reference"
          type="text"
          size="small"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          inputProps={{ maxLength: 100 }}
          placeholder="Enter reference"
        />
      </Box>

      {/* Header row */}
      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: GRID,
          gap: 1,
          px: 1,
          py: 1,
          borderRadius: 1,
          backgroundColor: theme.palette.action.selected,
        })}
      >
        {HEADERS.map((h, i) => (
          <Typography
            key={h}
            variant="caption"
            color="text.primary"
            fontWeight={700}
            sx={i >= 2 ? { textAlign: 'right' } : undefined}
          >
            {h}
          </Typography>
        ))}
      </Box>

      {/* Data rows */}
      {lineItems.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No line items selected
        </Typography>
      ) : (
        lineItems.map((item, index) => (
          <Box
            key={item.id}
            sx={(theme) => ({
              display: 'grid',
              gridTemplateColumns: GRID,
              gap: 1,
              px: 1,
              py: 0.75,
              alignItems: 'center',
              borderRadius: 1,
              backgroundColor: index % 2 === 0
                ? theme.palette.action.hover
                : 'transparent',
            })}
          >
            <Typography variant="body2">{item.productCode || '—'}</Typography>
            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.productDescription || '—'}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>{item.quantity ?? '—'}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'right' }}>
              {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
            </Typography>
            <Typography variant="body2" fontWeight={500} sx={{ textAlign: 'right' }}>
              {fmt(item.totalAmount)}
            </Typography>
          </Box>
        ))
      )}

      <Divider />

      {/* Totals */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Subtotal: {fmt(totalNet)}</Typography>
        <Typography variant="body2" color="text.secondary">VAT: {fmt(totalVat)}</Typography>
        <Typography variant="body1" fontWeight={700}>Total: {fmt(grandTotal)}</Typography>
      </Box>
    </Box>
  );
};
