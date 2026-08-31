import React from 'react';
import { Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import * as S from './RecentWorkflowActivity.styles';

export interface RecentWorkflowActivityData {
  jobId: number;
  jobRef: number | string;
  workflowName: string;
  stepName: string;
  status: string;
  updatedAt: string;
}

interface RecentWorkflowActivityProps {
  onViewAll: () => void;
  activities?: RecentWorkflowActivityData[];
  loading?: boolean;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckIcon />;
    case 'ongoing':
    case 'started':
      return <PlayArrowIcon />;
    case 'pending':
    case 'initiated':
      return <FiberManualRecordIcon />;
    default:
      return <PauseIcon />;
  }
};

export const RecentWorkflowActivity: React.FC<RecentWorkflowActivityProps> = ({
  onViewAll,
  activities = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Recent Workflow Activity</S.TitleText>
        <S.ActionLink onClick={onViewAll}>View All</S.ActionLink>
      </S.Header>
      <S.TimelineContainer>
        {loading ? (
          // Render timeline skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <S.TimelineItem key={`skeleton-${index}`}>
              <Skeleton variant="circular" width={28} height={28} animation="wave" style={{ flexShrink: 0 }} />
              <S.ContentWrapper>
                <Skeleton variant="text" width="80%" height={16} animation="wave" />
                <Skeleton variant="text" width="40%" height={14} animation="wave" style={{ marginTop: '2px' }} />
              </S.ContentWrapper>
            </S.TimelineItem>
          ))
        ) : activities.length === 0 ? (
          <S.TimelineItem style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.WorkflowNameText style={{ textAlign: 'center', color: '#9CA3AF' }}>
              No recent workflow activity
            </S.WorkflowNameText>
          </S.TimelineItem>
        ) : (
          activities.map((item, index) => (
            <S.TimelineItem key={`${item.jobId}-${index}`}>
              <S.IconWrapper statusType={item.status}>
                {getStatusIcon(item.status)}
              </S.IconWrapper>
              <S.ContentWrapper>
                <S.ActivityLine>
                  <S.JobIdText variant="subtitle2">#{item.jobRef}</S.JobIdText>
                  <S.WorkflowNameText variant="subtitle2">{item.workflowName}</S.WorkflowNameText>
                  <S.StepNameText variant="body2">{item.stepName}</S.StepNameText>
                  <S.StatusBadge status={item.status}>{item.status}</S.StatusBadge>
                </S.ActivityLine>
                {item.updatedAt && (
                  <S.MetaText variant="caption">
                    Updated {new Date(item.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </S.MetaText>
                )}
              </S.ContentWrapper>
            </S.TimelineItem>
          ))
        )}
      </S.TimelineContainer>
    </S.Container>
  );
};
