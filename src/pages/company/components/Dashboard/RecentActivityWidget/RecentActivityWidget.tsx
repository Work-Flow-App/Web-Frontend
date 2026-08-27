import React from 'react';
import { Skeleton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import type { ActivityLog } from '../types';
import * as S from './RecentActivityWidget.styles';

interface RecentActivityWidgetProps {
  onViewAll: () => void;
  activities?: ActivityLog[];
  loading?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'status_change':
      return <CachedIcon />;
    case 'comment':
      return <EditOutlinedIcon />;
    case 'creation':
      return <CheckCircleOutlineIcon />;
    case 'update':
      return <AddIcon />;
    default:
      return <PersonOutlineIcon />;
  }
};

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  onViewAll,
  activities = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Recent Activity</S.TitleText>
        <S.ActionLink onClick={onViewAll}>View All</S.ActionLink>
      </S.Header>
      <S.TimelineContainer>
        {loading ? (
          // Render timeline skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <S.TimelineItem key={`skeleton-${index}`}>
              <Skeleton variant="circular" width={30} height={30} animation="wave" style={{ flexShrink: 0 }} />
              <S.ContentWrapper>
                <Skeleton variant="text" width="70%" height={16} animation="wave" />
                <Skeleton variant="text" width="40%" height={14} animation="wave" style={{ marginTop: '2px' }} />
              </S.ContentWrapper>
            </S.TimelineItem>
          ))
        ) : activities.length === 0 ? (
          <S.TimelineItem style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.ActivityText style={{ textAlign: 'center', color: '#9CA3AF' }}>No recent activities</S.ActivityText>
          </S.TimelineItem>
        ) : (
          activities.map((item) => (
            <S.TimelineItem key={item.id}>
              <S.IconWrapper type={item.type}>
                {getActivityIcon(item.type)}
              </S.IconWrapper>
              <S.ContentWrapper>
                <S.ActivityText variant="body2">
                  <strong>{item.jobRef}</strong> {item.action}
                </S.ActivityText>
                <S.MetaText variant="caption">
                  By {item.user} • {item.timeAgo}
                </S.MetaText>
              </S.ContentWrapper>
            </S.TimelineItem>
          ))
        )}
      </S.TimelineContainer>
    </S.Container>
  );
};
