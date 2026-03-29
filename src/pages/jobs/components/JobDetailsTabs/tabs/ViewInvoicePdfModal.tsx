import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import type { InvoiceResponse } from '../../../../../services/api';

interface ViewInvoicePdfModalProps {
  invoice: InvoiceResponse;
}

export const ViewInvoicePdfModal: React.FC<ViewInvoicePdfModalProps> = ({ invoice }) => {
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle(`Invoice ${invoice.invoiceNumber ? `#${invoice.invoiceNumber}` : ''}`);
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Download PDF',
      cancelButtonText: 'Close',
    });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal, invoice.invoiceNumber]);

  useEffect(() => {
    updateOnConfirm(() => {
      if (invoice.presignedUrl) {
        window.open(invoice.presignedUrl, '_blank');
      }
    });
  }, [updateOnConfirm, invoice.presignedUrl]);

  const fmt = (val?: number) => (val !== undefined ? `£${val.toFixed(2)}` : '—');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">Net Total</Typography>
          <Typography variant="body1" fontWeight={600}>{fmt(invoice.totalNet)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">VAT</Typography>
          <Typography variant="body1" fontWeight={600}>{fmt(invoice.totalVat)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">Grand Total</Typography>
          <Typography variant="body1" fontWeight={700}>{fmt(invoice.grandTotal)}</Typography>
        </Box>
      </Box>

      {invoice.presignedUrl ? (
        <Box
          component="iframe"
          src={invoice.presignedUrl}
          sx={{
            width: '100%',
            height: '540px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
          title="Invoice PDF"
        />
      ) : (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          PDF preview not available
        </Typography>
      )}
    </Box>
  );
};
