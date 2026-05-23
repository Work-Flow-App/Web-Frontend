import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { JobEventsSection } from './components/JobEventsSection';
import { PageContainer } from './CompanyPage.styles';
import { dashboardService } from '../../services/api';
import type { FinancialSummaryResponse } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';

const SummaryBox: React.FC<{ label: string; value?: number; color: string; fmt: (v?: number | null) => string }> = ({ label, value, color, fmt }) => (
  <Box sx={(theme) => ({
    flex: 1,
    minWidth: 0,
    p: 2.5,
    borderRadius: 1.5,
    border: `1px solid ${theme.palette.colors?.grey_200 ?? '#e0e0e0'}`,
    backgroundColor: theme.palette.colors?.white ?? '#fff',
    borderLeft: `4px solid ${color}`,
  })}>
    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
      {label}
    </Typography>
    <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color }}>
      {fmt(value)}
    </Typography>
  </Box>
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
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {loadingSummary ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">Loading summary...</Typography>
          </Box>
        ) : (
          <>
            <SummaryBox label="Waiting Approval" value={summary?.waitingApprovalValue} color="#F59E0B" fmt={fmt} />
            <SummaryBox label="Approved" value={summary?.approvedValue} color="#10B981" fmt={fmt} />
            <SummaryBox label="Invoiced" value={summary?.invoicedValue} color="#6366F1" fmt={fmt} />
          </>
        )}
      </Box>

      <JobEventsSection />
    </PageContainer>
  );
};
