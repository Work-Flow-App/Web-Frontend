import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { JobEventsSection } from './components/JobEventsSection';
import { 
  PageContainer, 
  SummaryCard,
  SummaryCardsContainer,
  SummaryLoadingContainer,
  SummaryHeader,
  SummaryLabelText,
  SummaryValueText
} from './CompanyPage.styles';
import { dashboardService } from '../../services/api';
import type { FinancialSummaryResponse } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';

import { InfoTooltip } from '../../components/InfoTooltip';
import { TOOLTIP_MESSAGES } from './const/ToolTipConst';

// Cleaned up component using pure styled-components
const SummaryBox: React.FC<{ label: string; tooltip?: string; value?: number; color: string; fmt: (v?: number | null) => string }> = ({ label, tooltip, value, color, fmt }) => (
  <SummaryCard accentcolor={color}>
    <SummaryHeader>
      <SummaryLabelText variant="caption">
        {label}
      </SummaryLabelText>
      {tooltip && <InfoTooltip message={tooltip} />}
    </SummaryHeader>
    <SummaryValueText variant="h5" stylecolor={color}>
      {fmt(value)}
    </SummaryValueText>
  </SummaryCard>
);

export const CompanyPage: React.FC = () => {
  const { formatCurrency: fmt } = useCurrency();
  const [summary, setSummary] = useState<FinancialSummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    dashboardService.getFinancialSummary()
      .then((res) => setSummary(res.data))
      .catch(() => { /* non-critical */ })
      .finally(() => setLoadingSummary(false));
  }, []);

  return (
    <PageContainer>
      {/* Financial Summary */}
      <SummaryCardsContainer>
        {loadingSummary ? (
          <SummaryLoadingContainer>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">Loading summary...</Typography>
          </SummaryLoadingContainer>
        ) : (
          <>
            <SummaryBox label="Waiting Approval (WIP)" tooltip={TOOLTIP_MESSAGES.WAITING_APPROVAL} value={summary?.waitingApprovalValue} color="#F59E0B" fmt={fmt} />
            <SummaryBox label="Approved (WIP)" tooltip={TOOLTIP_MESSAGES.APPROVED} value={summary?.approvedValue} color="#10B981" fmt={fmt} />
            <SummaryBox label="Invoiced (WIP)" tooltip={TOOLTIP_MESSAGES.INVOICED} value={summary?.invoicedValue} color="#6366F1" fmt={fmt} />
            <SummaryBox label="All-Time Invoiced" value={summary?.allTimeInvoicedValue} color="#0EA5E9" fmt={fmt} />
          </>
        )}
      </SummaryCardsContainer>

      <JobEventsSection />
    </PageContainer>
  );
};
