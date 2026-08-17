import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { CircularProgress, Tooltip, IconButton, useMediaQuery, useTheme, Box, Typography, ClickAwayListener } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(false);

  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | 'all' | null>('all');
  const [visitLogs, setVisitLogs] = useState<StepVisitLogResponse[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [popupLog, setPopupLog] = useState<StepVisitLogResponse | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchWorkflow = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoadingWorkflow(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const sorted = [...(response.data.steps || [])]
        .filter((step) => step.status?.toUpperCase() !== 'SKIPPED')
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setSteps(sorted);
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
      if (selectedStepId === 'all') {
        const promises = steps.map((step) => {
          if (!step.id) return Promise.resolve({ data: { visitLogs: [], totalWorkedMinutes: 0 } });
          return visitLogService.getVisitLogs(step.id);
        });
        const results = await Promise.all(promises);

        let allLogs: (StepVisitLogResponse & { stepName?: string; stepId?: number })[] = [];
        let combinedMinutes = 0;

        results.forEach((res, index) => {
          const stepLogs = res.data.visitLogs || [];
          const stepName = steps[index].name || `Step ${index + 1}`;
          const stepId = steps[index].id;

          allLogs = allLogs.concat(
            stepLogs.map((log) => ({
              ...log,
              stepName,
              stepId,
            }))
          );
          combinedMinutes += res.data.totalWorkedMinutes || 0;
        });

        // Sort by date/time: newest first.
        allLogs.sort((a, b) => {
          const dateA = a.visitDate ? new Date(a.visitDate).getTime() : 0;
          const dateB = b.visitDate ? new Date(b.visitDate).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;

          const timeA = a.timeIn || '';
          const timeB = b.timeIn || '';
          if (timeB !== timeA) return timeB.localeCompare(timeA);

          return (b.id || 0) - (a.id || 0);
        });

        setVisitLogs(allLogs);
        setTotalMinutes(combinedMinutes);
      } else {
        const response = await visitLogService.getVisitLogs(selectedStepId);
        const stepLogs = response.data.visitLogs || [];

        // Sort by date/time: newest first.
        const sortedLogs = [...stepLogs].sort((a, b) => {
          const dateA = a.visitDate ? new Date(a.visitDate).getTime() : 0;
          const dateB = b.visitDate ? new Date(b.visitDate).getTime() : 0;
          if (dateB !== dateA) return dateB - dateA;

          const timeA = a.timeIn || '';
          const timeB = b.timeIn || '';
          if (timeB !== timeA) return timeB.localeCompare(timeA);

          return (b.id || 0) - (a.id || 0);
        });

        setVisitLogs(sortedLogs);
        setTotalMinutes(response.data.totalWorkedMinutes || 0);
      }
    } catch {
      setVisitLogs([]);
      setTotalMinutes(0);
    } finally {
      setLoadingLogs(false);
    }
  }, [selectedStepId, steps]);

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



  // ── Modal helpers ────────────────────────────────────────────────────────────

  const handleRowClick = useCallback(
    (log: StepVisitLogResponse) => {
      setPopupLog(log);
    },
    []
  );
  const openModal = useCallback((editLog?: StepVisitLogResponse) => {
    if (!selectedStepId) return;
    const logStepId = editLog ? (editLog as any).stepId : null;
    const resolvedStepId = selectedStepId === 'all' ? logStepId : selectedStepId;
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorkLog',
      children: (
        <AddWorkLogModal
          stepId={resolvedStepId}
          steps={steps}
          editLog={editLog || null}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            showSuccess(editLog ? 'Work log updated' : 'Work log added');
            fetchVisitLogs();
          }}
        />
      ),
    });
  }, [selectedStepId, steps, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, fetchVisitLogs]);

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
      <WS.WorkLogsEmptyFeedBox>
        <WS.EmptyFeedIcon />
        <span>No workflow steps found for this job.</span>
      </WS.WorkLogsEmptyFeedBox>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <WS.WorkLogsOuterLayout>

      <ClickAwayListener onClickAway={() => {
        if (isMobile && isPipelineExpanded) {
          setIsPipelineExpanded(false);
        }
      }}>
        <WS.StepsRail $expanded={isMobile ? isPipelineExpanded : undefined}>
          <WS.StepsRailHeader>
            <WS.StepsRailTitle>STEPS</WS.StepsRailTitle>
   
            {/* Search icon + expanding input */}
            <ClickAwayListener onClickAway={() => {
              if (searchOpen) {
                setSearchOpen(false);
                setSearchValue('');
              }
            }}>
              <WS.StepSearchWrapper>
                <Tooltip title={searchOpen ? 'Close' : 'Jump to step'} placement="right">
                  <WS.JumpToStepButton
                    size="medium"
                    onClick={handleSearchIconClick}
                  >
                    <WS.SearchStepIcon />
                  </WS.JumpToStepButton>
                </Tooltip>
   
                <WS.SearchSlideOut $open={searchOpen}>
                  <WS.SearchSlideOutInput
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
                  />
                  <WS.SearchCheckButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchSubmit();
                    }}
                    aria-label="Confirm search"
                  >
                    <CheckIcon sx={{ fontSize: '1.1rem' }} />
                  </WS.SearchCheckButton>
                </WS.SearchSlideOut>
              </WS.StepSearchWrapper>
            </ClickAwayListener>
          </WS.StepsRailHeader>
   
          {/* Step circles with connectors */}
          <WS.StepsBubbleList>
            {/* ALL Bubble */}
            <WS.StepBubbleItem>
              <Tooltip title="All Work Logs" placement="right" arrow>
                <WS.AllStepCircle
                  isActive={selectedStepId === 'all'}
                  stepColor="#101a32"
                  onClick={() => {
                    setSelectedStepId('all');
                    if (isMobile) setIsPipelineExpanded(false);
                  }}
                >
                  ALL
                </WS.AllStepCircle>
              </Tooltip>
              {(!isMobile || isPipelineExpanded) && steps.length > 0 && <WS.StepConnector />}
            </WS.StepBubbleItem>
   
            {/* Individual steps */}
            {(!isMobile || isPipelineExpanded) && steps.map((step, idx) => {
              const isActive = selectedStepId === step.id;
              return (
                <WS.StepBubbleItem key={step.id}>
                  <Tooltip
                    title={`${idx + 1}. ${step.name || `Step ${idx + 1}`}`}
                    placement="right"
                    arrow
                  >
                    <WS.StepCircle
                      isActive={isActive}
                      stepColor={getStepColor(idx)}
                      onClick={() => {
                        if (step.id) {
                          setSelectedStepId(step.id);
                          if (isMobile) setIsPipelineExpanded(false);
                        }
                      }}
                    >
                      {idx + 1}
                    </WS.StepCircle>
                  </Tooltip>
                  {idx < steps.length - 1 && <WS.StepConnector />}
                </WS.StepBubbleItem>
              );
            })}
          </WS.StepsBubbleList>
   
          {/* Mobile expand/collapse arrow */}
          {isMobile && (
            <WS.RailArrowButton
              onClick={() => setIsPipelineExpanded(!isPipelineExpanded)}
              aria-label={isPipelineExpanded ? 'Collapse steps' : 'Expand steps'}
            >
              {isPipelineExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </WS.RailArrowButton>
          )}
        </WS.StepsRail>
      </ClickAwayListener>

      {/* ── Right Content Column ──────────────────────────────────────────── */}
      <WS.WorkLogsLayout>

        {/* ── Summary Section ─────────────────────────────────────────────── */}
        <WS.SummarySection>
          <WS.TrackingBox>
            <WS.TimerIconBox>
              <WS.TimerIcon />
            </WS.TimerIconBox>
            <WS.TrackingInfo>
              <WS.TrackingLabel>
                {selectedStepId === 'all'
                  ? 'CURRENTLY TRACKING — ALL STEPS'
                  : `CURRENTLY TRACKING — ${selectedStep?.name?.toUpperCase() || 'STEP'}`}
              </WS.TrackingLabel>
              <WS.TrackingTime>{formatMinutes(totalMinutes)}</WS.TrackingTime>
            </WS.TrackingInfo>
          </WS.TrackingBox>

          <WS.StatsGrid>
            <WS.StatBox>
              <WS.StatLabel>Total Hours</WS.StatLabel>
              <WS.StatValue>{summary.totalHours.toFixed(1)}h</WS.StatValue>
            </WS.StatBox>
            <WS.AddLogBox sx={{ gridColumn: isMobile ? 'span 3' : 'auto', order: isMobile ? 4 : 0 }}>
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
          {isMobile ? (
            loadingLogs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, width: '100%' }}>
                <CircularProgress size={20} />
              </Box>
            ) : visitLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4, width: '100%', display: 'block' }}>
                No WorkLog Available
              </Typography>
            ) : (
              visitLogs.map((log) => {
                const username = (log as Record<string, any>).loggedByUsername || '-';
                const initials = username !== '-'
                  ? username.substring(0, 2).toUpperCase()
                  : '?';

                return (
                  <WS.WorkLogMobileCard
                    key={log.id}
                    onClick={() => handleRowClick(log)}
                  >
                    <WS.WorkLogCardHeader>
                      <WS.WorkLogCardHeaderLeft>
                        <WS.UserAvatar>{initials}</WS.UserAvatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {username}
                        </Typography>
                      </WS.WorkLogCardHeaderLeft>
                      <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" onClick={() => openModal(log)} aria-label="Edit">
                          <WS.ActionEditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => log.id && handleDelete(log.id)} aria-label="Delete">
                          <WS.ActionDeleteIcon />
                        </IconButton>
                      </Box>
                    </WS.WorkLogCardHeader>

                    <WS.WorkLogCardBody>
                      <WS.WorkLogCardRow>
                        <Typography variant="body2" color="text.secondary">
                          Date:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatDate(log.visitDate)}
                        </Typography>
                      </WS.WorkLogCardRow>
                      <WS.WorkLogCardRow>
                        <Typography variant="body2" color="text.secondary">
                          Time:
                        </Typography>
                        <Typography variant="body2">
                          {formatTime(log.timeIn)} → {formatTime(log.timeOut)}
                        </Typography>
                      </WS.WorkLogCardRow>
                      <WS.WorkLogCardRow>
                        <Typography variant="body2" color="text.secondary">
                          Duration:
                        </Typography>
                        <WS.DurationText>{formatMinutes(log.workedMinutes)}</WS.DurationText>
                      </WS.WorkLogCardRow>
                      {selectedStepId === 'all' && (
                        <WS.WorkLogCardRow>
                          <Typography variant="body2" color="text.secondary">
                            Step:
                          </Typography>
                          <WS.StepNameText>{(log as any).stepName || '-'}</WS.StepNameText>
                        </WS.WorkLogCardRow>
                      )}
                      {log.description && (
                        <Box sx={{ mt: 0.5, pt: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
                          <WS.WorkLogCardDescription>
                            {log.description}
                          </WS.WorkLogCardDescription>
                        </Box>
                      )}
                    </WS.WorkLogCardBody>
                  </WS.WorkLogMobileCard>
                );
              })
            )
          ) : (
            <WS.Table>
              <thead>
                {/* Header row — not clickable */}
                <WS.Tr>
                  <WS.Th>Date</WS.Th>
                  <WS.Th>Who</WS.Th>
                  <WS.Th>Start → End</WS.Th>
                  <WS.Th>Duration</WS.Th>
                  {selectedStepId === 'all' && <WS.Th>Step</WS.Th>}
                  <WS.Th>Notes</WS.Th>
                  <WS.Th>Action</WS.Th>
                </WS.Tr>
              </thead>
              <tbody>
                {loadingLogs ? (
                  <tr>
                    <WS.EmptyStateRow colSpan={selectedStepId === 'all' ? 7 : 6}>
                      <CircularProgress size={20} />
                    </WS.EmptyStateRow>
                  </tr>
                ) : visitLogs.length === 0 ? (
                  <tr>
                    <WS.EmptyStateRow colSpan={selectedStepId === 'all' ? 7 : 6}>
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
                        onClick={() => handleRowClick(log)}
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

                        {selectedStepId === 'all' && (
                          <WS.Td>
                            <WS.StepNameText>
                              {(log as any).stepName || '-'}
                            </WS.StepNameText>
                          </WS.Td>
                        )}

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
                                <WS.ActionEditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => log.id && handleDelete(log.id)}
                              >
                                <WS.ActionDeleteIcon />
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
          )}
        </WS.TableContainer>
      </WS.WorkLogsLayout>

      {/* ── Note Detail Popup ─────────────────────────────────────────────── */}
      {popupLog && (
        /* Backdrop — click outside to close */
        <WS.NotePopupBackdrop onClick={() => setPopupLog(null)}>
          {/* Card — stop propagation so clicking inside doesn't close */}
          <WS.NotePopupCard onClick={(e) => e.stopPropagation()}>

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
