import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Tooltip, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import UpdateIcon from '@mui/icons-material/Update';
import type {
  JobResponse,
  JobWorkflowStepResponse,
} from '../../../../../services/api';
import { jobWorkflowService, stepActivityService, visitLogService } from '../../../../../services/api';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import * as S from '../../../JobDetailsPage.styles';
import * as OV from '../../OverviewField/OverviewField.styles';

interface JobActivityLogTabProps {
  job: JobResponse;
  refreshTrigger?: number;
}

interface TimelineActivity {
  id?: number;
  type?: string;
  message?: string;
  actorId?: number;
  actorUsername?: string;
  createdAt?: string;
}

interface StepWithTimeline extends JobWorkflowStepResponse {
  timeline?: TimelineActivity[];
}

type ViewMode = 'day' | 'week' | 'month';

const VIEW_DAYS: Record<ViewMode, number> = { day: 7, week: 14, month: 31 };

// Semantic activity-type color palette (intentional design choices)
const ACTIVITY_COLORS = {
  STEP_CREATED:       '#10B981',
  STATUS_CHANGED:     '#8B5CF6',
  WORKER_ASSIGNED:    '#3B82F6',
  WORKER_UNASSIGNED:  '#F59E0B',
  STEP_UPDATED:       '#06B6D4',
  ATTACHMENT_ADDED:   '#EC4899',
  ATTACHMENT_REMOVED: '#EF4444',
  ATTACHMENT_DELETED: '#EF4444',
  COMMENT:            '#6366F1',
  COMMENT_ADDED:      '#6366F1',
  VISIT_LOGGED:       '#0891B2',
  VISIT_DELETED:      '#DC2626',
  VISIT_UPDATED:      '#D97706',
} as const;

const ACTIVITY_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  STEP_CREATED:       { color: ACTIVITY_COLORS.STEP_CREATED,       icon: <AddCircleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Created'    },
  STATUS_CHANGED:     { color: ACTIVITY_COLORS.STATUS_CHANGED,     icon: <SwapHorizIcon sx={{ fontSize: 10 }} />,        label: 'Status'     },
  WORKER_ASSIGNED:    { color: ACTIVITY_COLORS.WORKER_ASSIGNED,    icon: <PersonAddIcon sx={{ fontSize: 10 }} />,         label: 'Assigned'   },
  WORKER_UNASSIGNED:  { color: ACTIVITY_COLORS.WORKER_UNASSIGNED,  icon: <PersonIcon sx={{ fontSize: 10 }} />,            label: 'Unassigned' },
  STEP_UPDATED:       { color: ACTIVITY_COLORS.STEP_UPDATED,       icon: <EditIcon sx={{ fontSize: 10 }} />,              label: 'Updated'    },
  ATTACHMENT_ADDED:   { color: ACTIVITY_COLORS.ATTACHMENT_ADDED,   icon: <UploadFileIcon sx={{ fontSize: 10 }} />,        label: 'Attachment' },
  ATTACHMENT_REMOVED: { color: ACTIVITY_COLORS.ATTACHMENT_REMOVED, icon: <AttachFileIcon sx={{ fontSize: 10 }} />,        label: 'Removed'    },
  ATTACHMENT_DELETED: { color: ACTIVITY_COLORS.ATTACHMENT_DELETED, icon: <DeleteOutlineIcon sx={{ fontSize: 10 }} />,     label: 'Deleted'    },
  COMMENT:            { color: ACTIVITY_COLORS.COMMENT,            icon: <ChatBubbleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Comment'    },
  COMMENT_ADDED:      { color: ACTIVITY_COLORS.COMMENT_ADDED,      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 10 }} />, label: 'Comment'    },
  VISIT_LOGGED:       { color: ACTIVITY_COLORS.VISIT_LOGGED,       icon: <EventNoteIcon sx={{ fontSize: 10 }} />,         label: 'Visit'      },
  VISIT_DELETED:      { color: ACTIVITY_COLORS.VISIT_DELETED,      icon: <EventBusyIcon sx={{ fontSize: 10 }} />,         label: 'Visit del.' },
  VISIT_UPDATED:      { color: ACTIVITY_COLORS.VISIT_UPDATED,      icon: <UpdateIcon sx={{ fontSize: 10 }} />,            label: 'Visit upd.' },
};

