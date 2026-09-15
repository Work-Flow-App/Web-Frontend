import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CachedIcon from '@mui/icons-material/Cached';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as S from './RecentWorkflowActivity.styles';

export interface RecentWorkflowActivityData {
  id?: number;
  jobId: number;
  jobRef: number | string;
  workflowName: string;
  stepId?: number;
  stepName: string;
  activityType?: string; // 'COMMENT' | 'COMMENT_ADDED' | 'ATTACHMENT_ADDED' | 'STATUS_CHANGED' | 'WORKER_ASSIGNED' | etc.
  message?: string;
  actorUsername?: string;
  status?: string;
  updatedAt: string;
}

interface RecentWorkflowActivityProps {
  onViewAll: () => void;
  activities?: RecentWorkflowActivityData[];
  loading?: boolean;
  onJobClick?: (jobId: number) => void;
}

const getActivityIcon = (activityType?: string, status?: string) => {
  const type = activityType?.toUpperCase();
  if (type === 'COMMENT' || type === 'COMMENT_ADDED') {
    return <ChatBubbleOutlineIcon />;
  }
  if (type === 'ATTACHMENT_ADDED' || type === 'ATTACHMENT_REMOVED' || type === 'ATTACHMENT_DELETED') {
    return <AttachFileIcon />;
  }
  if (type === 'WORKER_ASSIGNED' || type === 'WORKER_UNASSIGNED') {
    return <PersonOutlineIcon />;
  }
  if (type === 'STATUS_CHANGED') {
    return <CachedIcon />;
  }
  if (type === 'STEP_CREATED') {
    return <AddCircleOutlineIcon />;
  }
  if (status === 'completed') {
    return <CheckIcon />;
  }
  if (status === 'ongoing' || status === 'started') {
    return <PlayArrowIcon />;
  }
  if (status === 'pending' || status === 'initiated') {
    return <FiberManualRecordIcon />;
  }
  return <PauseIcon />;
};

const getActivityBadge = (item: RecentWorkflowActivityData) => {
  const type = item.activityType?.toUpperCase();
  if (type === 'COMMENT' || type === 'COMMENT_ADDED') {
    return { label: 'Comment', badgeType: 'comment' };
  }
  if (type === 'ATTACHMENT_ADDED') {
    return { label: 'Attachment', badgeType: 'attachment' };
  }
  if (type === 'ATTACHMENT_REMOVED' || type === 'ATTACHMENT_DELETED') {
    return { label: 'Removed', badgeType: 'alert' };
  }
  if (type === 'WORKER_ASSIGNED') {
    return { label: 'Assigned', badgeType: 'assigned' };
  }
  if (type === 'WORKER_UNASSIGNED') {
    return { label: 'Unassigned', badgeType: 'alert' };
  }
  if (type === 'STATUS_CHANGED') {
    return { label: item.status || 'Status', badgeType: item.status || 'ongoing' };
  }
  if (type === 'STEP_CREATED') {
    return { label: 'Created', badgeType: 'created' };
  }
  return { label: item.status || 'Step', badgeType: item.status || 'default' };
};

const getTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const RecentWorkflowActivity: React.FC<RecentWorkflowActivityProps> = ({
  onViewAll,
  activities = [],
  loading = false,
  onJobClick,
}) => {
  const navigate = useNavigate();

  const handleItemClick = (jobId: number) => {
    if (!jobId) return;
    if (onJobClick) {
      onJobClick(jobId);
    } else {
      navigate(`/company/jobs/${jobId}/details?tab=activity-log`);
    }
  };

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
          activities.map((item, index) => {
            const badge = getActivityBadge(item);
            const timeAgo = getTimeAgo(item.updatedAt);

            return (
              <S.TimelineItem
                key={item.id ? `${item.jobId}-${item.id}-${index}` : `${item.jobId}-${index}`}
                onClick={() => handleItemClick(item.jobId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item.jobId);
                  }
                }}
              >
                <S.IconWrapper activityType={item.activityType} statusType={item.status}>
                  {getActivityIcon(item.activityType, item.status)}
                </S.IconWrapper>
                <S.ContentWrapper>
                  <S.ActivityLine>
                    <S.JobIdText variant="subtitle2">#{item.jobRef}</S.JobIdText>
                    <S.WorkflowNameText variant="subtitle2">{item.workflowName}</S.WorkflowNameText>
                    <S.StepNameText variant="body2">{item.stepName}</S.StepNameText>
                    <S.StatusBadge badgeType={badge.badgeType} status={item.status}>
                      {badge.label}
                    </S.StatusBadge>
                  </S.ActivityLine>
                  {item.message && (
                    <S.MessageText variant="body2">{item.message}</S.MessageText>
                  )}
                  {item.updatedAt && (
                    <S.MetaText variant="caption">
                      {item.actorUsername ? `By ${item.actorUsername} • ` : ''}
                      {timeAgo || new Date(item.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </S.MetaText>
                  )}
                </S.ContentWrapper>
              </S.TimelineItem>
            );
          })
        )}
      </S.TimelineContainer>
    </S.Container>
  );
};
