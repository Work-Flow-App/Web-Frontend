import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { CircularProgress, Tooltip, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type {
  JobResponse,
  JobWorkflowStepResponse,
  StepVisitLogResponse,
} from '../../../../../services/api';
import { jobWorkflowService, visitLogService } from '../../../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../../components/UI/GlobalModal';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import { AddWorkLogModal } from './AddWorkLogModal';
import { getStepColor } from './StepActivityTab.utils';
import { rem } from '../../../../../components/UI/Typography/utility';
import * as WS from './JobWorkLogsTab.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobWorkLogsTabProps {
  job: JobResponse;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatMinutes = (minutes?: number): string => {
  if (!minutes) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (timeString?: string): string => {
  if (!timeString) return '-';
  if (timeString.includes('T')) {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return timeString.substring(0, 5);
};

// ─── Component ────────────────────────────────────────────────────────────────

export const JobWorkLogsTab: React.FC<JobWorkLogsTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [visitLogs, setVisitLogs] = useState<StepVisitLogResponse[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchWorkflow = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoadingWorkflow(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const sorted = [...(response.data.steps || [])].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );
      setSteps(sorted);
      if (sorted.length > 0 && sorted[0].id) setSelectedStepId(sorted[0].id);
    } catch {
      setSteps([]);
    } finally {
      setLoadingWorkflow(false);
    }
  }, [job.id]);

  const fetchVisitLogs = useCallback(async () => {
    if (!selectedStepId) return;
    try {
      setLoadingLogs(true);
      const response = await visitLogService.getVisitLogs(selectedStepId);
      setVisitLogs(response.data.visitLogs || []);
      setTotalMinutes(response.data.totalWorkedMinutes || 0);
    } catch {
      setVisitLogs([]);
      setTotalMinutes(0);
    } finally {
      setLoadingLogs(false);
    }
  }, [selectedStepId]);

  useEffect(() => { fetchWorkflow(); }, [fetchWorkflow]);
  useEffect(() => { fetchVisitLogs(); }, [fetchVisitLogs]);

  const summary = useMemo(() => {
    const totalEntries = visitLogs.length;
    const totalHours = totalMinutes / 60;
    const avgMinutes = totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0;
    return { totalEntries, totalHours, avgMinutes };
  }, [visitLogs, totalMinutes]);

  const selectedStep = steps.find((s) => s.id === selectedStepId);
  const selectedStepIdx = steps.findIndex((s) => s.id === selectedStepId);

  const openModal = (editLog?: StepVisitLogResponse) => {
    if (!selectedStepId) return;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorkLog',
      children: (
        <AddWorkLogModal
          stepId={selectedStepId}
          editLog={editLog || null}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            showSuccess(editLog ? 'Work log updated' : 'Work log added');
            fetchVisitLogs();
          }}
        />
      ),
    });
  };

  const handleDelete = async (visitLogId: number) => {
    try {
      await visitLogService.deleteVisitLog(visitLogId);
      showSuccess('Work log deleted');
      fetchVisitLogs();
    } catch {
      showError('Failed to delete work log');
    }
  };

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (loadingWorkflow) return <Loader centered minHeight="300px" />;

  if (!steps.length) {
    return (
      <WS.EmptyFeedBox sx={{ minHeight: 300 }}>
        <AccessTimeIcon sx={{ fontSize: rem(48), color: 'grey.200' }} />
        <span style={{ fontSize: rem(14), color: 'inherit' }}>
          No workflow steps found for this job.
        </span>
      </WS.EmptyFeedBox>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <WS.WorkLogsLayout>
      {/* ── Left: Steps sidebar ──────────────────────────────────────── */}
      <WS.StepsSidebar>
        <WS.StepsSidebarHeader>
          <WS.StepsSidebarTitle>Steps</WS.StepsSidebarTitle>
          <WS.StepsCountBadge>{steps.length}</WS.StepsCountBadge>
        </WS.StepsSidebarHeader>

        <WS.StepsScrollArea>
          {steps.map((step, idx) => {
            const isActive = selectedStepId === step.id;
            return (
              <WS.StepRowItem
                key={step.id}
                isActive={isActive}
                onClick={() => step.id && setSelectedStepId(step.id)}
              >
                <WS.StepCircleIcon circleColor={getStepColor(idx)}>
                  {idx + 1}
                </WS.StepCircleIcon>
                <WS.StepTextGroup>
                  <WS.StepNameText isActive={isActive}>
                    {step.name || `Step ${idx + 1}`}
                  </WS.StepNameText>
                  <WS.StepStatusText>
                    {(step as Record<string, unknown>).status as string || ''}
                  </WS.StepStatusText>
                </WS.StepTextGroup>
              </WS.StepRowItem>
            );
          })}
        </WS.StepsScrollArea>
      </WS.StepsSidebar>

      {/* ── Right: Work logs panel ────────────────────────────────────── */}
      <WS.WorkLogsPanel>
        {/* Header */}
        <WS.WorkLogsPanelHeader>
          <WS.WorkLogsPanelHeaderLeft>
            <WS.WorkLogsHeaderCircle
              circleColor={selectedStepIdx >= 0 ? getStepColor(selectedStepIdx) : undefined}
            >
              {selectedStepIdx >= 0 ? selectedStepIdx + 1 : <AccessTimeIcon sx={{ fontSize: rem(16) }} />}
            </WS.WorkLogsHeaderCircle>
            <div>
              <WS.WorkLogsPanelTitle>
                {selectedStep?.name ?? 'Step'} · work logs
              </WS.WorkLogsPanelTitle>
              {visitLogs.length > 0 && (
                <WS.WorkLogsPanelMeta>
                  {visitLogs.length} {visitLogs.length === 1 ? 'entry' : 'entries'}
                  {totalMinutes > 0 && ` · ${formatMinutes(totalMinutes)} total`}
                </WS.WorkLogsPanelMeta>
              )}
            </div>
          </WS.WorkLogsPanelHeaderLeft>

          <Button
            size="medium"
            startIcon={<AddIcon />}
            onClick={() => openModal()}
            disabled={!selectedStepId}
            sx={{ flexShrink: 0 }}
          >
            Add Work Log
          </Button>
        </WS.WorkLogsPanelHeader>

        {/* Stats row */}
        {visitLogs.length > 0 && (
          <WS.WorkLogsStatsRow>
            <WS.WorkLogStatCard>
              <WS.WorkLogStatLabel>Total Time</WS.WorkLogStatLabel>
              <WS.WorkLogStatValue>{formatMinutes(totalMinutes)}</WS.WorkLogStatValue>
            </WS.WorkLogStatCard>
            <WS.WorkLogStatCard>
              <WS.WorkLogStatLabel>Total Hours</WS.WorkLogStatLabel>
              <WS.WorkLogStatValue>{summary.totalHours.toFixed(1)}</WS.WorkLogStatValue>
            </WS.WorkLogStatCard>
            <WS.WorkLogStatCard>
              <WS.WorkLogStatLabel>Entries</WS.WorkLogStatLabel>
              <WS.WorkLogStatValue>{summary.totalEntries}</WS.WorkLogStatValue>
            </WS.WorkLogStatCard>
            <WS.WorkLogStatCard>
              <WS.WorkLogStatLabel>Avg per Entry</WS.WorkLogStatLabel>
              <WS.WorkLogStatValue>{formatMinutes(summary.avgMinutes)}</WS.WorkLogStatValue>
            </WS.WorkLogStatCard>
          </WS.WorkLogsStatsRow>
        )}

        {/* Log entries */}
        <WS.WorkLogsScrollArea>
          {loadingLogs ? (
            <WS.EmptyFeedBox>
              <CircularProgress size={32} />
            </WS.EmptyFeedBox>
          ) : visitLogs.length === 0 ? (
            <WS.EmptyFeedBox>
              <AccessTimeIcon sx={{ fontSize: rem(48), color: 'grey.200' }} />
              <span style={{ fontSize: rem(14), color: 'inherit' }}>
                No work logs recorded yet. Add the first entry!
              </span>
            </WS.EmptyFeedBox>
          ) : (
            visitLogs.map((log) => (
              <WS.WorkLogCard key={log.id}>
                <WS.WorkLogCardTopRow>
                  <WS.WorkLogDateBadge>
                    <AccessTimeIcon sx={{ fontSize: rem(13) }} />
                    {formatDate(log.visitDate)}
                  </WS.WorkLogDateBadge>

                  <WS.WorkLogTimeRange>
                    {formatTime(log.timeIn)}
                    <WS.WorkLogTimeSeparator>→</WS.WorkLogTimeSeparator>
                    {formatTime(log.timeOut)}
                  </WS.WorkLogTimeRange>

                  <WS.WorkLogDurationBadge>
                    {formatMinutes(log.workedMinutes)}
                  </WS.WorkLogDurationBadge>
                </WS.WorkLogCardTopRow>

                {log.description && (
                  <WS.WorkLogDescription>{log.description}</WS.WorkLogDescription>
                )}

                <WS.WorkLogCardFooter>
                  <WS.WorkLogCreatedText>
                    Added {formatDate(log.createdAt)}
                  </WS.WorkLogCreatedText>
                  <WS.WorkLogCardActions>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openModal(log)}>
                        <EditIcon sx={{ fontSize: rem(16) }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => log.id && handleDelete(log.id)}
                      >
                        <DeleteIcon sx={{ fontSize: rem(16) }} />
                      </IconButton>
                    </Tooltip>
                  </WS.WorkLogCardActions>
                </WS.WorkLogCardFooter>
              </WS.WorkLogCard>
            ))
          )}
        </WS.WorkLogsScrollArea>
      </WS.WorkLogsPanel>
    </WS.WorkLogsLayout>
  );
};
