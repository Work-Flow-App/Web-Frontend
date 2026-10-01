import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useCurrency } from '../../../../../contexts/CurrencyContext';
import { TOOLTIP_MESSAGES } from '../../../const/ToolTipConst';
import { MetricCard } from './MetricCard';
import * as S from './MetricsRow.styles';

interface MetricsRowProps {
  newJobsCount?: number;
  inProgressCount?: number;
  completedCount?: number;
  archivedCount?: number;
  totalJobsCount?: number;
  loading?: boolean;
  onCardClick?: (metricId: string) => void;

  waitingApprovalValue?: number;
  approvedValue?: number;
  invoicedValue?: number;
  loadingFinancial?: boolean;
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  newJobsCount = 0,
  inProgressCount = 0,
  completedCount = 0,
  archivedCount = 0,
  totalJobsCount = 0,
  loading = false,
  onCardClick,
  waitingApprovalValue,
  approvedValue,
  invoicedValue,
  loadingFinancial = false,
}) => {
  const { formatCurrency } = useCurrency();

  return (
    <S.MetricsGrid>
      {/* ── Row 1: High-Level Macro & Financial Summary (4 Cards) ── */}
      {/* 1. Waiting Approval (WIP) */}
      <MetricCard
        label="Waiting Approval (WIP)"
        tooltip={TOOLTIP_MESSAGES.WAITING_APPROVAL}
        value={formatCurrency(waitingApprovalValue ?? 0)}
        valueColor="#F59E0B"
        accentColor="#F59E0B"
        bgColor="#FEF3C7"
        iconColor="#D97706"
        icon={<PendingActionsIcon />}
        loading={loadingFinancial}
        onClick={() => onCardClick?.('waiting_approval')}
      />

      {/* 2. Approved (WIP) */}
      <MetricCard
        label="Approved (WIP)"
        tooltip={TOOLTIP_MESSAGES.APPROVED}
        value={formatCurrency(approvedValue ?? 0)}
        valueColor="#10B981"
        accentColor="#10B981"
        bgColor="#D1FAE5"
        iconColor="#059669"
        icon={<CheckCircleOutlineIcon />}
        loading={loadingFinancial}
        onClick={() => onCardClick?.('approved')}
      />

      {/* 3. Invoiced (WIP) */}
      <MetricCard
        label="Invoiced (WIP)"
        tooltip={TOOLTIP_MESSAGES.INVOICED}
        value={formatCurrency(invoicedValue ?? 0)}
        valueColor="#6366F1"
        accentColor="#6366F1"
        bgColor="#E0E7FF"
        iconColor="#4F46E5"
        icon={<ReceiptLongOutlinedIcon />}
        loading={loadingFinancial}
        onClick={() => onCardClick?.('invoiced')}
      />

      {/* 4. Total Jobs */}
      <MetricCard
        label="Total Jobs"
        value={totalJobsCount}
        accentColor="#8B5CF6"
        bgColor="#EDE9FE"
        iconColor="#7C3AED"
        icon={<WorkOutlineIcon />}
        loading={loading}
        onClick={() => onCardClick?.('total_jobs')}
      />

      {/* ── Row 2: Job Lifecycle Status Pipeline (4 Cards) ── */}
      {/* 5. New Jobs */}
      <MetricCard
        label="New Jobs"
        value={newJobsCount}
        accentColor="#F59E0B"
        bgColor="#FEF3C7"
        iconColor="#D97706"
        icon={<NotificationsNoneIcon />}
        loading={loading}
        onClick={() => onCardClick?.('new_jobs')}
      />

      {/* 6. Jobs In Progress */}
      <MetricCard
        label="Jobs In Progress"
        value={inProgressCount}
        accentColor="#F97316"
        bgColor="#FFEDD5"
        iconColor="#EA580C"
        icon={<AssignmentOutlinedIcon />}
        loading={loading}
        onClick={() => onCardClick?.('in_progress')}
      />

      {/* 7. Jobs Completed */}
      <MetricCard
        label="Jobs Completed"
        value={completedCount}
        accentColor="#10B981"
        bgColor="#D1FAE5"
        iconColor="#059669"
        icon={<CheckCircleOutlineIcon />}
        loading={loading}
        onClick={() => onCardClick?.('completed')}
      />

      {/* 8. Archived Jobs */}
      <MetricCard
        label="Archived Jobs"
        value={archivedCount}
        accentColor="#6B7280"
        bgColor="#F3F4F6"
        iconColor="#4B5563"
        icon={<ArchiveOutlinedIcon />}
        loading={loading}
        onClick={() => onCardClick?.('archived')}
      />
    </S.MetricsGrid>
  );
};
