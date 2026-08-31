import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
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
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  newJobsCount = 0,
  inProgressCount = 0,
  completedCount = 0,
  archivedCount = 0,
  totalJobsCount = 0,
  loading = false,
  onCardClick,
}) => {
  return (
    <S.MetricsContainer>
      {/* 1. New Jobs */}
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

      {/* 2. Jobs In Progress */}
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

      {/* 3. Jobs Completed */}
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

      {/* 4. Archived Jobs */}
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

      {/* 5. Total Jobs */}
      <MetricCard
        label="Total Jobs"
        value={totalJobsCount}
        accentColor="#6366F1"
        bgColor="#E0E7FF"
        iconColor="#4F46E5"
        icon={<WorkOutlineIcon />}
        loading={loading}
        onClick={() => onCardClick?.('total_jobs')}
      />
    </S.MetricsContainer>
  );
};
