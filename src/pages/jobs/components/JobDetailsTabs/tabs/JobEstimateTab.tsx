import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { JobResponse, EstimateResponse, LineItemResponse } from '../../../../../services/api';
import { estimateService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../../components/UI/GlobalModal';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import { IconButton } from '../../../../../components/UI/Button/IconButton';
import { AddLineItemModal } from './AddLineItemModal';
import * as S from '../../../JobDetailsPage.styles';

interface JobEstimateTabProps {
  job: JobResponse;
}

export const JobEstimateTab: React.FC<JobEstimateTabProps> = ({ job }) => {
  const { showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEstimate = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoading(true);
      const res = await estimateService.getByJobId(job.id);
      setEstimate(res.data);
    } catch {
      showError('Failed to load estimate');
    } finally {
      setLoading(false);
    }
  }, [job.id, showError]);

  useEffect(() => {
    fetchEstimate();
  }, [fetchEstimate]);

  const handleUnlink = useCallback(
    async (lineItem: LineItemResponse) => {
      if (!estimate?.id || !lineItem.id) return;
      try {
        const res = await estimateService.unlinkLineItem(estimate.id, lineItem.id);
        setEstimate(res.data);
      } catch {
        showError('Failed to remove line item');
      }
    },
    [estimate?.id, showError]
  );

  const handleAddLineItem = useCallback(() => {
    if (!estimate?.id) return;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addLineItem',
      children: (
        <AddLineItemModal
          estimateId={estimate.id}
          onSuccess={(updated: EstimateResponse) => {
            setEstimate(updated);
            resetGlobalModalOuterProps();
          }}
        />
      ),
    });
  }, [estimate?.id, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  const fmt = (val?: number) => (val !== undefined ? `£${val.toFixed(2)}` : '—');

  if (loading) return <Loader size={40} centered minHeight="200px" />;

  if (!estimate) {
    return (
      <S.EstimateEmptyState>
        <ReceiptLongIcon />
        <S.InfoValue>No estimate found for this job</S.InfoValue>
      </S.EstimateEmptyState>
    );
  }

  const lineItems: LineItemResponse[] = estimate.lineItems || [];

  return (
    <>
      <S.EstimateTotalsRow>
        <S.EstimateTotalCard>
          <S.DetailLabel>Net Total</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.totalNet)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
        <S.EstimateTotalCard>
          <S.DetailLabel>VAT</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.totalVat)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
        <S.EstimateTotalCard>
          <S.DetailLabel>Grand Total</S.DetailLabel>
          <S.EstimateTotalValue>{fmt(estimate.grandTotal)}</S.EstimateTotalValue>
        </S.EstimateTotalCard>
      </S.EstimateTotalsRow>

      <S.EstimateTableHeader>
        <S.DetailsSectionTitle>Line Items ({lineItems.length})</S.DetailsSectionTitle>
        <Button variant="contained" color="primary" onClick={handleAddLineItem} startIcon={<AddIcon />}>
          Add Line Item
        </Button>
      </S.EstimateTableHeader>

      {lineItems.length === 0 ? (
        <S.EstimateEmptyState>
          <ReceiptLongIcon />
          <S.InfoValue>No line items yet</S.InfoValue>
        </S.EstimateEmptyState>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">VAT %</TableCell>
              <TableCell align="right">Net</TableCell>
              <TableCell align="right">VAT</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {lineItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.productCode}</TableCell>
                <TableCell>
                  <div>{item.productDescription}</div>
                  {item.additionalDetails && (
                    <S.DocumentMeta>{item.additionalDetails}</S.DocumentMeta>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.coreOrSub}
                    size="small"
                    color={item.coreOrSub === 'CORE' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{fmt(item.unitPrice)}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  {item.vatRate !== undefined ? `${item.vatRate}%` : '—'}
                </TableCell>
                <TableCell align="right">{fmt(item.netAmount)}</TableCell>
                <TableCell align="right">{fmt(item.vatAmount)}</TableCell>
                <TableCell align="right">{fmt(item.totalAmount)}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Unlink from estimate">
                    <span>
                      <IconButton
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleUnlink(item)}
                        aria-label="Unlink line item"
                      >
                        <LinkOffIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
