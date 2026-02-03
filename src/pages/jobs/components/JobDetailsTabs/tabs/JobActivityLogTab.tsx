import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type {
  JobResponse,
  JobWorkflowStepResponse,
} from '../../../../../services/api';
import { jobWorkflowService, stepActivityService } from '../../../../../services/api';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import * as S from '../../../JobDetailsPage.styles';

interface JobActivityLogTabProps {
  job: JobResponse;
}

interface TimelineActivity {
  id?: number;
  type?: string;
  message?: string;
  actorId?: number;
  createdAt?: string;
}

interface StepWithTimeline extends JobWorkflowStepResponse {
  timeline?: TimelineActivity[];
}

// Gantt bar colors - matching the reference image style
const GANTT_COLORS = [
  { primary: '#1E3A5F', secondary: '#2563EB', light: '#DBEAFE' }, // Navy/Blue
  { primary: '#DC2626', secondary: '#EF4444', light: '#FEE2E2' }, // Red
  { primary: '#D97706', secondary: '#F59E0B', light: '#FEF3C7' }, // Orange
  { primary: '#059669', secondary: '#10B981', light: '#D1FAE5' }, // Green
  { primary: '#7C3AED', secondary: '#8B5CF6', light: '#EDE9FE' }, // Purple
  { primary: '#0891B2', secondary: '#06B6D4', light: '#CFFAFE' }, // Cyan
  { primary: '#DB2777', secondary: '#EC4899', light: '#FCE7F3' }, // Pink
];

// Activity type config
const ACTIVITY_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  STEP_CREATED: { color: '#10B981', icon: <AddCircleOutlineIcon sx={{ fontSize: 12 }} />, label: 'Created' },
  STATUS_CHANGED: { color: '#8B5CF6', icon: <SwapHorizIcon sx={{ fontSize: 12 }} />, label: 'Status' },
  WORKER_ASSIGNED: { color: '#3B82F6', icon: <PersonAddIcon sx={{ fontSize: 12 }} />, label: 'Assigned' },
  WORKER_UNASSIGNED: { color: '#F59E0B', icon: <PersonIcon sx={{ fontSize: 12 }} />, label: 'Unassigned' },
  STEP_UPDATED: { color: '#06B6D4', icon: <EditIcon sx={{ fontSize: 12 }} />, label: 'Updated' },
  ATTACHMENT_ADDED: { color: '#EC4899', icon: <UploadFileIcon sx={{ fontSize: 12 }} />, label: 'Attachment' },
  ATTACHMENT_REMOVED: { color: '#EF4444', icon: <AttachFileIcon sx={{ fontSize: 12 }} />, label: 'Removed' },
  COMMENT: { color: '#6366F1', icon: <ChatBubbleOutlineIcon sx={{ fontSize: 12 }} />, label: 'Comment' },
  COMMENT_ADDED: { color: '#6366F1', icon: <ChatBubbleOutlineIcon sx={{ fontSize: 12 }} />, label: 'Comment' },
};

