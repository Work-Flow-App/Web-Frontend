import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, TextField } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { estimateService } from '../../../../../services/api';
import type { EstimateLineItemResponse } from '../../../../../services/api';
import { useCurrency } from '../../../../../contexts/CurrencyContext';
import { ModalTableHeader, ModalTableRow } from './ModalTable.styles';

const HEADERS = ['Product Code', 'Description', 'Unit Price', 'Qty', 'VAT %', 'Total'];
const GRID = '100px 1fr 100px 60px 70px 100px';

export interface CreateEstimateDocumentModalProps {
  estimateId: number;
  lineItems?: EstimateLineItemResponse[];
  onSuccess: () => void;
}

export const CreateEstimateDocumentModal: React.FC<CreateEstimateDocumentModalProps> = ({
  estimateId,
  lineItems = [],
  onSuccess,
}) => {
  const { formatCurrency: fmt } = useCurrency();
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  const [validUntil, setValidUntil] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    updateModalTitle('Generate Estimate PDF');
    setSkipResetModal?.(true);
  }, [updateModalTitle, setSkipResetModal]);

  useEffect(() => {
    updateGlobalModalInnerConfig({
      confirmModalButtonText: isGenerating ? 'Generating...' : 'Generate Estimate PDF',
      isConfirmDisabled: isGenerating,
    });
  }, [updateGlobalModalInnerConfig, isGenerating]);

  useEffect(() => {
    updateOnConfirm(async () => {
      setIsGenerating(true);
      try {
        const res = await estimateService.generateEstimateDocument(estimateId, {
          lineItemIds: lineItems.map((li) => li.id!),
          validUntil: validUntil || undefined,
          reference: reference || undefined,
          notes: notes || undefined,
        });
        const url = res.data?.presignedUrl;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        showSuccess('Estimate PDF generated successfully');
        onSuccess();
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to generate estimate PDF. Please try again.';
        showError(msg);
        setIsGenerating(false);
      }
    });
  }, [updateOnConfirm, estimateId, lineItems, validUntil, reference, notes, showSuccess, showError, onSuccess]);

  const totalNet = lineItems.reduce((s, li) => s + (li.netAmount ?? 0), 0);
  const totalVat = lineItems.reduce((s, li) => s + (li.vatAmount ?? 0), 0);
  const grandTotal = lineItems.reduce((s, li) => s + (li.totalAmount ?? 0), 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label="Valid Until"
          type="date"
          size="small"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Reference"
          type="text"
          size="small"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          placeholder="Enter reference"
        />
      </Box>
      <TextField
        label="Notes"
        multiline
        minRows={2}
        maxRows={5}
        size="small"
        fullWidth
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Thank you for your business. This estimate is valid for 30 days."
      />

      <ModalTableHeader sx={{ gridTemplateColumns: GRID }}>
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
      </ModalTableHeader>

      {lineItems.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No line items selected
        </Typography>
      ) : (
        lineItems.map((item, index) => (
          <ModalTableRow key={item.id} isEven={index % 2 === 0} sx={{ gridTemplateColumns: GRID }}>
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
          </ModalTableRow>
        ))
      )}

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
        <Typography variant="body2" color="text.secondary">Subtotal: {fmt(totalNet)}</Typography>
        <Typography variant="body2" color="text.secondary">VAT: {fmt(totalVat)}</Typography>
        <Typography variant="body1" fontWeight={700}>Total: {fmt(grandTotal)}</Typography>
      </Box>
    </Box>
  );
};
