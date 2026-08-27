import React from 'react';
import { Skeleton } from '@mui/material';
import type { TaskData } from '../types';
import * as S from './MyTasksWidget.styles';

interface MyTasksWidgetProps {
  onViewAllTasks: () => void;
  tasks?: TaskData[];
  loading?: boolean;
}

export const MyTasksWidget: React.FC<MyTasksWidgetProps> = ({
  onViewAllTasks,
  tasks = [],
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">My Tasks {!loading && tasks.length > 0 && `(${tasks.length})`}</S.TitleText>
        <S.ActionLink onClick={onViewAllTasks}>View Full Tasks</S.ActionLink>
      </S.Header>
      <S.ListContainer>
        {loading ? (
          // Render skeleton rows during loading
          Array.from({ length: 5 }).map((_, index) => (
            <S.TaskRow key={`skeleton-${index}`}>
              <Skeleton variant="text" width="40%" height={18} animation="wave" />
              <Skeleton variant="rectangular" width={54} height={20} animation="wave" style={{ borderRadius: '6px' }} />
              <Skeleton variant="rectangular" width={74} height={20} animation="wave" style={{ borderRadius: '6px' }} />
              <Skeleton variant="text" width={40} height={14} animation="wave" />
            </S.TaskRow>
          ))
        ) : tasks.length === 0 ? (
          <S.TaskRow style={{ justifyContent: 'center', padding: '40px 0' }}>
            <S.TaskName style={{ textAlign: 'center', color: '#9CA3AF' }}>No tasks assigned to you</S.TaskName>
          </S.TaskRow>
        ) : (
          tasks.map((task) => (
            <S.TaskRow key={task.id}>
              <S.TaskName variant="body2" title={task.name}>{task.name}</S.TaskName>
              <S.PriorityBadge priority={task.priority}>
                {task.priority}
              </S.PriorityBadge>
              <S.StatusPill status={task.status}>
                {task.status}
              </S.StatusPill>
              <S.DateText variant="caption">{task.dueDate}</S.DateText>
            </S.TaskRow>
          ))
        )}
      </S.ListContainer>
    </S.Container>
  );
};
