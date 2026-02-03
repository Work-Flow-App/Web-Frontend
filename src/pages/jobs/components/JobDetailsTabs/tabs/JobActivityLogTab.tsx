import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Tooltip, Collapse, IconButton } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
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

// Timeline item from API
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

// Status colors for visual distinction
const STATUS_COLORS = {
  COMPLETED: { bg: '#10B981', text: '#ffffff', light: '#D1FAE5' },
  ONGOING: { bg: '#3B82F6', text: '#ffffff', light: '#DBEAFE' },
  STARTED: { bg: '#8B5CF6', text: '#ffffff', light: '#EDE9FE' },
  PENDING: { bg: '#F59E0B', text: '#ffffff', light: '#FEF3C7' },
  NOT_STARTED: { bg: '#9CA3AF', text: '#ffffff', light: '#F3F4F6' },
  INITIATED: { bg: '#6366F1', text: '#ffffff', light: '#E0E7FF' },
  SKIPPED: { bg: '#EF4444', text: '#ffffff', light: '#FEE2E2' },
} as const;

// Activity type colors and icons
const ACTIVITY_CONFIG: Record<string, { color: string; lightColor: string; icon: React.ReactNode; label: string }> = {
  STEP_CREATED: {
    color: '#10B981',
    lightColor: '#D1FAE5',
    icon: <AddCircleOutlineIcon sx={{ fontSize: 16 }} />,
    label: 'Step Created'
  },
  STATUS_CHANGED: {
    color: '#8B5CF6',
    lightColor: '#EDE9FE',
    icon: <SwapHorizIcon sx={{ fontSize: 16 }} />,
    label: 'Status Changed'
  },
  WORKER_ASSIGNED: {
    color: '#3B82F6',
    lightColor: '#DBEAFE',
    icon: <PersonAddIcon sx={{ fontSize: 16 }} />,
    label: 'Worker Assigned'
  },
  WORKER_UNASSIGNED: {
    color: '#F59E0B',
    lightColor: '#FEF3C7',
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    label: 'Worker Unassigned'
  },
  STEP_UPDATED: {
    color: '#06B6D4',
    lightColor: '#CFFAFE',
    icon: <EditIcon sx={{ fontSize: 16 }} />,
    label: 'Step Updated'
  },
  ATTACHMENT_ADDED: {
    color: '#EC4899',
    lightColor: '#FCE7F3',
    icon: <UploadFileIcon sx={{ fontSize: 16 }} />,
    label: 'Attachment Added'
  },
  ATTACHMENT_REMOVED: {
    color: '#EF4444',
    lightColor: '#FEE2E2',
    icon: <AttachFileIcon sx={{ fontSize: 16 }} />,
    label: 'Attachment Removed'
  },
  COMMENT: {
    color: '#6366F1',
    lightColor: '#E0E7FF',
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />,
    label: 'Comment'
  },
  COMMENT_ADDED: {
    color: '#6366F1',
    lightColor: '#E0E7FF',
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />,
    label: 'Comment Added'
  },
};

const getActivityConfig = (type?: string) => {
  return ACTIVITY_CONFIG[type || ''] || {
    color: '#9CA3AF',
    lightColor: '#F3F4F6',
    icon: <TimelineIcon sx={{ fontSize: 16 }} />,
    label: type || 'Activity',
  };
};

