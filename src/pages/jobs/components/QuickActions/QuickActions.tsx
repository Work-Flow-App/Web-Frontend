import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { estimateService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { CreateEstimateDocumentModal } from '../JobDetailsTabs/tabs/CreateEstimateDocumentModal';
import { CreateInvoiceModal } from '../JobDetailsTabs/tabs/CreateInvoiceModal';
import { EstimateLineItemResponseStatusEnum } from '../../../../services/api';
import * as S from './QuickActions.styles';

interface QuickActionsProps {
  jobId: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ jobId }) => {
  const { showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const fetchEstimateData = async () => {
    try {
      const res = await estimateService.getByJobId(jobId);
      return res.data;
    } catch (err) {
      return null;
    }
  };

  const handleGenerateEstimate = async () => {
    setLoadingEstimate(true);
    const estimate = await fetchEstimateData();
    setLoadingEstimate(false);

    if (!estimate || !estimate.lineItems || estimate.lineItems.length === 0) {
      showError('No item available');
      return;
    }

    const uninvoicedItems = estimate.lineItems.filter(
      (li) => li.status !== EstimateLineItemResponseStatusEnum.Invoiced
    );

    if (uninvoicedItems.length === 0) {
      showError('No item available');
      return;
    }

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createEstimateDocument',
      children: (
        <CreateEstimateDocumentModal
          estimateId={estimate.id!}
          lineItems={uninvoicedItems}
          onSuccess={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  const handleCreateInvoice = async () => {
    setLoadingInvoice(true);
    const estimate = await fetchEstimateData();
    setLoadingInvoice(false);

    if (!estimate || !estimate.lineItems || estimate.lineItems.length === 0) {
      showError('No item available');
      return;
    }

    const uninvoicedItems = estimate.lineItems.filter(
      (li) => li.status !== EstimateLineItemResponseStatusEnum.Invoiced
    );

    if (uninvoicedItems.length === 0) {
      showError('No item available');
      return;
    }

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'createInvoice',
      children: (
        <CreateInvoiceModal
          estimateId={estimate.id!}
          lineItems={uninvoicedItems}
          onSuccess={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  return (
    <S.QuickActionsContainer>
      <S.SectionTitle>QUICK ACTIONS</S.SectionTitle>
      <S.ActionsGrid>
        <S.ActionCard onClick={loadingEstimate ? undefined : handleGenerateEstimate}>
          <S.IconContainer>
            {loadingEstimate ? <CircularProgress size={20} color="inherit" /> : <DescriptionOutlinedIcon />}
          </S.IconContainer>
          <S.ActionTitle>Generate estimate</S.ActionTitle>
          <S.ActionSubtitle>From all available items</S.ActionSubtitle>
        </S.ActionCard>
        
        <S.ActionCard onClick={loadingInvoice ? undefined : handleCreateInvoice}>
          <S.IconContainer>
            {loadingInvoice ? <CircularProgress size={20} color="inherit" /> : <ReceiptLongOutlinedIcon />}
          </S.IconContainer>
          <S.ActionTitle>Create invoice</S.ActionTitle>
          <S.ActionSubtitle>From all available items</S.ActionSubtitle>
        </S.ActionCard>
      </S.ActionsGrid>
    </S.QuickActionsContainer>
  );
};