const getActivityConfig = (type?: string) => {
  return ACTIVITY_CONFIG[type || ''] || {
    color: '#9CA3AF',
    icon: <TimelineIcon sx={{ fontSize: 12 }} />,
    label: type?.replace('_', ' ') || 'Activity',
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

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

export const JobActivityLogTab: React.FC<JobActivityLogTabProps> = ({ job }) => {
  const [steps, setSteps] = useState<StepWithTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityData = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const workflow = workflowResponse.data;

      if (!workflow?.steps || workflow.steps.length === 0) {
        setSteps([]);
        return;
      }

      const stepsWithTimeline = await Promise.all(
        workflow.steps.map(async (step: JobWorkflowStepResponse) => {
          if (!step.id) return { ...step, timeline: [] };
          try {
            const timelineResponse = await stepActivityService.getTimeline(step.id);
            return { ...step, timeline: (timelineResponse.data || []) as TimelineActivity[] };
          } catch {
            return { ...step, timeline: [] };
          }
        })
      );

      stepsWithTimeline.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setSteps(stepsWithTimeline);
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  }, [job.id]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  // Calculate timeline range
  const timelineConfig = useMemo(() => {
    const allDates: Date[] = [];

    steps.forEach((step) => {
      if (step.startedAt) allDates.push(new Date(step.startedAt));
      if (step.completedAt) allDates.push(new Date(step.completedAt));
      step.timeline?.forEach((activity) => {
        if (activity.createdAt) allDates.push(new Date(activity.createdAt));
      });
    });

    const today = new Date();
    allDates.push(today);

    if (allDates.length <= 1) {
      const start = new Date(today);
      start.setDate(start.getDate() - 3);
      const end = new Date(today);
      end.setDate(end.getDate() + 4);
      return { startDate: start, endDate: end, totalDays: 7, today };
    }

    let minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    let maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    // Add padding
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 2);

    // Ensure minimum 7 days range
    const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      maxDate.setDate(minDate.getDate() + 7);
    }

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return { startDate: minDate, endDate: maxDate, totalDays, today };
  }, [steps]);

  // Generate date columns for header
  const dateColumns = useMemo(() => {
    const columns: Date[] = [];
    const current = new Date(timelineConfig.startDate);

    while (current <= timelineConfig.endDate) {
      columns.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return columns;
  }, [timelineConfig]);

  // Calculate bar position
  const getBarPosition = (startDate?: string, endDate?: string) => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const totalMs = timelineConfig.endDate.getTime() - timelineConfig.startDate.getTime();

    const startOffset = start.getTime() - timelineConfig.startDate.getTime();
    const duration = end.getTime() - start.getTime();

    const left = Math.max(0, (startOffset / totalMs) * 100);
    const width = Math.max(1.5, Math.min((duration / totalMs) * 100, 100 - left));

    return { left: `${left}%`, width: `${width}%` };
  };

  // Get today line position
  const todayPosition = useMemo(() => {
    const totalMs = timelineConfig.endDate.getTime() - timelineConfig.startDate.getTime();
    const todayOffset = timelineConfig.today.getTime() - timelineConfig.startDate.getTime();
    return `${(todayOffset / totalMs) * 100}%`;
  }, [timelineConfig]);

  // Stats
  const stats = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.status === 'COMPLETED').length;
    const totalActivities = steps.reduce((sum, s) => sum + (s.timeline?.length || 0), 0);
    return { total, completed, totalActivities, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [steps]);

  if (loading) {
    return <Loader size={40} centered minHeight="200px" />;
  }

  if (steps.length === 0) {
    return (
      <S.DocumentsEmptyState>
        <S.DocumentsEmptyIcon>
          <TimelineIcon sx={{ fontSize: 32 }} />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No activity log yet</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Activity will be recorded as workflow steps are started and completed
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <S.GanttChartHeader>
        <S.GanttChartTitle>
          <TimelineIcon sx={{ fontSize: 22, color: '#1E3A5F' }} />
          <span>Activity Log</span>
        </S.GanttChartTitle>
        <S.GanttChartStats>
          <S.GanttChartStatBox>
            <span className="value">{stats.percentage}%</span>
            <span className="label">Complete</span>
          </S.GanttChartStatBox>
          <S.GanttChartStatBox>
            <span className="value">{stats.completed}/{stats.total}</span>
            <span className="label">Steps</span>
          </S.GanttChartStatBox>
          <S.GanttChartStatBox>
            <span className="value">{stats.totalActivities}</span>
            <span className="label">Activities</span>
          </S.GanttChartStatBox>
        </S.GanttChartStats>
      </S.GanttChartHeader>

      {/* Gantt Chart */}
      <S.GanttChartWrapper>
        {/* Date Header Row */}
        <S.GanttChartGrid>
          <S.GanttChartTaskHeader>Task Name</S.GanttChartTaskHeader>
          <S.GanttChartTimelineHeader>
            {dateColumns.map((date, idx) => {
              const isToday = date.toDateString() === timelineConfig.today.toDateString();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <S.GanttChartDateCell key={idx} isToday={isToday} isWeekend={isWeekend}>
                  <span className="day">{date.getDate()}</span>
                  <span className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </S.GanttChartDateCell>
              );
            })}
          </S.GanttChartTimelineHeader>
        </S.GanttChartGrid>

        {/* Task Rows */}
        <S.GanttChartBody>
          {steps.map((step, stepIdx) => {
            const colorScheme = GANTT_COLORS[stepIdx % GANTT_COLORS.length];
            const barPos = getBarPosition(
              step.startedAt || step.timeline?.[0]?.createdAt,
              step.completedAt || (step.timeline && step.timeline.length > 0 ? step.timeline[step.timeline.length - 1]?.createdAt : undefined)
            );
            const activities = step.timeline || [];
            const isCompleted = step.status === 'COMPLETED';

            return (
              <React.Fragment key={step.id || stepIdx}>
                {/* Main Step Row */}
                <S.GanttChartRow isMainTask>
                  <S.GanttChartTaskCell>
                    <S.GanttChartTaskName>
                      <S.GanttChartTaskIcon style={{ backgroundColor: colorScheme.primary }}>
                        {isCompleted ? (
                          <CheckCircleIcon sx={{ fontSize: 14, color: '#fff' }} />
                        ) : (
                          <PlayArrowIcon sx={{ fontSize: 14, color: '#fff' }} />
                        )}
                      </S.GanttChartTaskIcon>
                      <span className="name">{step.name || 'Unnamed Step'}</span>
                      {activities.length > 0 && (
                        <span className="count">({activities.length})</span>
                      )}
                    </S.GanttChartTaskName>
                  </S.GanttChartTaskCell>
                  <S.GanttChartTimelineCell>
                    {/* Grid columns */}
                    <S.GanttChartGridColumns>
                      {dateColumns.map((date, idx) => {
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        return <S.GanttChartGridColumn key={idx} isWeekend={isWeekend} />;
                      })}
                    </S.GanttChartGridColumns>

                    {/* Today marker */}
                    <S.GanttChartTodayLine style={{ left: todayPosition }} />

                    {/* Step bar */}
                    {barPos && (
                      <Tooltip
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Box sx={{ fontWeight: 600, mb: 0.5 }}>{step.name}</Box>
                            <Box sx={{ fontSize: 11 }}>
                              {step.startedAt && <div>Start: {formatDate(step.startedAt)}</div>}
                              {step.completedAt && <div>End: {formatDate(step.completedAt)}</div>}
                              <div>Status: {step.status?.replace('_', ' ')}</div>
                              <div>Activities: {activities.length}</div>
                            </Box>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <S.GanttChartBar
                          style={{
                            left: barPos.left,
                            width: barPos.width,
                            backgroundColor: colorScheme.primary,
                          }}
                          isCompleted={isCompleted}
                        >
                          <S.GanttChartBarLabel>{step.name}</S.GanttChartBarLabel>
                        </S.GanttChartBar>
                      </Tooltip>
                    )}
                  </S.GanttChartTimelineCell>
                </S.GanttChartRow>

                {/* Activity Sub-rows */}
                {activities.map((activity, actIdx) => {
                  const config = getActivityConfig(activity.type);
                  const activityPos = activity.createdAt ? getBarPosition(activity.createdAt, activity.createdAt) : null;

                  return (
                    <S.GanttChartRow key={activity.id || actIdx} isSubTask>
                      <S.GanttChartTaskCell>
                        <S.GanttChartSubTaskName>
                          <S.GanttChartActivityIcon style={{ backgroundColor: config.color }}>
                            {config.icon}
                          </S.GanttChartActivityIcon>
                          <span className="type">{config.label}</span>
                          <span className="message">{activity.message}</span>
                        </S.GanttChartSubTaskName>
                      </S.GanttChartTaskCell>
                      <S.GanttChartTimelineCell>
                        <S.GanttChartGridColumns>
                          {dateColumns.map((date, idx) => {
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            return <S.GanttChartGridColumn key={idx} isWeekend={isWeekend} />;
                          })}
                        </S.GanttChartGridColumns>

                        <S.GanttChartTodayLine style={{ left: todayPosition }} />

                        {activityPos && (
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Box sx={{ fontWeight: 600, mb: 0.5 }}>{config.label}</Box>
                                <Box sx={{ fontSize: 11 }}>{activity.message}</Box>
                                <Box sx={{ fontSize: 10, mt: 0.5, opacity: 0.8 }}>
                                  {formatDate(activity.createdAt)}
                                  {activity.actorId && ` • User #${activity.actorId}`}
                                </Box>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <S.GanttChartActivityBar
                              style={{
                                left: activityPos.left,
                                backgroundColor: config.color,
                              }}
                            >
                              {config.icon}
                              <span>{formatShortDate(new Date(activity.createdAt!))}</span>
                            </S.GanttChartActivityBar>
                          </Tooltip>
                        )}
                      </S.GanttChartTimelineCell>
                    </S.GanttChartRow>
                  );
                })}
              </React.Fragment>
            );
          })}
        </S.GanttChartBody>
      </S.GanttChartWrapper>

      {/* Legend */}
      <S.GanttChartLegend>
        <S.GanttChartLegendSection>
          <span className="title">Activity Types:</span>
          {Object.entries(ACTIVITY_CONFIG).slice(0, 6).map(([key, config]) => (
            <S.GanttChartLegendItem key={key}>
              <S.GanttChartLegendDot style={{ backgroundColor: config.color }} />
              <span>{config.label}</span>
            </S.GanttChartLegendItem>
          ))}
        </S.GanttChartLegendSection>
        <S.GanttChartLegendSection>
          <S.GanttChartLegendItem>
            <S.GanttChartTodayIndicator />
            <span>Today</span>
          </S.GanttChartLegendItem>
        </S.GanttChartLegendSection>
      </S.GanttChartLegend>
    </Box>
  );
};
