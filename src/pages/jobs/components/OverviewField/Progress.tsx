import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import * as S from './OverviewField.styles';
import { jobWorkflowService } from '../../../../services/api';

interface ProgressProps {
  jobId: number;
  workflowUpdateTrigger?: number;
}

export const Progress: React.FC<ProgressProps> = ({ jobId, workflowUpdateTrigger = 0 }) => {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        const response = await jobWorkflowService.getJobWorkflowByJobId(jobId);
        const steps = response.data?.steps || [];
        
        // Filter out deleted/skipped steps
        const activeSteps = steps.filter((step: any) => step.status?.toUpperCase() !== 'SKIPPED');
        
        setTotalSteps(activeSteps.length);
        
        // Count how many steps are COMPLETED
        const completed = activeSteps.filter((step: any) => step.status === 'COMPLETED').length;
        setCompletedSteps(completed);
      } catch (error) {
        console.error('Failed to fetch job workflow for progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [jobId, workflowUpdateTrigger]);

  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <S.OverviewCard>
      <S.CardLabel>Progress</S.CardLabel>
      
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <>
          <S.CardValueContainer>
            <S.CardValueMain>{completedSteps}</S.CardValueMain>
            <S.CardValueSub>/{totalSteps}</S.CardValueSub>
          </S.CardValueContainer>
          <S.ProgressBarContainer>
            <S.ProgressBarFill progress={progressPercentage} />
          </S.ProgressBarContainer>
        </>
      )}
    </S.OverviewCard>
  );
};
