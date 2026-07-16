import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { CircularProgress, Tooltip, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
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

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [visitLogs, setVisitLogs] = useState<StepVisitLogResponse[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [popupLog, setPopupLog] = useState<StepVisitLogResponse | null>(null);
  // Vertical centre (px from viewport top) of the row that was clicked
  const [popupY, setPopupY] = useState<number>(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Data fetching ────────────────────────────────────────────────────────────

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

  // ── Derived values ───────────────────────────────────────────────────────────

  const summary = useMemo(() => {
    const totalEntries = visitLogs.length;
    const totalHours = totalMinutes / 60;
    const avgMinutes = totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0;
    return { totalEntries, totalHours, avgMinutes };
  }, [visitLogs, totalMinutes]);

  const selectedStep = steps.find((s) => s.id === selectedStepId);

  // ── Search handler ───────────────────────────────────────────────────────────

  const handleSearchSubmit = useCallback(() => {
    const num = parseInt(searchValue, 10);
    if (isNaN(num) || num < 1 || num > steps.length) {
      showError('This step not exist');
      setSearchValue('');
      setSearchOpen(false);
      return;
    }
    const targetStep = steps[num - 1];
    if (targetStep?.id) setSelectedStepId(targetStep.id);
    setSearchValue('');
    setSearchOpen(false);
  }, [searchValue, steps, showError]);

  const handleSearchIconClick = useCallback(() => {
    if (searchOpen) {
      setSearchOpen(false);
      setSearchValue('');
    } else {
      setSearchOpen(true);
      // Focus the input after it mounts
      setTimeout(() => searchInputRef.current?.focus(), 30);
    }
  }, [searchOpen]);

  const handleSearchBlur = useCallback(() => {
    // Small delay so that Enter-key submit can clear state before blur fires
    setTimeout(() => {
      setSearchOpen(false);
      setSearchValue('');
    }, 120);
  }, []);

  // ── Modal helpers ────────────────────────────────────────────────────────────

  const handleRowClick = useCallback(
    (log: StepVisitLogResponse, e: React.MouseEvent<HTMLTableRowElement>) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const rawY = rect.top + rect.height / 2;
      // Clamp so the popup card (est. ~100px tall) never overflows the viewport
      const clampedY = Math.max(60, Math.min(rawY, window.innerHeight - 60));
      setPopupY(clampedY);
      setPopupLog(log);
    },
    []
  );
  const openModal = useCallback((editLog?: StepVisitLogResponse) => {
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
  }, [selectedStepId, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, fetchVisitLogs]);

  const handleDelete = useCallback(async (visitLogId: number) => {
    try {
      await visitLogService.deleteVisitLog(visitLogId);
      showSuccess('Work log deleted');
      fetchVisitLogs();
    } catch {
      showError('Failed to delete work log');
    }
  }, [showSuccess, showError, fetchVisitLogs]);

  // ── Guards ───────────────────────────────────────────────────────────────────

  if (loadingWorkflow) return <Loader centered minHeight="300px" />;

  if (!steps.length) {
    return (
      <WS.EmptyFeedBox sx={{ minHeight: 300 }}>
        <AccessTimeIcon sx={{ fontSize: rem(48), color: 'grey.200' }} />
        <span>No workflow steps found for this job.</span>
      </WS.EmptyFeedBox>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <WS.WorkLogsOuterLayout>

      {/* ── Left Steps Rail ───────────────────────────────────────────────── */}
      <WS.StepsRail>
        <WS.StepsRailHeader>
          <WS.StepsRailTitle>STEPS</WS.StepsRailTitle>

          {/* Search icon + expanding input */}
          <WS.StepSearchWrapper>
            <Tooltip title={searchOpen ? 'Close' : 'Jump to step'} placement="right">
              <IconButton
                size="medium"
                onClick={handleSearchIconClick}
                sx={{ width: rem(32), height: rem(32), padding: 0 }}
              >
                <SearchIcon sx={{ fontSize: rem(20) }} />
              </IconButton>
            </Tooltip>

            {searchOpen && (
              <WS.StepSearchInput
                ref={searchInputRef}
                type="number"
                value={searchValue}
                placeholder="#"
                min={1}
                max={steps.length}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit();
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                    setSearchValue('');
                  }
                }}
                onBlur={handleSearchBlur}
              />
            )}
          </WS.StepSearchWrapper>
        </WS.StepsRailHeader>

        {/* Step circles with connectors */}
        <WS.StepsBubbleList>
          {steps.map((step, idx) => {
            const isActive = selectedStepId === step.id;
            return (
              <WS.StepBubbleItem key={step.id}>
                {idx > 0 && <WS.StepConnector />}
                <Tooltip
                  title={`${idx + 1}. ${step.name || `Step ${idx + 1}`}`}
                  placement="right"
                  arrow
                >
                  <WS.StepCircle
                    isActive={isActive}
                    stepColor={getStepColor(idx)}
                    onClick={() => step.id && setSelectedStepId(step.id)}
                  >
                    {idx + 1}
                  </WS.StepCircle>
                </Tooltip>
              </WS.StepBubbleItem>
            );
          })}
        </WS.StepsBubbleList>
      </WS.StepsRail>

      {/* ── Right Content Column ──────────────────────────────────────────── */}
      <WS.WorkLogsLayout>

        {/* ── Summary Section ─────────────────────────────────────────────── */}
        <WS.SummarySection>
          <WS.TrackingBox>
            <WS.TimerIconBox>
              <AccessTimeIcon sx={{ fontSize: rem(32), color: 'white' }} />
            </WS.TimerIconBox>
            <WS.TrackingInfo>
              <WS.TrackingLabel>
                CURRENTLY TRACKING — {selectedStep?.name?.toUpperCase() || 'STEP'}
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

        {/* ── Table Section ────────────────────────────────────────────────── */}
        <WS.TableSectionTitle>Recent Entries</WS.TableSectionTitle>
        <WS.TableContainer>
          <WS.Table>
            <thead>
              {/* Header row — not clickable */}
              <WS.Tr>
                <WS.Th>Date</WS.Th>
                <WS.Th>Who</WS.Th>
                <WS.Th>Start → End</WS.Th>
                <WS.Th>Duration</WS.Th>
                <WS.Th>Notes</WS.Th>
                <WS.Th>Action</WS.Th>
              </WS.Tr>
            </thead>
            <tbody>
              {loadingLogs ? (
                <tr>
                  <WS.EmptyStateRow colSpan={6}>
                    <CircularProgress size={20} />
                  </WS.EmptyStateRow>
                </tr>
              ) : visitLogs.length === 0 ? (
                <tr>
                  <WS.EmptyStateRow colSpan={6}>
                    No WorkLog Available
                  </WS.EmptyStateRow>
                </tr>
              ) : (
                visitLogs.map((log) => {
                  const username = (log as Record<string, any>).loggedByUsername || '-';
                  const initials = username !== '-'
                    ? username.substring(0, 2).toUpperCase()
                    : '?';

                  return (
                    /* Data row — clicking anywhere opens the popup */
                    <WS.DataTr
                      key={log.id}
                      onClick={(e) => handleRowClick(log, e)}
                    >
                      <WS.Td>{formatDate(log.visitDate)}</WS.Td>

                      <WS.Td>
                        <WS.UserBadge>
                          <WS.UserAvatar>{initials}</WS.UserAvatar>
                          {username}
                        </WS.UserBadge>
                      </WS.Td>

                      <WS.Td>
                        {formatTime(log.timeIn)} → {formatTime(log.timeOut)}
                      </WS.Td>

                      <WS.Td>
                        <WS.DurationText>{formatMinutes(log.workedMinutes)}</WS.DurationText>
                      </WS.Td>

                      {/* Notes — truncated, full text in title attr for native tooltip */}
                      <WS.NotesTd title={log.description || undefined}>
                        {log.description || '-'}
                      </WS.NotesTd>

                      {/* Action buttons — stop propagation so row click doesn't fire */}
                      <WS.Td onClick={(e) => e.stopPropagation()}>
                        <WS.ActionCell>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openModal(log)}
                            >
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
                        </WS.ActionCell>
                      </WS.Td>
                    </WS.DataTr>
                  );
                })
              )}
            </tbody>
          </WS.Table>
        </WS.TableContainer>
      </WS.WorkLogsLayout>

      {/* ── Note Detail Popup ─────────────────────────────────────────────── */}
      {popupLog && (
        /* Backdrop — click outside to close */
        <WS.NotePopupBackdrop onClick={() => setPopupLog(null)}>
          {/* Card — stop propagation so clicking inside doesn't close */}
          <WS.NotePopupCard yOffset={popupY} onClick={(e) => e.stopPropagation()}>

            {/* Line 1: start→end time + ✕ close button */}
            <WS.NotePopupHeader>
              <WS.NotePopupTimeValue>
                {formatTime(popupLog.timeIn)} → {formatTime(popupLog.timeOut)}
              </WS.NotePopupTimeValue>
              <WS.NotePopupCloseBtn
                onClick={() => setPopupLog(null)}
                aria-label="Close"
              >
                ✕
              </WS.NotePopupCloseBtn>
            </WS.NotePopupHeader>

            {/* Line 2: full note (only rendered when note exists) */}
            {popupLog.description && (
              <>
                <WS.NotePopupDivider />
                <WS.NotePopupNoteText>{popupLog.description}</WS.NotePopupNoteText>
              </>
            )}

          </WS.NotePopupCard>
        </WS.NotePopupBackdrop>
      )}

    </WS.WorkLogsOuterLayout>
  );
};
