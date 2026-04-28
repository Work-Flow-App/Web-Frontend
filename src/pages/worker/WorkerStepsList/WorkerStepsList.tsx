import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { workerJobWorkflowService } from '../../../services/api';
import type { WorkerAssignedStepResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import * as M from '../styles/WorkerMobile.styles';

interface StepRow {
  id: number;
  name?: string;
  description?: string;
  status: string;
  jobId?: number;
  jobRef?: number;
  orderIndex?: number;
  customerName?: string;
  jobAddress?: string;
  startedAt?: string;
  completedAt?: string;
}

const formatAddress = (addr?: WorkerAssignedStepResponse['jobAddress']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.postalCode, addr.country].filter(Boolean).join(', ');
};

const formatTimestamp = (iso?: string): string => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

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
  if (filter === 'COMPLETED') return status === 'COMPLETED' || status === 'SKIPPED';
  return status === 'NOT_STARTED' || status === 'PENDING' || !status;
};

const formatStatusLabel = (status: string): string => {
  if (!status) return 'Not Started';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const WorkerStepsList: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>('ALL');

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getMyAssignedSteps();
      const data: WorkerAssignedStepResponse[] = Array.isArray(response.data) ? response.data : [];
      const rows: StepRow[] = data
        .filter((s) => s.step?.id != null)
        .map((s) => ({
          id: s.step!.id!,
          name: s.step?.name,
          description: s.step?.description,
          status: s.step?.status || 'NOT_STARTED',
          jobId: s.jobId,
          jobRef: s.jobRef,
          orderIndex: s.step?.orderIndex,
          customerName: s.customer?.name,
          jobAddress: formatAddress(s.jobAddress),
          startedAt: s.step?.startedAt,
          completedAt: s.step?.completedAt,
        }));
      setSteps(rows);
    } catch (error) {
      console.error('Error fetching worker steps:', error);
      showError(extractErrorMessage(error, 'Failed to load steps'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const filteredSteps = useMemo(
    () => steps.filter((s) => matchesFilter(s.status, filter)),
    [steps, filter],
  );

  const counts = useMemo(() => {
    return {
      ALL: steps.length,
      STARTED: steps.filter((s) => matchesFilter(s.status, 'STARTED')).length,
      NOT_STARTED: steps.filter((s) => matchesFilter(s.status, 'NOT_STARTED')).length,
      COMPLETED: steps.filter((s) => matchesFilter(s.status, 'COMPLETED')).length,
    };
  }, [steps]);

  const handleCardClick = useCallback(
    (row: StepRow) => {
      navigate(`/worker/steps/${row.id}`);
    },
    [navigate],
  );

  const renderTimelineLine = (row: StepRow) => {
    const theme = M.resolveStatusTheme(row.status);
    if (row.status === 'COMPLETED' || row.status === 'SKIPPED') {
      return (
        <M.TimelineRow fg={theme.pillFg}>
          <CheckCircleOutlineIcon />
          <span>Completed: {formatTimestamp(row.completedAt) || formatTimestamp(row.startedAt) || '-'}</span>
        </M.TimelineRow>
      );
    }
    if (row.status === 'STARTED' || row.status === 'ONGOING' || row.status === 'INITIATED') {
      return (
        <M.TimelineRow fg={theme.pillFg}>
          <AccessTimeIcon />
          <span>Started: {formatTimestamp(row.startedAt) || 'In progress'}</span>
        </M.TimelineRow>
      );
    }
    return (
      <M.TimelineRow fg={theme.pillFg}>
        <RadioButtonUncheckedIcon />
        <span>Awaiting start</span>
      </M.TimelineRow>
    );
  };

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <h1>My Tasks</h1>
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
      ) : filteredSteps.length === 0 ? (
        <M.EmptyState>
          <AssignmentOutlinedIcon />
          <span>
            {filter === 'ALL'
              ? 'No tasks assigned to you yet.'
              : `No ${formatStatusLabel(filter).toLowerCase()} tasks right now.`}
          </span>
        </M.EmptyState>
      ) : (
        <M.TaskList>
          {filteredSteps.map((row) => {
            const theme = M.resolveStatusTheme(row.status);
            return (
              <M.TaskCard
                key={row.id}
                accentColor={theme.accent}
                onClick={() => handleCardClick(row)}
              >
                <M.TaskCardTopRow>
                  <M.RefBadgeRow>
                    <M.RefBadge>Job #{row.jobRef ?? row.jobId ?? '-'}</M.RefBadge>
                    {row.orderIndex != null && (
                      <M.RefBadge>Step #{row.orderIndex}</M.RefBadge>
                    )}
                  </M.RefBadgeRow>
                  <M.StatusPill bg={theme.pillBg} fg={theme.pillFg}>
                    {formatStatusLabel(row.status)}
                  </M.StatusPill>
                </M.TaskCardTopRow>

                <M.TaskTitle>{row.name || `Step #${row.id}`}</M.TaskTitle>
                {row.description && <M.TaskDescription>{row.description}</M.TaskDescription>}

                <M.InfoBlock>
                  {row.customerName && (
                    <M.InfoLine>
                      <PersonOutlineIcon />
                      <span>{row.customerName}</span>
                    </M.InfoLine>
                  )}
                  {row.jobAddress && (
                    <M.InfoLine>
                      <LocationOnOutlinedIcon />
                      <span>{row.jobAddress}</span>
                    </M.InfoLine>
                  )}
                </M.InfoBlock>

                {renderTimelineLine(row)}
              </M.TaskCard>
            );
          })}
        </M.TaskList>
      )}
    </M.WorkerShell>
  );
};

export default WorkerStepsList;
