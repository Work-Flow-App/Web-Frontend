import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { floowColors } from '../../../../theme/colors';
import { jobWorkflowService } from '../../../../services/api';
import type { JobWorkflowResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI';
import { getWorkflowStatusColor, getWorkflowStatusLabel, calculateWorkflowProgress } from '../../../../types/workflow';
import * as S from './JobWorkflowViewer.styles';

interface JobWorkflowViewerProps {
  jobId: number;
}

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
      <S.WorkflowContainer>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Job Workfloow
        </Typography>
        <Typography variant="body2" sx={{ color: floowColors.grey[600] }}>
          No workfloow has been started for this job yet.
        </Typography>
      </S.WorkflowContainer>
    );
  }

  const steps = (jobWorkflow.steps || []).filter((step) => step.status?.toUpperCase() !== 'SKIPPED');
  const progress = calculateWorkflowProgress(steps);

  return (
    <S.WorkflowContainer>
      {/* Workflow Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Job Workfloow
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
        Workfloow Steps
      </Typography>
      {steps.length === 0 ? (
        <Typography variant="body2" sx={{ color: floowColors.grey[500], textAlign: 'center', py: 4 }}>
          No steps in this workflow
        </Typography>
      ) : (
        steps.map((step, index) => (
          <S.StepCard key={step.id} status={step.status}>
            <S.StepHeader>
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
            </S.StepHeader>
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
          </S.StepCard>
        ))
      )}
    </S.WorkflowContainer>
  );
};