const getActivityConfig = (type?: string) =>
  ACTIVITY_CONFIG[type || ''] || {
    color: '#9CA3AF',
    icon: <TimelineIcon sx={{ fontSize: 10 }} />,
    label: type?.replace(/_/g, ' ') || 'Activity',
  };

const STEP_STATUS_LABELS: Record<string, string> = {
  ACTIVE:           'Active',
  IN_PROGRESS:      'In progress',
  PENDING:          'Pending',
  COMPLETED:        'Completed',
  CANNOT_COMPLETE:  'Cannot complete',
  NOT_STARTED:      'Not started',
  ONGOING:          'Ongoing',
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes} min ago`;
  return 'just now';
};

const groupActivitiesByDate = (activities: TimelineActivity[]) => {
  const map: Record<string, TimelineActivity[]> = {};
  activities.forEach((a) => {
    if (!a.createdAt) return;
    const key = new Date(a.createdAt).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push(a);
  });
  return map;
};

export const JobActivityLogTab: React.FC<JobActivityLogTabProps> = ({ job, refreshTrigger }) => {
  const theme = useTheme();
  const [steps, setSteps] = useState<StepWithTimeline[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [popover, setPopover] = useState<{
    anchor: HTMLElement;
    activities: TimelineActivity[];
    dateLabel: string;
    chipColor: string;
  } | null>(null);

  const handleChipClick = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      activities: TimelineActivity[],
      dateLabel: string,
      chipColor: string
    ) => {
      e.stopPropagation();
      setPopover({ anchor: e.currentTarget, activities, dateLabel, chipColor });
    },
    []
  );

  // Step bar colors drawn from theme palette
  const stepColors = useMemo(
    () => [
      theme.palette.primary.dark,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.success.dark,
      '#7C3AED',                   // violet — not in standard MUI palette
      theme.palette.info.main,
      theme.palette.primary.main,
    ],
    [theme]
  );

  const fetchActivityData = useCallback(async () => {
    if (!job.id) { setLoading(false); return; }
    try {
      setLoading(true);
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const workflow = workflowResponse.data;
      if (!workflow?.steps || workflow.steps.length === 0) { setSteps([]); return; }
      const stepsWithTimeline = await Promise.all(
        workflow.steps.map(async (step: JobWorkflowStepResponse) => {
          if (!step.id) return { ...step, timeline: [] };
          try {
            const res = await stepActivityService.getTimeline(step.id);
            return { ...step, timeline: (res.data || []) as TimelineActivity[] };
          } catch {
            return { ...step, timeline: [] };
          }
        })
      );
      stepsWithTimeline.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setSteps(stepsWithTimeline);

      const minuteResults = await Promise.all(
        workflow.steps.map(async (step: JobWorkflowStepResponse) => {
          if (!step.id) return 0;
          try {
            const res = await visitLogService.getVisitLogs(step.id);
            return res.data?.totalWorkedMinutes || 0;
          } catch {
            return 0;
          }
        })
      );
      setTotalMinutes(minuteResults.reduce((sum, m) => sum + m, 0));
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  }, [job.id]);

  useEffect(() => { fetchActivityData(); }, [fetchActivityData, refreshTrigger]);

  const timelineConfig = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allDates: Date[] = [today];
    steps.forEach((step) => {
      if (step.startedAt) allDates.push(new Date(step.startedAt));
      if (step.completedAt) allDates.push(new Date(step.completedAt));
      step.timeline?.forEach((a) => { if (a.createdAt) allDates.push(new Date(a.createdAt)); });
    });
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 2);
    const targetDays = VIEW_DAYS[viewMode];
    const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < targetDays) maxDate.setDate(minDate.getDate() + targetDays);
    return { startDate: minDate, endDate: maxDate, today };
  }, [steps, viewMode]);

  const dateColumns = useMemo(() => {
    const columns: Date[] = [];
    const current = new Date(timelineConfig.startDate);
    while (current <= timelineConfig.endDate) {
      columns.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return columns;
  }, [timelineConfig]);

  const getBarPosition = useCallback(
    (startDate?: string, endDate?: string) => {
      if (!startDate) return null;
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      const totalMs = timelineConfig.endDate.getTime() - timelineConfig.startDate.getTime();
      const startOffset = start.getTime() - timelineConfig.startDate.getTime();
      const duration = end.getTime() - start.getTime();
      const left = Math.max(0, (startOffset / totalMs) * 100);
      const width = Math.max(1.5, Math.min((duration / totalMs) * 100, 100 - left));
      return { left: `${left}%`, width: `${width}%` };
    },
    [timelineConfig]
  );

  const getChipLeft = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      const colIndex = dateColumns.findIndex((col) => {
        const c = new Date(col);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === date.getTime();
      });
      if (colIndex === -1) return null;
      return `${((colIndex + 0.5) / dateColumns.length) * 100}%`;
    },
    [dateColumns]
  );

  const todayPosition = useMemo(() => {
    const totalMs = timelineConfig.endDate.getTime() - timelineConfig.startDate.getTime();
    const todayOffset = timelineConfig.today.getTime() - timelineConfig.startDate.getTime();
    return `${(todayOffset / totalMs) * 100}%`;
  }, [timelineConfig]);

  const stats = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.status === 'COMPLETED').length;
    const totalActivities = steps.reduce((sum, s) => sum + (s.timeline?.length || 0), 0);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const timeLogged = totalMinutes > 0
      ? (h > 0 ? `${h}h ${m}m` : `${m}m`)
      : null;
    return {
      total,
      completed,
      totalActivities,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      timeLogged,
    };
  }, [steps, totalMinutes]);

  const recentActivities = useMemo(() => {
    const all: Array<TimelineActivity & { stepName: string }> = [];
    steps.forEach((step) => {
      (step.timeline || []).forEach((activity) => {
        all.push({ ...activity, stepName: step.name || 'Unknown step' });
      });
    });
    return all.sort((a, b) => {
      const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dB - dA;
    });
  }, [steps]);

  if (loading) return <Loader size={40} centered minHeight="200px" />;

  if (steps.length === 0) {
    return (
      <S.DocumentsEmptyState>
        <S.DocumentsEmptyIcon>
          <TimelineIcon sx={{ fontSize: 32 }} />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No activity log yet</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Activity will appear as workflow steps are started and completed
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  const todayLabel = timelineConfig.today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <S.ActivityLogContainer>

      {/* ── Stats cards ─────────────────────────────── */}
      <S.ActivityLogStatsGrid>
        <OV.OverviewCard>
          <OV.CardLabel>Complete</OV.CardLabel>
          <OV.CardValueContainer>
            <OV.CardValueMain>{stats.percentage}%</OV.CardValueMain>
          </OV.CardValueContainer>
          <OV.ProgressBarContainer>
            <OV.ProgressBarFill progress={stats.percentage} />
          </OV.ProgressBarContainer>
        </OV.OverviewCard>

        <OV.OverviewCard>
          <OV.CardLabel>Steps Done</OV.CardLabel>
          <OV.CardValueContainer>
            <OV.CardValueMain>{stats.completed}</OV.CardValueMain>
            <OV.CardValueSub>/{stats.total}</OV.CardValueSub>
          </OV.CardValueContainer>
        </OV.OverviewCard>

        <OV.OverviewCard>
          <OV.CardLabel>Activities</OV.CardLabel>
          <OV.CardValueContainer>
            <OV.CardValueMain>{stats.totalActivities}</OV.CardValueMain>
          </OV.CardValueContainer>
          <OV.CardFooterText>across all steps</OV.CardFooterText>
        </OV.OverviewCard>

        <S.ActivityDarkCard>
          <S.DarkCardLabel>Time Logged</S.DarkCardLabel>
          <S.DarkCardValue>{stats.timeLogged ?? '—'}</S.DarkCardValue>
          <S.DarkCardSubtext>
            {stats.timeLogged ? 'across all steps' : 'No time logs yet'}
          </S.DarkCardSubtext>
        </S.ActivityDarkCard>
      </S.ActivityLogStatsGrid>

      {/* ── Activity Timeline ────────────────────────── */}
      <S.ActivityTimelineSection>

        {/* Section header */}
        <S.ActivityTimelineTopBar>
          <div>
            <S.ActivitySectionTitle>Activity timeline</S.ActivitySectionTitle>
            <S.ActivitySectionSubtitle>
              Every action on this job, by step. Today is {todayLabel}.
            </S.ActivitySectionSubtitle>
          </div>

          <S.ActivityTimelineControls>
            <S.GanttViewToggleGroup
              value={viewMode}
              exclusive
              onChange={(_, val) => val && setViewMode(val as ViewMode)}
              size="small"
            >
              <S.GanttViewToggleButton value="day" disableRipple>Day</S.GanttViewToggleButton>
              <S.GanttViewToggleButton value="week" disableRipple>Week</S.GanttViewToggleButton>
              <S.GanttViewToggleButton value="month" disableRipple>Month</S.GanttViewToggleButton>
            </S.GanttViewToggleGroup>
          </S.ActivityTimelineControls>
        </S.ActivityTimelineTopBar>

        {/* Date header row */}
        <S.GanttChartGrid>
          <S.GanttChartTaskHeader>Step</S.GanttChartTaskHeader>
          <S.GanttChartTimelineHeader>
            {dateColumns.map((date, idx) => {
              const isToday   = date.toDateString() === timelineConfig.today.toDateString();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <S.GanttChartDateCell key={idx} isToday={isToday} isWeekend={isWeekend}>
                  <span className="month">
                    {date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </span>
                  <span className="day">{date.getDate()}</span>
                </S.GanttChartDateCell>
              );
            })}
          </S.GanttChartTimelineHeader>
        </S.GanttChartGrid>

        {/* Step rows */}
        <S.GanttChartBody>
          {steps.map((step, stepIdx) => {
            const dotColor    = stepColors[stepIdx % stepColors.length];
            const activities  = step.timeline || [];
            const byDate      = groupActivitiesByDate(activities);
            const isCompleted = step.status === 'COMPLETED';
            const barPos      = getBarPosition(step.startedAt, step.completedAt);
            const statusLabel = STEP_STATUS_LABELS[step.status || ''] || step.status || 'Pending';

            return (
              <S.GanttChartRow key={step.id || stepIdx} isMainTask>

                {/* Left: step identity */}
                <S.GanttChartTaskCell>
                  <S.GanttStepCellInner>
                    <S.GanttStepDot dotColor={dotColor} className="gantt-step-dot" />
                    <S.GanttStepNameBox>
                      <S.GanttStepNameText className="gantt-step-name">
                        {step.name || 'Unnamed Step'}
                      </S.GanttStepNameText>
                      <S.GanttStepStatusText>{statusLabel}</S.GanttStepStatusText>
                    </S.GanttStepNameBox>
                    {activities.length > 0 && (
                      <S.GanttStepBadge>{activities.length}</S.GanttStepBadge>
                    )}
                  </S.GanttStepCellInner>
                </S.GanttChartTaskCell>

                {/* Right: timeline */}
                <S.GanttChartTimelineCell>
                  {/* Background grid columns */}
                  <S.GanttChartGridColumns>
                    {dateColumns.map((date, idx) => {
                      const isToday   = date.toDateString() === timelineConfig.today.toDateString();
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                        <S.GanttChartGridColumn key={idx} isWeekend={isWeekend} isToday={isToday} />
                      );
                    })}
                  </S.GanttChartGridColumns>

                  {/* Today marker */}
                  <Tooltip
                    title={`Today · ${todayLabel}`}
                    placement="top"
                    arrow
                  >
                    <S.GanttChartTodayLine style={{ left: todayPosition }} />
                  </Tooltip>

                  {/* Duration bar (step start → end) */}
                  {barPos && (
                    <Tooltip
                      title={
                        <S.GanttTooltipBox>
                          <S.GanttTooltipTitle>{step.name}</S.GanttTooltipTitle>
                          {step.startedAt && (
                            <S.GanttTooltipDetail>Start: {formatDate(step.startedAt)}</S.GanttTooltipDetail>
                          )}
                          {step.completedAt && (
                            <S.GanttTooltipDetail>End: {formatDate(step.completedAt)}</S.GanttTooltipDetail>
                          )}
                          <S.GanttTooltipMeta>Status: {statusLabel}</S.GanttTooltipMeta>
                        </S.GanttTooltipBox>
                      }
                      arrow
                      placement="top"
                    >
                      <S.GanttChartBar
                        style={{ left: barPos.left, width: barPos.width, backgroundColor: dotColor }}
                        isCompleted={isCompleted}
                      >
                        <S.GanttChartBarLabel>{step.name}</S.GanttChartBarLabel>
                      </S.GanttChartBar>
                    </Tooltip>
                  )}

                  {/* Activity chips — one chip per date group */}
                  {Object.entries(byDate).map(([dateKey, dateActivities]) => {
                    const first      = dateActivities[0];
                    const config     = getActivityConfig(first.type);
                    const chipLeft   = getChipLeft(first.createdAt!);
                    if (!chipLeft) return null;

                    const MAX_PREVIEW = 3;
                    const preview     = dateActivities.slice(0, MAX_PREVIEW);
                    const remaining   = dateActivities.length - MAX_PREVIEW;
                    const dateLabel   = first.createdAt
                      ? new Date(first.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : dateKey;

                    return (
                      <Tooltip
                        key={dateKey}
                        title={
                          <S.GanttTooltipBox>
                            <S.GanttTooltipHeader>
                              {dateLabel} · {dateActivities.length}{' '}
                              {dateActivities.length === 1 ? 'activity' : 'activities'}
                            </S.GanttTooltipHeader>
                            {preview.map((a, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <S.GanttTooltipDivider />}
                                <S.GanttTooltipTitle>{getActivityConfig(a.type).label}</S.GanttTooltipTitle>
                                {a.message && <S.GanttTooltipDetail>{a.message}</S.GanttTooltipDetail>}
                                <S.GanttTooltipMeta>
                                  {formatDate(a.createdAt)}
                                  {a.actorUsername && ` · ${a.actorUsername}`}
                                </S.GanttTooltipMeta>
                              </React.Fragment>
                            ))}
                            {remaining > 0 && (
                              <S.GanttTooltipMore>
                                + {remaining} more · click to see all
                              </S.GanttTooltipMore>
                            )}
                          </S.GanttTooltipBox>
                        }
                        arrow
                        placement="top"
                      >
                        <S.GanttActivityChip
                          chipColor={config.color}
                          style={{ left: chipLeft }}
                          onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                            handleChipClick(e, dateActivities, dateLabel, config.color)
                          }
                        >
                          <AddIcon sx={{ fontSize: 9 }} />
                          {config.label}
                          {dateActivities.length > 1 && ` (${dateActivities.length})`}
                        </S.GanttActivityChip>
                      </Tooltip>
                    );
                  })}
                </S.GanttChartTimelineCell>
              </S.GanttChartRow>
            );
          })}
        </S.GanttChartBody>

        {/* Legend */}
        <S.GanttLegendRow>
          <S.GanttLegendTypeLabel>Activity types:</S.GanttLegendTypeLabel>
          {Object.entries(ACTIVITY_CONFIG).slice(0, 7).map(([key, config]) => (
            <S.GanttLegendItem key={key}>
              <S.GanttLegendDot dotColor={config.color} />
              <S.GanttLegendText>{config.label}</S.GanttLegendText>
            </S.GanttLegendItem>
          ))}
          <S.GanttLegendTodayMarker>
            <S.GanttLegendTodayBar />
            <S.GanttLegendText>Today</S.GanttLegendText>
          </S.GanttLegendTodayMarker>
        </S.GanttLegendRow>
      </S.ActivityTimelineSection>

      {/* ── Recent Activity ──────────────────────────── */}
      {recentActivities.length > 0 && (
        <S.RecentActivitySection>
          <S.RecentActivityLabel>Recent Activity</S.RecentActivityLabel>
          {recentActivities.slice(0, 8).map((activity, idx) => {
            const actor    = activity.actorUsername || 'System';
            const badge    = actor === 'System' ? 'SYS' : actor.slice(0, 3).toUpperCase();
            return (
              <S.RecentActivityItem key={activity.id || idx}>
                <S.RecentActivityBadge>{badge}</S.RecentActivityBadge>
                <S.RecentActivityContent>
                  <S.RecentActivityText>
                    <S.RecentActorName>{actor}</S.RecentActorName>
                    {' '}{activity.message || getActivityConfig(activity.type).label}{' '}
                    <S.RecentStepBullet>• {activity.stepName}</S.RecentStepBullet>
                  </S.RecentActivityText>
                </S.RecentActivityContent>
                <S.RecentTimeText>{formatTimeAgo(activity.createdAt)}</S.RecentTimeText>
              </S.RecentActivityItem>
            );
          })}
        </S.RecentActivitySection>
      )}
      {/* ── Activity detail Popover (chip click) ─────── */}
      <Popover
        open={Boolean(popover)}
        anchorEl={popover?.anchor ?? null}
        onClose={() => setPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        marginThreshold={8}
        slotProps={{ paper: { elevation: 8, sx: { borderRadius: 1.5, overflow: 'hidden' } } }}
      >
        {popover && (
          <S.ActivityPopoverPaper>
            <S.ActivityPopoverHeader>
              <S.ActivityPopoverTitle>{popover.dateLabel}</S.ActivityPopoverTitle>
              <S.ActivityPopoverBadge>
                {popover.activities.length}{' '}
                {popover.activities.length === 1 ? 'activity' : 'activities'}
              </S.ActivityPopoverBadge>
            </S.ActivityPopoverHeader>

            <S.ActivityPopoverList>
              {popover.activities.map((activity, i) => {
                const cfg  = getActivityConfig(activity.type);
                const actor = activity.actorUsername || 'System';
                return (
                  <S.ActivityPopoverItem key={activity.id || i}>
                    <S.ActivityPopoverIconBox iconColor={cfg.color}>
                      {cfg.icon}
                    </S.ActivityPopoverIconBox>
                    <S.ActivityPopoverContent>
                      <S.ActivityPopoverItemType>{cfg.label}</S.ActivityPopoverItemType>
                      {activity.message && (
                        <S.ActivityPopoverItemMessage>{activity.message}</S.ActivityPopoverItemMessage>
                      )}
                      <S.ActivityPopoverItemMeta>
                        {formatDate(activity.createdAt)}
                        {' · '}{actor}
                      </S.ActivityPopoverItemMeta>
                    </S.ActivityPopoverContent>
                  </S.ActivityPopoverItem>
                );
              })}
            </S.ActivityPopoverList>
          </S.ActivityPopoverPaper>
        )}
      </Popover>
    </S.ActivityLogContainer>
  );
};
