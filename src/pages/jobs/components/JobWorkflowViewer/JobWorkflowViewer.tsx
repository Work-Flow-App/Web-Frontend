import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import styled from '@emotion/styled';
import { floowColors } from '../../../../theme/colors';
import { jobWorkflowService } from '../../../../services/api';
import type { JobWorkflowResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI';
import { getWorkflowStatusColor, getWorkflowStatusLabel, calculateWorkflowProgress } from '../../../../types/workflow';

interface JobWorkflowViewerProps {
  jobId: number;
}

const WorkflowContainer = styled(Box)`
  background: white;
  border: 1px solid ${floowColors.grey[300]};
  border-radius: 8px;
  padding: 24px;
`;

const StepCard = styled(Box)<{ status?: string }>`
  background: ${(props: { status?: string }) => {
    switch (props.status) {
      case 'COMPLETED': return floowColors.success.light;
      case 'STARTED':
      case 'ONGOING': return floowColors.info.light;
      case 'PENDING': return floowColors.warning.light;
      default: return floowColors.grey[50];
    }
  }};
  border: 1px solid ${(props: { status?: string }) => {
    switch (props.status) {
      case 'COMPLETED': return floowColors.success.main;
      case 'STARTED':
      case 'ONGOING': return floowColors.info.main;
      case 'PENDING': return floowColors.warning.main;
      default: return floowColors.grey[200];
    }
  }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

const StepHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const JobWorkflowViewer: React.FC<JobWorkflowViewerProps> = ({ jobId }) => {
  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useSnackbar();

  const fetchJobWorkflow = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(jobId);
      setJobWorkflow(response.data);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setJobWorkflow(null);
      } else {
        console.error('Error fetching job workflow:', error);
        showError('Failed to load job workflow');
      }
    } finally {
      setLoading(false);
    }
  }, [jobId, showError]);

  useEffect(() => {
    fetchJobWorkflow();
  }, [fetchJobWorkflow]);

  if (loading) {
    return <Loader />;
  }

  // No workflow started yet
  if (!jobWorkflow) {
    return (
      <WorkflowContainer>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Job Workflow
        </Typography>
        <Typography variant="body2" sx={{ color: floowColors.grey[600] }}>
          No workflow has been started for this job yet.
        </Typography>
      </WorkflowContainer>
    );
  }

  const steps = jobWorkflow.steps || [];
  const progress = calculateWorkflowProgress(steps);

  return (
    <WorkflowContainer>
      {/* Workflow Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Job Workflow
          </Typography>
          <Chip
            label={getWorkflowStatusLabel(jobWorkflow.status || '')}
            color={getWorkflowStatusColor(jobWorkflow.status || '')}
            size="small"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ flex: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {progress}%
          </Typography>
        </Box>
      </Box>

      {/* Workflow Steps */}
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Workflow Steps
      </Typography>
      {steps.length === 0 ? (
        <Typography variant="body2" sx={{ color: floowColors.grey[500], textAlign: 'center', py: 4 }}>
          No steps in this workflow
        </Typography>
      ) : (
        steps.map((step, index) => (
          <StepCard key={step.id} status={step.status}>
            <StepHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {index + 1}. {step.name}
                </Typography>
                <Chip
                  label={getWorkflowStatusLabel(step.status || '')}
                  color={getWorkflowStatusColor(step.status || '')}
                  size="small"
                />
              </Box>
            </StepHeader>
            {step.description && (
              <Typography variant="body2" sx={{ color: floowColors.grey[600], mb: 1 }}>
                {step.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              {step.assignedWorkerIds && step.assignedWorkerIds.size > 0 && (
                <Typography variant="caption" sx={{ color: floowColors.grey[600] }}>
                  Workers assigned: {step.assignedWorkerIds.size}
                </Typography>
              )}
              {step.startedAt && (
                <Typography variant="caption" sx={{ color: floowColors.grey[600] }}>
                  Started: {new Date(step.startedAt).toLocaleDateString()}
                </Typography>
              )}
              {step.completedAt && (
                <Typography variant="caption" sx={{ color: floowColors.grey[600] }}>
                  Completed: {new Date(step.completedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </StepCard>
        ))
      )}
    </WorkflowContainer>
  );
};
