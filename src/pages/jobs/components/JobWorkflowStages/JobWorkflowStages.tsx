import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import type { JobResponse } from '../../../../services/api';
import { jobWorkflowService } from '../../../../services/api';
import type { JobWorkflowResponse, JobWorkflowStepResponse } from '../../../../services/api';
import * as S from '../../JobDetailsPage.styles';

interface JobWorkflowStagesProps {
  job: JobResponse;
}

// Color mapping based on step status
const getStepColors = (status?: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    COMPLETED: { bg: '#D5F4E6', text: '#2E7D4E' },
    STARTED: { bg: '#FFEAA7', text: '#8B6914' },
    ONGOING: { bg: '#FFEAA7', text: '#8B6914' },
    IN_PROGRESS: { bg: '#FAD4D8', text: '#B85C69' },
    PENDING: { bg: '#E8E8E8', text: '#666666' },
    NOT_STARTED: { bg: '#F5F5F5', text: '#999999' },
    INITIATED: { bg: '#E3F2FD', text: '#1565C0' },
    SKIPPED: { bg: '#F0F0F0', text: '#888888' },
  };

  return colors[status || 'NOT_STARTED'] || colors.NOT_STARTED;
};

export const JobWorkflowStages: React.FC<JobWorkflowStagesProps> = ({ job }) => {
  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobWorkflow = async () => {
      if (!job.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
        setJobWorkflow(response.data);
      } catch {
        // Job might not have a workflow assigned
        console.log('No workflow found for job:', job.id);
        setJobWorkflow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobWorkflow();
  }, [job.id]);

  // Sort steps by orderIndex
  const sortedSteps = jobWorkflow?.steps
    ? [...jobWorkflow.steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : [];

  // Determine which step is currently active (first non-completed step)
  const activeStepIndex = sortedSteps.findIndex(
    (step) => step.status !== 'COMPLETED' && step.status !== 'SKIPPED'
  );

  if (loading) {
    return (
      <S.WorkflowCard>
        <S.WorkflowTitle>Workflow Stages</S.WorkflowTitle>
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress size={32} />
        </Box>
      </S.WorkflowCard>
    );
  }

  if (!jobWorkflow || sortedSteps.length === 0) {
    return (
      <S.WorkflowCard>
        <S.WorkflowTitle>Workflow Stages</S.WorkflowTitle>
        <S.PlaceholderText>No workflow assigned to this job</S.PlaceholderText>
      </S.WorkflowCard>
    );
  }

  return (
    <S.WorkflowCard>
      <S.WorkflowTitle>Workflow Stages</S.WorkflowTitle>

      <S.StagesContainer>
        {sortedSteps.map((step: JobWorkflowStepResponse, index: number) => {
          const isActive = index === activeStepIndex;
          const colors = getStepColors(step.status);

          return (
            <S.StageArrow
              key={step.id || index}
              color={colors.bg}
              textColor={colors.text}
              active={isActive}
            >
              <S.StageText>{step.name || `Step ${index + 1}`}</S.StageText>
            </S.StageArrow>
          );
        })}
      </S.StagesContainer>
    </S.WorkflowCard>
  );
};
