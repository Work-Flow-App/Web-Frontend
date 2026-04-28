import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowResponse, WorkerAssignedStepResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as M from '../styles/WorkerMobile.styles';
import { WorkerWorkflowStages } from './WorkerWorkflowStages';

const formatStatusLabel = (status?: string): string => {
  if (!status) return 'Not Started';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const WorkerJobWorkflowDetail: React.FC = () => {
  const { jobWorkflowId } = useParams<{ jobWorkflowId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [context, setContext] = useState<WorkerAssignedStepResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobWorkflow = useCallback(async () => {
    if (!jobWorkflowId) return;

    try {
      setLoading(true);
      const [workflowRes, assignedRes] = await Promise.all([
        workerJobWorkflowService.getJobWorkflow(Number(jobWorkflowId)),
        workerJobWorkflowService.getMyAssignedSteps(),
      ]);
      const workflowData = workflowRes.data;
      setJobWorkflow(workflowData);
      const stepIds = new Set((workflowData.steps || []).map((s) => s.id).filter(Boolean));
      const match =
        (assignedRes.data || []).find((a) => a.step?.id && stepIds.has(a.step.id)) || null;
      setContext(match);
    } catch (error) {
      console.error('Error fetching job workflow:', error);
      showError('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  }, [jobWorkflowId, showError]);

  useEffect(() => {
    fetchJobWorkflow();
  }, [fetchJobWorkflow]);

  const handleBackClick = () => navigate('/worker/job-workflows');

  if (loading) {
    return (
      <M.WorkerShell>
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      </M.WorkerShell>
    );
  }

  if (!jobWorkflow) {
    return (
      <M.WorkerShell>
        <M.WorkerHeader>
          <M.BackIconButton onClick={handleBackClick} aria-label="Back">
            <ArrowBackIcon />
          </M.BackIconButton>
          <h1>Workflow</h1>
        </M.WorkerHeader>
        <M.EmptyState>Workflow not found</M.EmptyState>
      </M.WorkerShell>
    );
  }

  const totalSteps = jobWorkflow.steps?.length ?? 0;
  const completedSteps =
    jobWorkflow.steps?.filter((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED').length ?? 0;
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const statusTheme = M.resolveStatusTheme(jobWorkflow.status);

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <M.BackIconButton onClick={handleBackClick} aria-label="Back">
          <ArrowBackIcon />
        </M.BackIconButton>
        <h1>{context?.customer?.name || `Workflow #${jobWorkflow.id}`}</h1>
      </M.WorkerHeader>

      <M.StepBadgesRow>
        <M.RefBadge>
          Job #{context?.jobRef ?? jobWorkflow.jobId} · Workflow #{jobWorkflow.id}
        </M.RefBadge>
        <M.StatusPill bg={statusTheme.pillBg} fg={statusTheme.pillFg}>
          {formatStatusLabel(jobWorkflow.status)}
        </M.StatusPill>
      </M.StepBadgesRow>

      <Box
        sx={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#71717A',
          }}
        >
          <span>
            {completedSteps} of {totalSteps} steps complete
          </span>
          <span style={{ color: statusTheme.pillFg, fontWeight: 700 }}>{pct}%</span>
        </Box>
        <M.ProgressOuter>
          <M.ProgressInner pct={pct} fg={statusTheme.accent} />
        </M.ProgressOuter>
      </Box>

      <Box
        sx={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <WorkerWorkflowStages jobWorkflow={jobWorkflow} onStepUpdate={fetchJobWorkflow} />
      </Box>
    </M.WorkerShell>
  );
};

export default WorkerJobWorkflowDetail;
