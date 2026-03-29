import React, { useEffect, useState, useCallback } from 'react';
import { Box, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import type { JobResponse, EstimateResponse, LineItemResponse } from '../../../../../services/api';
import { estimateService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../../components/UI/GlobalModal';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import { Table } from '../../../../../components/UI/Table';
import type { ITableColumn, ITableAction, ITableRow } from '../../../../../components/UI/Table';
import { AddLineItemModal } from './AddLineItemModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';
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

  const handleCreateInvoice = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createInvoice',
      children: (
        <CreateInvoiceModal
          job={job}
          lineItems={estimate?.lineItems || []}
          onSuccess={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  }, [job, estimate?.lineItems, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

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

  const columns: ITableColumn[] = [
    { id: 'productCode', label: 'Code', accessor: 'productCode' },
    {
      id: 'productDescription',
      label: 'Description',
      render: (item) => (
        <>
          <div>{item.productDescription}</div>
          {item.additionalDetails && <S.DocumentMeta>{item.additionalDetails}</S.DocumentMeta>}
        </>
      ),
    },
    {
      id: 'coreOrSub',
      label: 'Type',
      render: (item) => (
        <Chip
          label={item.coreOrSub}
          size="small"
          color={item.coreOrSub === 'CORE' ? 'primary' : 'default'}
          variant="outlined"
        />
      ),
    },
    { id: 'unitPrice', label: 'Unit Price', align: 'right', render: (item) => fmt(item.unitPrice) },
    { id: 'quantity', label: 'Qty', align: 'right', accessor: 'quantity' },
    {
      id: 'vatRate',
      label: 'VAT %',
      align: 'right',
      render: (item) => (item.vatRate !== undefined ? `${item.vatRate}%` : '—'),
    },
    { id: 'netAmount', label: 'Net', align: 'right', render: (item) => fmt(item.netAmount) },
    { id: 'vatAmount', label: 'VAT', align: 'right', render: (item) => fmt(item.vatAmount) },
    { id: 'totalAmount', label: 'Total', align: 'right', render: (item) => fmt(item.totalAmount) },
  ];

  const actions: ITableAction[] = [
    {
      id: 'unlink',
      label: 'Unlink from estimate',
      icon: <LinkOffIcon fontSize="small" />,
      color: 'error',
      onClick: handleUnlink as unknown as (row: ITableRow) => void,
    },
  ];

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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={handleCreateInvoice}>
            Create Invoice
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddLineItem} startIcon={<AddIcon />}>
            Add Line Item
          </Button>
        </Box>
      </S.EstimateTableHeader>

      <Table
        columns={columns}
        data={lineItems as unknown as ITableRow[]}
        showActions
        actions={actions}
        emptyMessage="No line items yet"
      />
    </>
  );
};
