import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../contexts/SnackbarContext';
import {
  HeaderBanner,
  MetricsRow,
  LiveJobLocationsWidget,
  RecentActivityWidget,
  RecentWorkflowActivity,
  CompanyAnnouncementsWidget,
  JobStatusOverviewWidget,
  JobsDueSoonWidget,
  QuickActionsWidget,
  DashboardCustomizerDrawer,
} from './components/Dashboard';
import { JobEventsSection } from './components/JobEventsSection';
import type { WidgetId, TaskData, ActivityLog, QuickActionId } from './components/Dashboard/types';
import * as S from './CompanyPage.styles';
import { queries } from '../../services/queries';
import {
  useDashboardPreferences,
  useMigrateLegacyPreferences,
  useRecentWorkflowActivity,
} from './dashboardQueries';
import { DEFAULT_QUICK_ACTIONS, DEFAULT_WIDGETS } from './dashboardPreferences';
import type { CompanyPostResponse } from '../../services/api';

const RECENT_POSTS_LIMIT = 5;
const RECENT_JOBS_LIMIT = 10;

export const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();

  const [customizerOpen, setCustomizerOpen] = useState(false);

  const {
    widgets: widgetConfigs,
    quickActions: quickActionConfigs,
    isReady: preferencesReady,
    update: updatePreferences,
  } = useDashboardPreferences();
  useMigrateLegacyPreferences();

  // Nothing shows until preferences load, so a widget the user has hidden never flashes or requests data
  const isVisible = (id: WidgetId) =>
    preferencesReady && (widgetConfigs.find((w) => w.id === id)?.visible ?? false);

  // API data — cached and de-duplicated by TanStack Query (see services/queries.ts).
  // Queries for hidden widgets are disabled so they send no requests.
  const profileQuery = useQuery(queries.companyProfile());
  const jobStatsQuery = useQuery(queries.jobStats());
  const financialQuery = useQuery(queries.financialSummary());
  const recentJobsQuery = useQuery({ ...queries.recentlyUpdatedJobs(RECENT_JOBS_LIMIT), enabled: isVisible('activity') });
  const inProgressJobsQuery = useQuery({ ...queries.newestInProgressJobs(RECENT_JOBS_LIMIT), enabled: isVisible('due_jobs') });
  const announcementsQuery = useQuery({ ...queries.companyPosts(RECENT_POSTS_LIMIT), enabled: isVisible('announcements') });
  const workflowActivityQuery = useRecentWorkflowActivity(isVisible('workflow_activity'));

  const profile = profileQuery.data ?? null;
  const recentJobs = recentJobsQuery.data ?? [];
  const inProgressJobs = inProgressJobsQuery.data ?? [];
  const jobStats = jobStatsQuery.data;
  const announcements = announcementsQuery.data ?? [];
  const workflowActivities = workflowActivityQuery.data ?? [];
  const financialSummary = financialQuery.data ?? null;

  const loadingProfile = profileQuery.isLoading;
  const loadingRecentJobs = recentJobsQuery.isLoading;
  const loadingInProgressJobs = inProgressJobsQuery.isLoading;
  const loadingJobStats = jobStatsQuery.isLoading;
  const loadingAnnouncements = announcementsQuery.isLoading;
  const loadingWorkflows = workflowActivityQuery.isLoading;
  const loadingFinancial = financialQuery.isLoading;

  // Widget Preferences Toggles
  const handleToggleWidget = (id: WidgetId) => {
    updatePreferences({
      widgets: widgetConfigs.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      ),
    });
  };

  const handleToggleQuickAction = (id: QuickActionId) => {
    updatePreferences({
      quickActions: quickActionConfigs.map((action) =>
        action.id === id ? { ...action, visible: !action.visible } : action
      ),
    });
  };

  const handleResetWidgets = () => {
    updatePreferences({ widgets: DEFAULT_WIDGETS, quickActions: DEFAULT_QUICK_ACTIONS });
    showSuccess('Dashboard reset to default layout');
  };

  // Helper utility to calculate dynamic timeline elapsed strings
  const getTimeAgo = (dateStr?: string): string => {
    if (!dateStr) return 'some time ago';
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // Recharts pie metrics mapping
  const getJobStatusOverviewData = () => {
    const completed = jobStats?.completed ?? 0;
    const inProgress = jobStats?.inProgress ?? 0;
    const pending = jobStats?.newJobs ?? 0;
    const cancelled = jobStats?.cancelled ?? 0;
    const total = completed + inProgress + pending + cancelled || 1;

    return [
      { name: 'Completed', value: completed, color: '#10B981', percentage: Math.round((completed / total) * 100) },
      { name: 'In Progress', value: inProgress, color: '#F97316', percentage: Math.round((inProgress / total) * 100) },
      { name: 'Pending', value: pending, color: '#F59E0B', percentage: Math.round((pending / total) * 100) },
      { name: 'On Hold', value: cancelled, color: '#EF4444', percentage: Math.round((cancelled / total) * 100) },
    ];
  };

  // Timeline events logs mapping
  const getRecentActivityData = (): ActivityLog[] => {
    return recentJobs.map((job) => {
      const timeAgo = getTimeAgo(job.updatedAt || job.createdAt);
      let action = 'was updated';
      let type: 'status_change' | 'comment' | 'creation' | 'update' = 'update';

      if (job.status === 'NEW') {
        action = 'was created';
        type = 'creation';
      } else if (job.status === 'COMPLETED') {
        action = 'was completed';
        type = 'creation';
      } else if (job.status === 'IN_PROGRESS') {
        action = 'moved to In Progress';
        type = 'status_change';
      }

      return {
        id: job.id || 0,
        jobId: job.id,
        jobRef: `Job #${job.jobRef || job.id}`,
        action,
        user: job.clientName || 'Staff',
        timeAgo,
        type,
      };
    });
  };

  // Pass the most recent posts directly so the widget can render
  // rich-text content, attachments, and photos exactly like PostCard does.
  const recentPosts: CompanyPostResponse[] = announcements.slice(0, RECENT_POSTS_LIMIT);

  // Calendar metrics mapping
  const getDueSoonTasksData = (): TaskData[] => {
    return inProgressJobs.map((job) => ({
      id: job.id || 0,
      jobId: job.id,
      name: `Job #${job.jobRef || job.id} - ${job.templateName || 'Job'}`,
      priority: 'Medium',
      status: 'In Progress',
      dueDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending',
    }));
  };

  // Trigger Action Redirect Navigation
  const handleNewJobClick = () => {
    navigate('/company/jobs?openAddModal=true');
  };

  const handleAddWorkerClick = () => {
    navigate('/company/workers?openAddModal=true');
  };

  const handleAddClientClick = () => {
    navigate('/company/clients?openAddModal=true');
  };

  const handleAddAssetClick = () => {
    navigate('/company/assets?openAddModal=true');
  };

  const handleAddCustomerClick = () => {
    navigate('/company/customers?openAddModal=true');
  };

  const handleCreateFormTemplateClick = () => {
    navigate('/company/forms?openAddModal=true');
  };

  const handleCreateSubmissionClick = () => {
    navigate('/company/forms?tab=submissions&openAddSubmission=true');
  };

  const handleNewWorkflowClick = () => {
    navigate('/company/workflows?openAddModal=true');
  };

  const handleCreateJobTemplateClick = () => {
    navigate('/company/jobs/templates?openAddModal=true');
  };

  const handleViewFullMap = () => {
    navigate('/company/maps');
  };

  const handleViewAllTasks = () => {
    navigate('/company/jobs');
  };

  const handleViewActivity = () => {
    navigate('/company/jobs');
  };

  const handleViewJobs = () => {
    navigate('/company/jobs');
  };

  const handleViewAnnouncements = () => {
    navigate('/company/profile?tab=posts');
  };

  const handleJobClickActivityLog = (jobId: number) => {
    navigate(`/company/jobs/${jobId}/details?tab=activity-log`);
  };

  const handleJobClickOverview = (jobId: number) => {
    navigate(`/company/jobs/${jobId}/details?tab=overview`);
  };

  const handleMetricCardClick = (metricId: string) => {
    if (metricId === 'total_jobs') navigate('/company/jobs');
    else if (metricId === 'in_progress') navigate('/company/jobs?status=IN_PROGRESS');
    else if (metricId === 'completed') navigate('/company/jobs?tab=completed');
    else if (metricId === 'new_jobs') navigate('/company/jobs?status=NEW');
    else if (metricId === 'archived') navigate('/company/jobs?tab=archived');
    else if (metricId === 'waiting_approval' || metricId === 'approved' || metricId === 'invoiced') {
      navigate('/company/jobs');
    }
  };


  return (
    <S.PageContainer>
      {/* 1. Header Banner */}
      <HeaderBanner
        companyName={profile?.name}
        tagline={profile?.tagline || profile?.description}
        logoUrl={profile?.logoUrl}
        loading={loadingProfile}
        onCustomizeClick={() => setCustomizerOpen(true)}
        onNewJobClick={handleNewJobClick}
        onProfileClick={() => navigate('/company/profile')}
      />

      {/* 2. Top Row Metrics Cards */}
      <MetricsRow
        newJobsCount={jobStats?.newJobs}
        inProgressCount={jobStats?.inProgress}
        completedCount={jobStats?.completed}
        archivedCount={jobStats?.archived}
        totalJobsCount={jobStats?.total}
        loading={loadingJobStats}
        onCardClick={handleMetricCardClick}
        waitingApprovalValue={financialSummary?.waitingApprovalValue}
        approvedValue={financialSummary?.approvedValue}
        invoicedValue={financialSummary?.invoicedValue}
        loadingFinancial={loadingFinancial}
      />

      {/* 3. Customizable Widget Grid Matrix */}
      <S.DashboardGrid>
        {isVisible('workflow_events') && (
          <S.GridItem lgSpan={12} mdSpan={12} smSpan={12}>
            <JobEventsSection />
          </S.GridItem>
        )}

        {isVisible('map') && (
          <S.GridItem lgSpan={5} mdSpan={6} smSpan={12}>
            <LiveJobLocationsWidget onViewFullMap={handleViewFullMap} />
          </S.GridItem>
        )}

        {isVisible('workflow_activity') && (
          <S.GridItem lgSpan={4} mdSpan={6} smSpan={12}>
            <RecentWorkflowActivity
              activities={workflowActivities}
              loading={loadingWorkflows}
              onViewAll={handleViewActivity}
              onJobClick={handleJobClickActivityLog}
            />
          </S.GridItem>
        )}

        {isVisible('activity') && (
          <S.GridItem lgSpan={3} mdSpan={6} smSpan={12}>
            <RecentActivityWidget
              activities={getRecentActivityData()}
              loading={loadingRecentJobs}
              onViewAll={handleViewActivity}
              onJobClick={handleJobClickOverview}
            />
          </S.GridItem>
        )}

        {isVisible('announcements') && (
          <S.GridItem lgSpan={5} mdSpan={6} smSpan={12}>
            <CompanyAnnouncementsWidget
              posts={recentPosts}
              loading={loadingAnnouncements}
              onViewAllAnnouncements={handleViewAnnouncements}
            />
          </S.GridItem>
        )}

        {isVisible('donut') && (
          <S.GridItem lgSpan={4} mdSpan={6} smSpan={12}>
            <JobStatusOverviewWidget
              data={getJobStatusOverviewData()}
              loading={loadingJobStats}
            />
          </S.GridItem>
        )}

        {isVisible('due_jobs') && (
          <S.GridItem lgSpan={3} mdSpan={6} smSpan={12}>
            <JobsDueSoonWidget
              jobs={getDueSoonTasksData()}
              loading={loadingInProgressJobs}
              onViewJobs={handleViewJobs}
              onJobClick={handleJobClickOverview}
            />
          </S.GridItem>
        )}
      </S.DashboardGrid>

      {/* 4. Bottom Quick Actions Row */}
      {preferencesReady && (
        <QuickActionsWidget
          configs={quickActionConfigs}
          onCreateJob={handleNewJobClick}
          onAddWorker={handleAddWorkerClick}
          onAddClient={handleAddClientClick}
          onAddAsset={handleAddAssetClick}
          onAddCustomer={handleAddCustomerClick}
          onCreateFormTemplate={handleCreateFormTemplateClick}
          onCreateSubmission={handleCreateSubmissionClick}
          onNewWorkflow={handleNewWorkflowClick}
          onCreateJobTemplate={handleCreateJobTemplateClick}
        />
      )}

      {/* 5. Customizer Drawer Overlay */}
      <DashboardCustomizerDrawer
        open={customizerOpen && preferencesReady}
        onClose={() => setCustomizerOpen(false)}
        configs={widgetConfigs}
        onToggle={handleToggleWidget}
        quickActionConfigs={quickActionConfigs}
        onToggleQuickAction={handleToggleQuickAction}
        onReset={handleResetWidgets}
      />
    </S.PageContainer>
  );
};
