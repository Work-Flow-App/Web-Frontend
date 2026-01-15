import React from 'react';
import type { JobResponse } from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';

interface JobWorkflowStagesProps {
  job: JobResponse;
}

export const JobWorkflowStages: React.FC<JobWorkflowStagesProps> = ({ job }) => {
  return (
    <S.WorkflowCard>
      <S.WorkflowTitle>Workflow - Events</S.WorkflowTitle>

      <S.StagesContainer>
        <S.StageArrow color="#D5F4E6" textColor="#2E7D4E" active={job.status === 'NEW'}>
          <S.StageText>New</S.StageText>
        </S.StageArrow>

        <S.StageArrow color="#FFEAA7" textColor="#8B6914" active={job.status === 'PENDING'}>
          <S.StageText>Pending</S.StageText>
        </S.StageArrow>

        <S.StageArrow color="#FAD4D8" textColor="#B85C69" active={job.status === 'IN_PROGRESS'}>
          <S.StageText>In Progress</S.StageText>
        </S.StageArrow>

        <S.StageArrow color="#D6EAF8" textColor="#3A5A78" active={job.status === 'COMPLETED'}>
          <S.StageText>Completed</S.StageText>
        </S.StageArrow>
      </S.StagesContainer>
    </S.WorkflowCard>
  );
};
