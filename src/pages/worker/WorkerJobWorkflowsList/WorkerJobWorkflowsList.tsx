import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import * as M from '../styles/WorkerMobile.styles';

interface WorkflowRow {
  id: number;
  jobId?: number;
  status: string;
  stepCount: number;
  completedSteps: number;
}

type FilterKey = 'ALL' | 'STARTED' | 'NOT_STARTED' | 'COMPLETED';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'STARTED', label: 'Started' },
  { key: 'NOT_STARTED', label: 'Not Started' },
  { key: 'COMPLETED', label: 'Completed' },
];

const matchesFilter = (status: string, filter: FilterKey): boolean => {
  if (filter === 'ALL') return true;
  if (filter === 'STARTED') return status === 'STARTED' || status === 'ONGOING' || status === 'INITIATED';
  if (filter === 'COMPLETED') return status === 'COMPLETED';
  return status === 'NOT_STARTED' || status === 'PENDING' || !status;
};

const formatStatusLabel = (status: string): string => {
  if (!status) return 'Not Started';
  return status
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

export const WorkerJobWorkflowsList: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [workflows, setWorkflows] = useState<WorkflowRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('ALL');

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getMyJobWorkflows();
      const data: JobWorkflowResponse[] = Array.isArray(response.data) ? response.data : [];
      const rows: WorkflowRow[] = data.map((wf) => ({
        id: wf.id ?? 0,
        jobId: wf.jobId,
        status: wf.status || 'NOT_STARTED',
        stepCount: wf.steps?.length ?? 0,
        completedSteps:
          wf.steps?.filter((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED').length ?? 0,
      }));
      setWorkflows(rows);
    } catch (error) {
      console.error('Error fetching worker workflows:', error);
      showError(extractErrorMessage(error, 'Failed to load workflows'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const filtered = useMemo(
    () => workflows.filter((w) => matchesFilter(w.status, filter)),
    [workflows, filter],
  );

  const counts = useMemo(
    () => ({
      ALL: workflows.length,
      STARTED: workflows.filter((w) => matchesFilter(w.status, 'STARTED')).length,
      NOT_STARTED: workflows.filter((w) => matchesFilter(w.status, 'NOT_STARTED')).length,
      COMPLETED: workflows.filter((w) => matchesFilter(w.status, 'COMPLETED')).length,
    }),
    [workflows],
  );

  const handleCardClick = useCallback(
    (row: WorkflowRow) => navigate(`/worker/job-workflows/${row.id}`),
    [navigate],
  );

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <h1>My Workflows</h1>
      </M.WorkerHeader>

      <M.FilterTabs>
        {FILTERS.map(({ key, label }) => (
          <M.FilterTab key={key} active={filter === key} onClick={() => setFilter(key)}>
            {key === 'ALL' && (
              <CheckCircleOutlineIcon
                sx={{ fontSize: 14, opacity: filter === 'ALL' ? 1 : 0.6 }}
              />
            )}
            {label}
            {counts[key] > 0 && (
              <span style={{ opacity: filter === key ? 1 : 0.6 }}>· {counts[key]}</span>
            )}
          </M.FilterTab>
        ))}
      </M.FilterTabs>

      {loading ? (
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      ) : filtered.length === 0 ? (
        <M.EmptyState>
          <AccountTreeOutlinedIcon />
          <span>
            {filter === 'ALL'
              ? 'No workflows assigned to you yet.'
              : `No ${formatStatusLabel(filter).toLowerCase()} workflows right now.`}
          </span>
        </M.EmptyState>
      ) : (
        <M.TaskList>
          {filtered.map((row) => {
            const theme = M.resolveStatusTheme(row.status);
            const pct =
              row.stepCount > 0 ? Math.round((row.completedSteps / row.stepCount) * 100) : 0;
            return (
              <M.TaskCard
                key={row.id}
                accentColor={theme.accent}
                onClick={() => handleCardClick(row)}
              >
                <M.TaskCardTopRow>
                  <M.RefBadgeRow>
                    <M.RefBadge>Job #{row.jobId ?? '-'}</M.RefBadge>
                    <M.RefBadge>Workflow #{row.id}</M.RefBadge>
                  </M.RefBadgeRow>
                  <M.StatusPill bg={theme.pillBg} fg={theme.pillFg}>
                    {formatStatusLabel(row.status)}
                  </M.StatusPill>
                </M.TaskCardTopRow>

                <M.TaskTitle>Workflow #{row.id}</M.TaskTitle>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#71717A',
                    }}
                  >
                    <span>
                      {row.completedSteps} of {row.stepCount} steps complete
                    </span>
                    <span style={{ color: theme.pillFg, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <M.ProgressOuter>
                    <M.ProgressInner pct={pct} fg={theme.accent} />
                  </M.ProgressOuter>
                </div>
              </M.TaskCard>
            );
          })}
        </M.TaskList>
      )}
    </M.WorkerShell>
  );
};

export default WorkerJobWorkflowsList;
