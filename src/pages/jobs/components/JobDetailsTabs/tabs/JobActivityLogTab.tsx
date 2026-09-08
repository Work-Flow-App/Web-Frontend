import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Tooltip, useMediaQuery } from '@mui/material';

import type {
  JobResponse,
  JobWorkflowStepResponse,
} from '../../../../../services/api';
import { jobWorkflowService, stepActivityService, visitLogService } from '../../../../../services/api';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import * as S from './JobActivityLogTab.styles';

// ─── Types & Configuration ───────────────────────────────────────────────────

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

const VIEW_DAYS: Record<ViewMode, number> = { day: 24, week: 35, month: 60 };
const DESKTOP_COLUMN_WIDTHS: Record<ViewMode, number> = { day: 80, week: 55, month: 38 };
const MOBILE_COLUMN_WIDTHS: Record<ViewMode, number> = { day: 52, week: 38, month: 26 };

const ACTIVITY_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  STEP_CREATED:       { color: '#10B981', icon: <S.StepActionIconCreated />,       label: 'Created' },
  STATUS_CHANGED:     { color: '#8B5CF6', icon: <S.StepActionIconStatus />,        label: 'Status' },
  WORKER_ASSIGNED:    { color: '#3B82F6', icon: <S.StepActionIconAssigned />,      label: 'Assigned' },
  WORKER_UNASSIGNED:  { color: '#F59E0B', icon: <S.StepActionIconUnassigned />,    label: 'Unassigned' },
  STEP_UPDATED:       { color: '#06B6D4', icon: <S.StepActionIconUpdated />,       label: 'Updated' },
  ATTACHMENT_ADDED:   { color: '#EC4899', icon: <S.StepActionIconAttachment />,    label: 'Attachment' },
  ATTACHMENT_REMOVED: { color: '#EF4444', icon: <S.StepActionIconRemoved />,       label: 'Removed' },
  ATTACHMENT_DELETED: { color: '#EF4444', icon: <S.StepActionIconDeleted />,       label: 'Deleted' },
  COMMENT:            { color: '#6366F1', icon: <S.StepActionIconComment />,       label: 'Comment' },
  COMMENT_ADDED:      { color: '#6366F1', icon: <S.StepActionIconComment />,       label: 'Comment' },
  VISIT_LOGGED:       { color: '#0891B2', icon: <S.StepActionIconVisit />,         label: 'Visit' },
  VISIT_DELETED:      { color: '#DC2626', icon: <S.StepActionIconVisitDeleted />,  label: 'Visit del.' },
  VISIT_UPDATED:      { color: '#D97706', icon: <S.StepActionIconVisitUpdated />,  label: 'Visit upd.' },
};

const getActivityConfig = (type?: string) =>
  ACTIVITY_CONFIG[type || ''] || {
    color: '#9CA3AF',
    icon: <S.StepActionIconDefault />,
    label: type?.replace(/_/g, ' ') || 'Activity',
  };

// Step Status Visual Mapping matching workflow standards
const STEP_STATUS_CONFIG: Record<
  string,
  {
    iconBg: string;
    iconColor: string;
    barGradient: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  STARTED: {
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    barGradient: 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)',
    icon: <S.StepStatusIconInProgress />,
    label: 'In Progress',
  },
  ONGOING: {
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    barGradient: 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)',
    icon: <S.StepStatusIconInProgress />,
    label: 'In Progress',
  },
  IN_PROGRESS: {
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    barGradient: 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)',
    icon: <S.StepStatusIconInProgress />,
    label: 'In Progress',
  },
  COMPLETED: {
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    barGradient: 'linear-gradient(90deg, #4ADE80 0%, #22C55E 100%)',
    icon: <S.StepStatusIconCompleted />,
    label: 'Completed',
  },
  PENDING: {
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    barGradient: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)',
    icon: <S.StepStatusIconPending />,
    label: 'Pending',
  },
  INITIATED: {
    iconBg: '#E0E7FF',
    iconColor: '#4F46E5',
    barGradient: 'linear-gradient(90deg, #818CF8 0%, #6366F1 100%)',
    icon: <S.StepStatusIconRequested />,
    label: 'Ready',
  },
  NOT_STARTED: {
    iconBg: '#F3F4F6',
    iconColor: '#6B7280',
    barGradient: 'linear-gradient(90deg, #D1D5DB 0%, #9CA3AF 100%)',
    icon: <S.StepStatusIconScheduled />,
    label: 'To Do',
  },
  SKIPPED: {
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    barGradient: 'linear-gradient(90deg, #F87171 0%, #EF4444 100%)',
    icon: <S.StepStatusIconSkipped />,
    label: 'Skipped',
  },
};

