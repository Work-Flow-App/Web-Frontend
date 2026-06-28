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
} from '../../../../services/api';
import { jobWorkflowService, visitLogService } from '../../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/GlobalModal';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/Loader/Loader';
import { Button } from '../../../../components/Button';
import { AddWorkLogModal } from './AddWorkLogModal';
import { getStepColor } from './StepActivityTab.utils';
import { rem } from '../../../../components/Typography/utility';
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
      {/* ── Top: Horizontal Steps Navigation ─────────────────────────────── */}
      <WS.StepsNavContainer>
        {steps.map((step, idx) => {
          const isActive = selectedStepId === step.id;
          return (
            <WS.StepBadge
              key={step.id}
              isActive={isActive}
              onClick={() => step.id && setSelectedStepId(step.id)}
            >
              <WS.StepDot dotColor={getStepColor(idx)} />
              {idx + 1}. {step.name || `Step ${idx + 1}`}
            </WS.StepBadge>
          );
        })}
      </WS.StepsNavContainer>

      {/* ── Summary Section ────────────────────────────────────────────────── */}
      <WS.SummarySection>
        <WS.TrackingBox>
          <WS.TimerIconBox>
            <AccessTimeIcon sx={{ fontSize: rem(32), color: 'white' }} />
          </WS.TimerIconBox>
          <WS.TrackingInfo>
            <WS.TrackingLabel>
              CURRENTLY TRACKING - {selectedStep?.name || 'STEP'}
            </WS.TrackingLabel>
            <WS.TrackingTime>{formatMinutes(totalMinutes)}</WS.TrackingTime>
          </WS.TrackingInfo>
        </WS.TrackingBox>

        <WS.StatsGrid>
          <WS.StatBox>
            <WS.StatLabel>Total Hours</WS.StatLabel>
            <WS.StatValue>{summary.totalHours.toFixed(1)}h</WS.StatValue>
          </WS.StatBox>
          <WS.AddLogBox>
            <Button
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => openModal()}
              disabled={!selectedStepId}
              fullWidth
            >
              Add Work Log
            </Button>
          </WS.AddLogBox>
          <WS.StatBox>
            <WS.StatLabel>Entries</WS.StatLabel>
            <WS.StatValue>{summary.totalEntries}</WS.StatValue>
          </WS.StatBox>
          <WS.StatBox>
            <WS.StatLabel>Avg Per Entry</WS.StatLabel>
            <WS.StatValue>{formatMinutes(summary.avgMinutes)}</WS.StatValue>
          </WS.StatBox>
        </WS.StatsGrid>
      </WS.SummarySection>

      {/* ── Table Section ──────────────────────────────────────────────────── */}
      <WS.TableSectionTitle>Recent Entries</WS.TableSectionTitle>
      <WS.TableContainer>
        <WS.Table>
          <thead>
            <WS.Tr>
              <WS.Th>Date</WS.Th>
              <WS.Th>Who</WS.Th>
              <WS.Th>Start &rarr; End</WS.Th>
              <WS.Th>Duration</WS.Th>
              <WS.Th>Notes</WS.Th>
              <WS.Th>Action</WS.Th>
            </WS.Tr>
          </thead>
          <tbody>
            {loadingLogs ? (
              <WS.Tr>
                <WS.EmptyStateRow colSpan={6}>
                  <CircularProgress size={24} />
                </WS.EmptyStateRow>
              </WS.Tr>
            ) : visitLogs.length === 0 ? (
              <WS.Tr>
                <WS.EmptyStateRow colSpan={6}>
                  No WorkLog Available
                </WS.EmptyStateRow>
              </WS.Tr>
            ) : (
              visitLogs.map((log) => {
                const username = (log as Record<string, any>).loggedByUsername || '-';
                const initials = username !== '-' ? username.substring(0, 2).toUpperCase() : '?';

                return (
                  <WS.Tr key={log.id}>
                    <WS.Td>{formatDate(log.visitDate)}</WS.Td>
                    <WS.Td>
                      <WS.UserBadge>
                        <WS.UserAvatar>{initials}</WS.UserAvatar>
                        {username}
                      </WS.UserBadge>
                    </WS.Td>
                    <WS.Td>
                      {formatTime(log.timeIn)} &rarr; {formatTime(log.timeOut)}
                    </WS.Td>
                    <WS.Td>
                      <WS.DurationText>{formatMinutes(log.workedMinutes)}</WS.DurationText>
                    </WS.Td>
                    <WS.Td>
                      <WS.NotesText>{log.description || '-'}</WS.NotesText>
                    </WS.Td>
                    <WS.Td>
                      <WS.ActionCell>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openModal(log)}>
                            <EditIcon sx={{ fontSize: rem(18) }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => log.id && handleDelete(log.id)}
                          >
                            <DeleteIcon sx={{ fontSize: rem(18) }} />
                          </IconButton>
                        </Tooltip>
                      </WS.ActionCell>
                    </WS.Td>
                  </WS.Tr>
                );
              })
            )}
          </tbody>
        </WS.Table>
      </WS.TableContainer>
    </WS.WorkLogsLayout>
  );
};