const getStatusColor = (status?: string) => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.NOT_STARTED;
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircleIcon sx={{ fontSize: 16 }} />;
    case 'ONGOING':
    case 'STARTED':
      return <PlayArrowIcon sx={{ fontSize: 16 }} />;
    case 'PENDING':
      return <PauseCircleIcon sx={{ fontSize: 16 }} />;
    default:
      return <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (startDate?: string, endDate?: string) => {
  if (!startDate) return '-';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h`;
  }
  if (diffHours > 0) {
    return `${diffHours}h`;
  }
  const diffMins = Math.floor(diffMs / (1000 * 60));
  return `${diffMins}m`;
};

export const JobActivityLogTab: React.FC<JobActivityLogTabProps> = ({ job }) => {
  const [steps, setSteps] = useState<StepWithTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const fetchActivityData = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get the job workflow
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const workflow = workflowResponse.data;

      if (!workflow?.steps || workflow.steps.length === 0) {
        setSteps([]);
        setLoading(false);
        return;
      }

      // Fetch timeline for all steps in parallel
      const stepsWithTimeline = await Promise.all(
        workflow.steps.map(async (step: JobWorkflowStepResponse) => {
          if (!step.id) return { ...step, timeline: [] };

          try {
            const timelineResponse = await stepActivityService.getTimeline(step.id);
            return {
              ...step,
              timeline: (timelineResponse.data || []) as TimelineActivity[],
            };
          } catch {
            return { ...step, timeline: [] };
          }
        })
      );

      // Sort by order index
      stepsWithTimeline.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setSteps(stepsWithTimeline);

      // Auto-expand steps that have activities
      const stepsWithActivities = stepsWithTimeline
        .filter((s) => s.timeline && s.timeline.length > 0)
        .map((s) => s.id)
        .filter((id): id is number => id !== undefined);
      setExpandedSteps(new Set(stepsWithActivities));
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

  const toggleStepExpanded = (stepId: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  // Calculate the timeline range
  const timelineRange = useMemo(() => {
    const dates: Date[] = [];
    steps.forEach((step) => {
      if (step.startedAt) dates.push(new Date(step.startedAt));
      if (step.completedAt) dates.push(new Date(step.completedAt));
      // Also include activity dates
      step.timeline?.forEach((activity) => {
        if (activity.createdAt) dates.push(new Date(activity.createdAt));
      });
    });

    if (dates.length === 0) {
      const now = new Date();
      return {
        start: now,
        end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        totalDays: 7,
      };
    }

    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    minDate.setHours(0, 0, 0, 0);
    maxDate.setDate(maxDate.getDate() + 1);
    maxDate.setHours(23, 59, 59, 999);

    const totalDays = Math.max(
      1,
      Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    return { start: minDate, end: maxDate, totalDays };
  }, [steps]);

  // Calculate bar position and width for each step
  const calculateBarStyle = (step: StepWithTimeline) => {
    if (!step.startedAt) {
      return { left: '0%', width: '0%', opacity: 0.3 };
    }

    const startDate = new Date(step.startedAt);
    const endDate = step.completedAt ? new Date(step.completedAt) : new Date();

    const totalMs = timelineRange.end.getTime() - timelineRange.start.getTime();
    const startOffset = startDate.getTime() - timelineRange.start.getTime();
    const duration = endDate.getTime() - startDate.getTime();

    const left = Math.max(0, (startOffset / totalMs) * 100);
    const width = Math.max(2, (duration / totalMs) * 100);

    return {
      left: `${left}%`,
      width: `${Math.min(width, 100 - left)}%`,
      opacity: 1,
    };
  };

  // Generate date markers
  const dateMarkers = useMemo(() => {
    const markers: Date[] = [];
    const currentDate = new Date(timelineRange.start);

    while (currentDate <= timelineRange.end) {
      markers.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (markers.length > 7) {
      const step = Math.ceil(markers.length / 7);
      return markers.filter((_, index) => index % step === 0);
    }

    return markers;
  }, [timelineRange]);

  // Calculate completion percentage
  const completionStats = useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.status === 'COMPLETED').length;
    const inProgress = steps.filter((s) => s.status === 'ONGOING' || s.status === 'STARTED' || s.status === 'INITIATED').length;
    const totalActivities = steps.reduce((sum, s) => sum + (s.timeline?.length || 0), 0);
    return {
      total,
      completed,
      inProgress,
      totalActivities,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Stats */}
      <S.GanttHeader>
        <S.GanttTitle>
          <TimelineIcon sx={{ fontSize: 24, color: '#6366F1' }} />
          <span>Workflow Activity Timeline</span>
        </S.GanttTitle>
        <S.GanttStats>
          <S.GanttStatItem>
            <span className="label">Progress</span>
            <S.GanttProgressBar>
              <S.GanttProgressFill style={{ width: `${completionStats.percentage}%` }} />
            </S.GanttProgressBar>
            <span className="value">{completionStats.percentage}%</span>
          </S.GanttStatItem>
          <S.GanttStatItem>
            <span className="label">Completed</span>
            <span className="value completed">{completionStats.completed}/{completionStats.total}</span>
          </S.GanttStatItem>
          <S.GanttStatItem>
            <span className="label">In Progress</span>
            <span className="value in-progress">{completionStats.inProgress}</span>
          </S.GanttStatItem>
          <S.GanttStatItem>
            <span className="label">Activities</span>
            <span className="value">{completionStats.totalActivities}</span>
          </S.GanttStatItem>
        </S.GanttStats>
      </S.GanttHeader>

      {/* Gantt Chart */}
      <S.GanttContainer>
        {/* Date Header */}
        <S.GanttDateHeader>
          <S.GanttTaskColumn>Step</S.GanttTaskColumn>
          <S.GanttTimelineColumn>
            {dateMarkers.map((date, index) => (
              <S.GanttDateMarker
                key={index}
                style={{ left: `${(index / (dateMarkers.length - 1 || 1)) * 100}%` }}
              >
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </S.GanttDateMarker>
            ))}
          </S.GanttTimelineColumn>
        </S.GanttDateHeader>

        {/* Step Rows */}
        <S.GanttBody>
          {steps.map((step, index) => {
            const statusColor = getStatusColor(step.status);
            const barStyle = calculateBarStyle(step);
            const activityCount = step.timeline?.length || 0;
            const isExpanded = step.id ? expandedSteps.has(step.id) : false;

            return (
              <React.Fragment key={step.id || index}>
                <S.GanttRow isEven={index % 2 === 0}>
                  {/* Task Info */}
                  <S.GanttTaskColumn>
                    <S.GanttTaskInfo>
                      <S.GanttTaskIndex style={{ backgroundColor: statusColor.light, color: statusColor.bg }}>
                        {index + 1}
                      </S.GanttTaskIndex>
                      <S.GanttTaskDetails>
                        <S.GanttTaskName>{step.name || 'Unnamed Step'}</S.GanttTaskName>
                        <S.GanttTaskMeta>
                          <S.GanttStatusBadge style={{ backgroundColor: statusColor.light, color: statusColor.bg }}>
                            {getStatusIcon(step.status)}
                            <span>{step.status?.replace('_', ' ') || 'Not Started'}</span>
                          </S.GanttStatusBadge>
                          {activityCount > 0 && (
                            <Tooltip title={`${activityCount} activities - Click to ${isExpanded ? 'collapse' : 'expand'}`}>
                              <IconButton
                                size="small"
                                onClick={() => step.id && toggleStepExpanded(step.id)}
                                sx={{
                                  padding: '2px',
                                  backgroundColor: '#F3F4F6',
                                  '&:hover': { backgroundColor: '#E5E7EB' }
                                }}
                              >
                                <S.GanttActivityBadge sx={{ cursor: 'pointer' }}>
                                  <TimelineIcon sx={{ fontSize: 12 }} />
                                  <span>{activityCount}</span>
                                  {isExpanded ?
                                    <ExpandLessIcon sx={{ fontSize: 12, ml: 0.25 }} /> :
                                    <ExpandMoreIcon sx={{ fontSize: 12, ml: 0.25 }} />
                                  }
                                </S.GanttActivityBadge>
                              </IconButton>
                            </Tooltip>
                          )}
                        </S.GanttTaskMeta>
                      </S.GanttTaskDetails>
                    </S.GanttTaskInfo>
                  </S.GanttTaskColumn>

                  {/* Timeline Bar */}
                  <S.GanttTimelineColumn>
                    <S.GanttTimelineGrid>
                      {dateMarkers.map((_, i) => (
                        <S.GanttGridLine key={i} style={{ left: `${(i / (dateMarkers.length - 1 || 1)) * 100}%` }} />
                      ))}
                    </S.GanttTimelineGrid>
                    {step.startedAt && (
                      <Tooltip
                        title={
                          <Box sx={{ p: 0.5 }}>
                            <Box sx={{ fontWeight: 600, mb: 0.5 }}>{step.name}</Box>
                            <Box sx={{ fontSize: '12px' }}>
                              <Box>Start: {formatDate(step.startedAt)}</Box>
                              {step.completedAt && <Box>End: {formatDate(step.completedAt)}</Box>}
                              <Box>Duration: {formatDuration(step.startedAt, step.completedAt)}</Box>
                            </Box>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <S.GanttBar
                          style={{
                            ...barStyle,
                            backgroundColor: statusColor.bg,
                          }}
                          isCompleted={step.status === 'COMPLETED'}
                        >
                          <S.GanttBarContent>
                            {step.assignedWorkerIds && step.assignedWorkerIds.size > 0 && (
                              <S.GanttBarWorkers>
                                <PersonIcon sx={{ fontSize: 12 }} />
                                <span>{step.assignedWorkerIds.size}</span>
                              </S.GanttBarWorkers>
                            )}
                            <S.GanttBarDuration>{formatDuration(step.startedAt, step.completedAt)}</S.GanttBarDuration>
                          </S.GanttBarContent>
                        </S.GanttBar>
                      </Tooltip>
                    )}
                  </S.GanttTimelineColumn>
                </S.GanttRow>

                {/* Activity Timeline (Expandable) */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <S.ActivityTimelineContainer>
                    <S.ActivityTimelineHeader>
                      <TimelineIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                      <span>Activity History ({activityCount} events)</span>
                    </S.ActivityTimelineHeader>
                    <S.ActivityTimelineList>
                      {step.timeline?.map((activity, actIndex) => {
                        const config = getActivityConfig(activity.type);
                        return (
                          <S.ActivityTimelineItem key={activity.id || actIndex}>
                            <S.ActivityTimelineConnector isFirst={actIndex === 0} isLast={actIndex === (step.timeline?.length || 0) - 1}>
                              <S.ActivityTimelineDot style={{ backgroundColor: config.color }}>
                                {config.icon}
                              </S.ActivityTimelineDot>
                            </S.ActivityTimelineConnector>
                            <S.ActivityTimelineContent>
                              <S.ActivityTimelineRow>
                                <S.ActivityTypeBadge style={{ backgroundColor: config.lightColor, color: config.color }}>
                                  {config.label}
                                </S.ActivityTypeBadge>
                                <S.ActivityTimelineTime>
                                  {formatDate(activity.createdAt)}
                                </S.ActivityTimelineTime>
                              </S.ActivityTimelineRow>
                              <S.ActivityTimelineMessage>
                                {activity.message}
                              </S.ActivityTimelineMessage>
                              {activity.actorId && (
                                <S.ActivityTimelineActor>
                                  <PersonIcon sx={{ fontSize: 12 }} />
                                  <span>User #{activity.actorId}</span>
                                </S.ActivityTimelineActor>
                              )}
                            </S.ActivityTimelineContent>
                          </S.ActivityTimelineItem>
                        );
                      })}
                    </S.ActivityTimelineList>
                  </S.ActivityTimelineContainer>
                </Collapse>
              </React.Fragment>
            );
          })}
        </S.GanttBody>
      </S.GanttContainer>

      {/* Activity Type Legend */}
      <S.GanttLegend>
        <S.GanttLegendTitle>Activity Types</S.GanttLegendTitle>
        <S.GanttLegendItems>
          {Object.entries(ACTIVITY_CONFIG).slice(0, 8).map(([type, config]) => (
            <S.GanttLegendItem key={type}>
              <S.GanttLegendColor style={{ backgroundColor: config.color }} />
              <span>{config.label}</span>
            </S.GanttLegendItem>
          ))}
        </S.GanttLegendItems>
      </S.GanttLegend>

      {/* Status Legend */}
      <S.GanttLegend>
        <S.GanttLegendTitle>Status Legend</S.GanttLegendTitle>
        <S.GanttLegendItems>
          {Object.entries(STATUS_COLORS).map(([status, colors]) => (
            <S.GanttLegendItem key={status}>
              <S.GanttLegendColor style={{ backgroundColor: colors.bg }} />
              <span>{status.replace('_', ' ')}</span>
            </S.GanttLegendItem>
          ))}
        </S.GanttLegendItems>
      </S.GanttLegend>
    </Box>
  );
};