const getStepStatus = (status?: string) => {
  const s = status?.toUpperCase() || '';
  if (STEP_STATUS_CONFIG[s]) return STEP_STATUS_CONFIG[s];
  return {
    iconBg: '#F3F4F6',
    iconColor: '#6B7280',
    barGradient: 'linear-gradient(90deg, #D1D5DB 0%, #9CA3AF 100%)',
    icon: <S.StepStatusIconScheduled />,
    label: status ? status.replace(/_/g, ' ') : 'To Do',
  };
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const JobActivityLogTab: React.FC<JobActivityLogTabProps> = ({ job, refreshTrigger }) => {
  const [steps, setSteps] = useState<StepWithTimeline[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [popover, setPopover] = useState<{
    anchor: HTMLElement;
    activities: TimelineActivity[];
    dateLabel: string;
    chipColor: string;
  } | null>(null);

  const [stepPopover, setStepPopover] = useState<{
    anchor: HTMLElement;
    step: StepWithTimeline;
    stepIdx: number;
    statusCfg: ReturnType<typeof getStepStatus>;
  } | null>(null);

  const isMobile = useMediaQuery('(max-width:600px)');
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const handleChipClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      activities: TimelineActivity[],
      dateLabel: string,
      chipColor: string
    ) => {
      e.preventDefault();
      e.stopPropagation();
      const currentTarget = e.currentTarget as HTMLElement;
      setPopover((prev) => {
        if (prev?.anchor === currentTarget) {
          return null;
        }
        return { anchor: currentTarget, activities, dateLabel, chipColor };
      });
    },
    []
  );

  const handleStepClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      step: StepWithTimeline,
      stepIdx: number,
      statusCfg: ReturnType<typeof getStepStatus>
    ) => {
      e.preventDefault();
      e.stopPropagation();
      const currentTarget = e.currentTarget as HTMLElement;
      setStepPopover((prev) => {
        if (prev?.anchor === currentTarget) return null;
        return { anchor: currentTarget, step, stepIdx, statusCfg };
      });
    },
    []
  );

  const fetchActivityData = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const workflow = workflowResponse.data;
      const activeSteps = (workflow?.steps || []).filter(
        (step: JobWorkflowStepResponse) => step.status?.toUpperCase() !== 'SKIPPED'
      );
      if (activeSteps.length === 0) {
        setSteps([]);
        return;
      }
      const stepsWithTimeline = await Promise.all(
        activeSteps.map(async (step: JobWorkflowStepResponse) => {
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
        activeSteps.map(async (step: JobWorkflowStepResponse) => {
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

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData, refreshTrigger]);

  const columnWidth = isMobile
    ? MOBILE_COLUMN_WIDTHS[viewMode]
    : DESKTOP_COLUMN_WIDTHS[viewMode];

  const timelineConfig = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Collect all actual timestamps from activities and steps
    const activityDates: Date[] = [];
    steps.forEach((step) => {
      if (step.startedAt) activityDates.push(new Date(step.startedAt));
      if (step.completedAt) activityDates.push(new Date(step.completedAt));
      step.timeline?.forEach((a) => {
        if (a.createdAt) activityDates.push(new Date(a.createdAt));
      });
    });

    // The very first column begins directly on the date of the first activity
    let minDate: Date;
    if (activityDates.length > 0) {
      const minTimestamp = Math.min(...activityDates.map((d) => d.getTime()));
      minDate = new Date(minTimestamp);
    } else {
      minDate = new Date(today);
    }
    minDate.setHours(0, 0, 0, 0);

    // End date covers the latest activity or today, plus target view days
    const latestTimestamp = activityDates.length > 0
      ? Math.max(today.getTime(), ...activityDates.map((d) => d.getTime()))
      : today.getTime();
    const maxDate = new Date(latestTimestamp);
    maxDate.setHours(0, 0, 0, 0);

    const targetDays = VIEW_DAYS[viewMode];
    const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (daysDiff < targetDays) {
      maxDate.setDate(minDate.getDate() + targetDays - 1);
    } else {
      const extraBuffer = viewMode === 'day' ? 7 : viewMode === 'week' ? 14 : 21;
      maxDate.setDate(maxDate.getDate() + extraBuffer);
    }

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

  const totalTimelineWidth = dateColumns.length * columnWidth;

  // Calculate exact pixel position for duration bars
  const getBarPixelLayout = useCallback(
    (startDate?: string, endDate?: string) => {
      if (!startDate) return null;
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(0, 0, 0, 0);

      const startIndex = dateColumns.findIndex((col) => {
        const c = new Date(col);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === start.getTime();
      });

      const endIndex = dateColumns.findIndex((col) => {
        const c = new Date(col);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === end.getTime();
      });

      const sIdx = startIndex !== -1 ? startIndex : 0;
      const eIdx = endIndex !== -1 ? endIndex : Math.max(sIdx, dateColumns.length - 1);

      const leftPx = sIdx * columnWidth + 4;
      const spanDays = Math.max(1, eIdx - sIdx + 1);
      const widthPx = Math.max(columnWidth - 8, spanDays * columnWidth - 8);

      return { leftPos: leftPx, barWidth: widthPx };
    },
    [dateColumns, columnWidth]
  );

  // Calculate exact pixel center for activity icons
  const getActivityPixelPosition = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      const colIndex = dateColumns.findIndex((col) => {
        const c = new Date(col);
        c.setHours(0, 0, 0, 0);
        return c.getTime() === date.getTime();
      });
      if (colIndex === -1) return null;
      return (colIndex + 0.5) * columnWidth;
    },
    [dateColumns, columnWidth]
  );

  const todayIndex = useMemo(() => {
    return dateColumns.findIndex((col) => {
      const c = new Date(col);
      c.setHours(0, 0, 0, 0);
      return c.getTime() === timelineConfig.today.getTime();
    });
  }, [dateColumns, timelineConfig.today]);

  const todayPixelPosition = useMemo(() => {
    if (todayIndex === -1) return null;
    return (todayIndex + 0.5) * columnWidth;
  }, [todayIndex, columnWidth]);

  // Reset scroll to 0 so the first activity column is immediately visible upon open / view switch
  useEffect(() => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [viewMode]);

  const stats = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.status === 'COMPLETED').length;
    const totalActivities = steps.reduce((sum, s) => sum + (s.timeline?.length || 0), 0);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const timeLogged = totalMinutes > 0 ? (h > 0 ? `${h}h ${m}m` : `${m}m`) : null;
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
          <S.EmptyTimelineIcon />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No activity log yet</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Activity will appear as workflow steps are started and completed
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  const todayLabel = timelineConfig.today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <S.Container>
      {/* ── 4 KPI Summary Cards (2x2 on mobile, 4 in a row on desktop) ── */}
      <S.ActivityLogStatsGrid>
        <S.ActivityWhiteCard>
          <S.StatCardLabel>Complete</S.StatCardLabel>
          <S.StatCardValueContainer>
            <S.StatCardValueMain>{stats.percentage}%</S.StatCardValueMain>
          </S.StatCardValueContainer>
          <S.StatProgressBarContainer>
            <S.StatProgressBarFill progress={stats.percentage} />
          </S.StatProgressBarContainer>
        </S.ActivityWhiteCard>

        <S.ActivityWhiteCard>
          <S.StatCardLabel>Steps Done</S.StatCardLabel>
          <S.StatCardValueContainer>
            <S.StatCardValueMain>{stats.completed}</S.StatCardValueMain>
            <S.StatCardValueSub>/{stats.total}</S.StatCardValueSub>
          </S.StatCardValueContainer>
          <S.StatCardFooterText>{stats.total - stats.completed} remaining</S.StatCardFooterText>
        </S.ActivityWhiteCard>

        <S.ActivityWhiteCard>
          <S.StatCardLabel>Activities</S.StatCardLabel>
          <S.StatCardValueContainer>
            <S.StatCardValueMain>{stats.totalActivities}</S.StatCardValueMain>
          </S.StatCardValueContainer>
          <S.StatCardFooterText>across all steps</S.StatCardFooterText>
        </S.ActivityWhiteCard>

        <S.ActivityDarkCard>
          <S.DarkCardLabel>Time Logged</S.DarkCardLabel>
          <S.DarkCardValue>{stats.timeLogged ?? '—'}</S.DarkCardValue>
          <S.DarkCardSubtext>
            {stats.timeLogged ? 'across all steps' : 'No time logs yet'}
          </S.DarkCardSubtext>
        </S.ActivityDarkCard>
      </S.ActivityLogStatsGrid>

      {/* ── Header Card ("Workflow Activity Timeline") ── */}
      <S.HeaderCard>
        <div>
          <S.HeaderTitle>Workflow Activity Timeline</S.HeaderTitle>
          <S.HeaderSubtitle>
            Real-time updates across all job steps, Today is {todayLabel}
          </S.HeaderSubtitle>
        </div>

        <S.PillToggleGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val as ViewMode)}
          size="small"
        >
          <S.PillToggleButton value="day" disableRipple>
            Day
          </S.PillToggleButton>
          <S.PillToggleButton value="week" disableRipple>
            Week
          </S.PillToggleButton>
          <S.PillToggleButton value="month" disableRipple>
            Month
          </S.PillToggleButton>
        </S.PillToggleGroup>
      </S.HeaderCard>

      {/* ── Main Gantt Timeline Matrix ─────────────────── */}
      <S.TimelineCard>
        <S.TimelineScrollWrapper ref={scrollWrapperRef}>
          <S.TimelineInnerTable>
            {/* Header Row */}
            <S.TableHeaderRow>
              <S.StepColumnHeader>
                <S.StepHeaderListIcon />
                <S.StepHeaderText>STEP</S.StepHeaderText>
              </S.StepColumnHeader>

              <S.DaysHeaderWrapper totalWidth={totalTimelineWidth}>
                {dateColumns.map((date, idx) => {
                  const isToday = date.toDateString() === timelineConfig.today.toDateString();
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <S.DayHeaderCell
                      key={idx}
                      isToday={isToday}
                      isWeekend={isWeekend}
                      colWidth={columnWidth}
                    >
                      <S.DayMonthText>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </S.DayMonthText>
                      <S.DayNumberText isToday={isToday}>
                        {date.getDate()}
                      </S.DayNumberText>
                    </S.DayHeaderCell>
                  );
                })}

                {/* Pinned Red Today Badge */}
                {todayPixelPosition !== null && (
                  <S.TodayBadge leftPos={todayPixelPosition}>
                    Today
                  </S.TodayBadge>
                )}
              </S.DaysHeaderWrapper>
            </S.TableHeaderRow>

            {/* Step Rows */}
            <S.TableBody>
              {steps.map((step, stepIdx) => {
                const activities = step.timeline || [];
                const byDate = groupActivitiesByDate(activities);
                const isCompleted = step.status === 'COMPLETED';
                const barLayout = getBarPixelLayout(step.startedAt, step.completedAt);
                const statusCfg = getStepStatus(step.status);
                const firstActor = activities.find((a) => a.actorUsername)?.actorUsername;

                return (
                  <S.TableRow key={step.id || stepIdx}>
                    {/* Left Step Card (Clickable to open Step Details Popover) */}
                    <S.StepCell
                      onClick={(e: React.MouseEvent<HTMLElement>) =>
                        handleStepClick(e, step, stepIdx, statusCfg)
                      }
                    >
                      <S.StepIconCircle
                        iconBgColor={statusCfg.iconBg}
                        iconColor={statusCfg.iconColor}
                      >
                        {/* Number on mobile */}
                        <S.StepNumberIconLabel>{stepIdx + 1}</S.StepNumberIconLabel>
                        {/* Status icon on desktop */}
                        <S.StepStatusIconBox>{statusCfg.icon}</S.StepStatusIconBox>
                      </S.StepIconCircle>

                      <S.StepInfoBox>
                        <S.StepNameText>{step.name || `Step ${stepIdx + 1}`}</S.StepNameText>
                        <S.StepMetaRow>
                          <S.StepStatusBadge
                            badgeBg={statusCfg.iconBg}
                            badgeColor={statusCfg.iconColor}
                          >
                            {statusCfg.label}
                          </S.StepStatusBadge>
                          <S.StepSubText>
                            {activities.length} {activities.length === 1 ? 'action' : 'actions'}
                            {firstActor ? ` · ${firstActor}` : ''}
                          </S.StepSubText>
                        </S.StepMetaRow>
                      </S.StepInfoBox>
                    </S.StepCell>

                    {/* Right Timeline Grid & Bars */}
                    <S.TimelineCell totalWidth={totalTimelineWidth}>
                      {/* Grid background columns */}
                      <S.GridColumnsContainer>
                        {dateColumns.map((date, idx) => {
                          const isToday = date.toDateString() === timelineConfig.today.toDateString();
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          return (
                            <S.GridColumn
                              key={idx}
                              isWeekend={isWeekend}
                              isToday={isToday}
                              colWidth={columnWidth}
                            />
                          );
                        })}
                      </S.GridColumnsContainer>

                      {/* Vertical Red Today Line */}
                      {todayPixelPosition !== null && (
                        <Tooltip title={`Today · ${todayLabel}`} placement="top" arrow>
                          <S.TodayVerticalLine leftPos={todayPixelPosition} />
                        </Tooltip>
                      )}

                      {/* Floating Rounded Pill Duration Bar */}
                      {barLayout && (
                        <Tooltip
                          title={
                            <S.GanttTooltipBox>
                              <S.GanttTooltipTitle>{step.name}</S.GanttTooltipTitle>
                              {step.startedAt && (
                                <S.GanttTooltipDetail>
                                  Start: {formatDate(step.startedAt)}
                                </S.GanttTooltipDetail>
                              )}
                              {step.completedAt && (
                                <S.GanttTooltipDetail>
                                  End: {formatDate(step.completedAt)}
                                </S.GanttTooltipDetail>
                              )}
                              <S.GanttTooltipMeta>Status: {statusCfg.label}</S.GanttTooltipMeta>
                            </S.GanttTooltipBox>
                          }
                          arrow
                          placement="top"
                        >
                          <S.PillDurationBar
                            leftPos={barLayout.leftPos}
                            barWidth={barLayout.barWidth}
                            gradientColor={statusCfg.barGradient}
                            isCompleted={isCompleted}
                          />
                        </Tooltip>
                      )}

                      {/* Compact Circular Activity Icon Badges per date column */}
                      {Object.entries(byDate).map(([dateKey, dateActivities]) => {
                        const first = dateActivities[0];
                        const actCfg = getActivityConfig(first.type);
                        const leftPos = getActivityPixelPosition(first.createdAt!);
                        if (leftPos === null) return null;

                        const MAX_PREVIEW = 3;
                        const preview = dateActivities.slice(0, MAX_PREVIEW);
                        const remaining = dateActivities.length - MAX_PREVIEW;
                        const dateLabel = first.createdAt
                          ? new Date(first.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
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
                                    <S.GanttTooltipTitle>
                                      {getActivityConfig(a.type).label}
                                    </S.GanttTooltipTitle>
                                    {a.message && <S.GanttTooltipDetail>{a.message}</S.GanttTooltipDetail>}
                                    <S.GanttTooltipMeta>
                                      {formatDate(a.createdAt)}
                                      {a.actorUsername && ` · ${a.actorUsername}`}
                                    </S.GanttTooltipMeta>
                                  </React.Fragment>
                                ))}
                                {remaining > 0 && (
                                  <S.GanttTooltipMore>
                                    + {remaining} more · click to view all
                                  </S.GanttTooltipMore>
                                )}
                              </S.GanttTooltipBox>
                            }
                            arrow
                            placement="top"
                            disableFocusListener
                            disableTouchListener
                            open={popover ? false : undefined}
                          >
                            <S.ActivityCircleBadge
                              leftPos={leftPos}
                              chipColor={actCfg.color}
                              isOnBar={Boolean(barLayout)}
                              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                                handleChipClick(e, dateActivities, dateLabel, actCfg.color)
                              }
                            >
                              {actCfg.icon}
                              {dateActivities.length > 1 && (
                                <S.ActivityCountBadge>{dateActivities.length}</S.ActivityCountBadge>
                              )}
                            </S.ActivityCircleBadge>
                          </Tooltip>
                        );
                      })}
                    </S.TimelineCell>
                  </S.TableRow>
                );
              })}
            </S.TableBody>
          </S.TimelineInnerTable>
        </S.TimelineScrollWrapper>
      </S.TimelineCard>

      {/* ── Workflow Status Legend Card ───────────────── */}
      <S.LegendCard>
        <S.LegendTitle>STATUS TYPES</S.LegendTitle>
        <S.LegendBadgesWrapper>
          <S.LegendItem>
            <S.LegendIconCompleted />
            <span>Completed</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendIconInProgress />
            <span>In Progress</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendIconPending />
            <span>Pending</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendIconReady />
            <span>Ready</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendIconToDo />
            <span>To Do</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendIconSkipped />
            <span>Skipped</span>
          </S.LegendItem>
        </S.LegendBadgesWrapper>
      </S.LegendCard>

      {/* ── Recent Activity Stream ───────────────────── */}
      {recentActivities.length > 0 && (
        <S.RecentActivitySection>
          <S.RecentActivityLabel>Recent Activity</S.RecentActivityLabel>
          {recentActivities.slice(0, 8).map((activity, idx) => {
            const actor = activity.actorUsername || 'System';
            const badge = actor === 'System' ? 'SYS' : actor.slice(0, 3).toUpperCase();
            return (
              <S.RecentActivityItem key={activity.id || idx}>
                <S.RecentActivityBadge>{badge}</S.RecentActivityBadge>
                <S.RecentActivityContent>
                  <S.RecentActivityText>
                    <S.RecentActorName>{actor}</S.RecentActorName>{' '}
                    {activity.message || getActivityConfig(activity.type).label}{' '}
                    <S.RecentStepBullet>• {activity.stepName}</S.RecentStepBullet>
                  </S.RecentActivityText>
                </S.RecentActivityContent>
                <S.RecentTimeText>{formatTimeAgo(activity.createdAt)}</S.RecentTimeText>
              </S.RecentActivityItem>
            );
          })}
        </S.RecentActivitySection>
      )}

      {/* ── Popover for Step Details on Step Click (Mobile & Desktop) ── */}
      <S.StyledPopover
        open={Boolean(stepPopover)}
        anchorEl={stepPopover?.anchor ?? null}
        onClose={() => setStepPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        marginThreshold={8}
      >
        {stepPopover && (
          <S.StepPopoverPaper>
            <S.StepPopoverTopRow>
              <S.StepPopoverNumberBadge>Step {stepPopover.stepIdx + 1}</S.StepPopoverNumberBadge>
              <S.StepStatusBadge
                badgeBg={stepPopover.statusCfg.iconBg}
                badgeColor={stepPopover.statusCfg.iconColor}
              >
                {stepPopover.statusCfg.label}
              </S.StepStatusBadge>
            </S.StepPopoverTopRow>

            <S.StepPopoverTitle>
              {stepPopover.step.name || `Step ${stepPopover.stepIdx + 1}`}
            </S.StepPopoverTitle>

            {stepPopover.step.startedAt && (
              <S.StepPopoverDetailItem>
                <S.StepPopoverCalendarIcon />
                <span>Started: {formatDate(stepPopover.step.startedAt)}</span>
              </S.StepPopoverDetailItem>
            )}

            {stepPopover.step.completedAt && (
              <S.StepPopoverDetailItem>
                <S.StepPopoverCalendarIcon />
                <span>Completed: {formatDate(stepPopover.step.completedAt)}</span>
              </S.StepPopoverDetailItem>
            )}

            <S.StepPopoverDetailItem>
              <S.StepPopoverActionIcon />
              <span>
                {(stepPopover.step.timeline || []).length}{' '}
                {(stepPopover.step.timeline || []).length === 1
                  ? 'activity logged'
                  : 'activities logged'}
              </span>
            </S.StepPopoverDetailItem>
          </S.StepPopoverPaper>
        )}
      </S.StyledPopover>

      {/* ── Popover for Activity Details on Date Click ─ */}
      <S.StyledPopover
        open={Boolean(popover)}
        anchorEl={popover?.anchor ?? null}
        onClose={() => setPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        marginThreshold={8}
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
                const cfg = getActivityConfig(activity.type);
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
                        {' · '}
                        {actor}
                      </S.ActivityPopoverItemMeta>
                    </S.ActivityPopoverContent>
                  </S.ActivityPopoverItem>
                );
              })}
            </S.ActivityPopoverList>
          </S.ActivityPopoverPaper>
        )}
      </S.StyledPopover>
    </S.Container>
  );
};
