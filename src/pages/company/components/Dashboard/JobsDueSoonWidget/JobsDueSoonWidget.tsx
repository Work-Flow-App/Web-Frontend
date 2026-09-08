import React from 'react';
import { Skeleton } from '@mui/material';
import type { TaskData } from '../types';
import * as S from './JobsDueSoonWidget.styles';

interface JobsDueSoonWidgetProps {
  onViewJobs: () => void;
  jobs?: TaskData[];
  loading?: boolean;
}

export const JobsDueSoonWidget: React.FC<JobsDueSoonWidgetProps> = ({
  onViewJobs,
  jobs = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Jobs Due Soon</S.TitleText>
        <S.ActionLink onClick={onViewJobs}>View Jobs</S.ActionLink>
      </S.Header>
      <S.ListContainer>
        {loading ? (
          // Render calendar skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <S.TaskItem key={`skeleton-${index}`}>
              <Skeleton variant="rectangular" width={52} height={54} animation="wave" style={{ borderRadius: '10px', flexShrink: 0 }} />
              <S.TaskDetails>
                <Skeleton variant="text" width="60%" height={18} animation="wave" />
                <S.SubRow style={{ marginTop: '4px' }}>
                  <Skeleton variant="text" width="30%" height={14} animation="wave" />
                  <Skeleton variant="text" width="20%" height={14} animation="wave" />
                </S.SubRow>
              </S.TaskDetails>
            </S.TaskItem>
          ))
        ) : jobs.length === 0 ? (
          <S.TaskItem style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.StatusText style={{ textAlign: 'center', color: '#9CA3AF' }}>No jobs due soon</S.StatusText>
          </S.TaskItem>
        ) : (
          jobs.map((job) => {
            const parts = job.dueDate.split(' ');
            const month = parts[0] || 'MAY';
            const day = parts[1] || '00';

            return (
              <S.TaskItem key={job.id}>
                <S.DateBlock>
                  <S.MonthText variant="caption">{month}</S.MonthText>
                  <S.DayText variant="h4">{day}</S.DayText>
                </S.DateBlock>
                <S.TaskDetails>
                  <S.TaskNameText variant="subtitle2" title={job.name}>{job.name}</S.TaskNameText>
                  <S.SubRow>
                    <S.PriorityLabel priority={job.priority}>
                      {job.priority} Priority
                    </S.PriorityLabel>
                    <S.Bullet />
                    <S.StatusText variant="caption">{job.status}</S.StatusText>
                  </S.SubRow>
                </S.TaskDetails>
              </S.TaskItem>
            );
          })
        )}
      </S.ListContainer>
    </S.Container>
  );
};
