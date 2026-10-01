import React, { useState, useEffect } from 'react';
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
import type {
  WidgetConfig,
  WidgetId,
  TaskData,
  Announcement,
  ActivityLog,
  QuickActionConfig,
  QuickActionId,
} from './components/Dashboard/types';
import * as S from './CompanyPage.styles';
import { queries } from '../../services/queries';
import { useJobLocationMarkers, useRecentWorkflowActivity } from './dashboardQueries';

const LOCAL_STORAGE_KEY = 'workfloow_dashboard_widgets_config';

const DEFAULT_CONFIG: WidgetConfig[] = [
  { id: 'workflow_events', label: 'Workfloow Event', visible: true, order: 0 },
  { id: 'map', label: 'Live Job Locations', visible: true, order: 1 },
  { id: 'workflow_activity', label: 'Recent Workflow Activity', visible: true, order: 2 },
  { id: 'activity', label: 'Recent Activity', visible: true, order: 3 },
  { id: 'announcements', label: 'Company Announcements', visible: true, order: 4 },
  { id: 'donut', label: 'Job Status Overview', visible: true, order: 5 },
  { id: 'due_jobs', label: 'Jobs Due Soon', visible: true, order: 6 },
];

const QUICK_ACTIONS_LOCAL_STORAGE_KEY = 'workfloow_dashboard_quick_actions_config';

const DEFAULT_QUICK_ACTIONS: QuickActionConfig[] = [
  { id: 'new_job', label: 'New Job', visible: true },
  { id: 'add_worker', label: 'Add Worker', visible: true },
  { id: 'add_client', label: 'Add Client', visible: true },
  { id: 'add_asset', label: 'Add Asset', visible: true },
  { id: 'add_customer', label: 'Add Customer', visible: true },
  { id: 'create_form', label: 'Create Form', visible: true },
  { id: 'create_submission', label: 'Create Submission', visible: true },
  { id: 'new_workflow', label: 'New Workflow', visible: true },
  { id: 'create_template', label: 'Create Job Template', visible: true },
];

export const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();

  const [customizerOpen, setCustomizerOpen] = useState(false);

  const [widgetConfigs, setWidgetConfigs] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let migrated = false;
        const config = parsed.map((item: any) => {
          if (item.id === 'workflow_events' && item.label !== 'Workfloow Event') {
            migrated = true;
            return {
              ...item,
              label: 'Workfloow Event',
            };
          }
          if (item.id === 'tasks') {
            migrated = true;
            return {
              id: 'workflow_activity' as WidgetId,
              label: 'Recent Workflow Activity',
              visible: item.visible ?? true,
              order: item.order ?? 1,
            };
          }
          if (item.id === 'due') {
            migrated = true;
            return {
              id: 'due_jobs' as WidgetId,
              label: 'Jobs Due Soon',
              visible: item.visible ?? true,
              order: item.order ?? 5,
            };
          }
          return item;
        });

        const hasWorkflowActivity = config.some((item: any) => item.id === 'workflow_activity');
        if (!hasWorkflowActivity) {
          config.push({ id: 'workflow_activity', label: 'Recent Workflow Activity', visible: true, order: 1 });
          migrated = true;
        }

        const hasWorkflowEvents = config.some((item: any) => item.id === 'workflow_events');
        if (!hasWorkflowEvents) {
          config.unshift({ id: 'workflow_events', label: 'Workfloow Event', visible: true, order: 0 });
          migrated = true;
        }

        const hasDueJobs = config.some((item: any) => item.id === 'due_jobs');
        if (!hasDueJobs) {
          config.push({ id: 'due_jobs', label: 'Jobs Due Soon', visible: true, order: 5 });
          migrated = true;
        }

        const cleanedConfig = config.filter((item: any) => item.id !== 'tasks' && item.id !== 'due');
        if (cleanedConfig.length !== config.length) {
          migrated = true;
        }

        if (migrated) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanedConfig));
        }
        return cleanedConfig;
      } catch {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  const [quickActionConfigs, setQuickActionConfigs] = useState<QuickActionConfig[]>(() => {
    const saved = localStorage.getItem(QUICK_ACTIONS_LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = DEFAULT_QUICK_ACTIONS.map((def) => {
          const match = parsed.find((item: any) => item.id === def.id);
          return match ? { ...def, visible: match.visible ?? true } : def;
        });
        return merged;
      } catch {
        return DEFAULT_QUICK_ACTIONS;
      }
    }
    return DEFAULT_QUICK_ACTIONS;
  });

  const isVisible = (id: WidgetId) => {
    const widget = widgetConfigs.find((w) => w.id === id);
    return widget ? widget.visible : false;
  };

  // API data — cached and de-duplicated by TanStack Query (see services/queries.ts).
  // Queries for hidden widgets are disabled so they send no requests.
  const profileQuery = useQuery(queries.companyProfile());
  const jobsQuery = useQuery(queries.jobs());
  const archivedJobsQuery = useQuery(queries.archivedJobs());
  const financialQuery = useQuery(queries.financialSummary());
  const announcementsQuery = useQuery({ ...queries.companyPosts(), enabled: isVisible('announcements') });
  const workflowActivityQuery = useRecentWorkflowActivity(isVisible('workflow_activity'));
  const mapMarkersQuery = useJobLocationMarkers(isVisible('map'));

  const profile = profileQuery.data ?? null;
  const jobs = jobsQuery.data ?? [];
  const archivedJobs = archivedJobsQuery.data ?? [];
  const announcements = announcementsQuery.data ?? [];
  const workflowActivities = workflowActivityQuery.data ?? [];
  const mapMarkers = mapMarkersQuery.data ?? [];
  const financialSummary = financialQuery.data ?? null;

  const loadingProfile = profileQuery.isLoading;
  const loadingJobs = jobsQuery.isLoading;
  const loadingMetrics = jobsQuery.isLoading || archivedJobsQuery.isLoading;
  const loadingAnnouncements = announcementsQuery.isLoading;
  const loadingWorkflows = workflowActivityQuery.isLoading;
  const loadingMap = mapMarkersQuery.isLoading;
  const loadingFinancial = financialQuery.isLoading;

  // Sync widget layouts to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(widgetConfigs));
  }, [widgetConfigs]);

  // Sync quick action configurations to local storage
  useEffect(() => {
    localStorage.setItem(QUICK_ACTIONS_LOCAL_STORAGE_KEY, JSON.stringify(quickActionConfigs));
  }, [quickActionConfigs]);

  // Widget Preferences Toggles
  const handleToggleWidget = (id: WidgetId) => {
    setWidgetConfigs((prev) =>
      prev.map((widget) =>
        widget.id === id ? { ...widget, visible: !widget.visible } : widget
      )
    );
  };

  const handleToggleQuickAction = (id: QuickActionId) => {
    setQuickActionConfigs((prev) =>
      prev.map((action) =>
        action.id === id ? { ...action, visible: !action.visible } : action
      )
    );
  };

  const handleResetWidgets = () => {
    setWidgetConfigs(DEFAULT_CONFIG);
    setQuickActionConfigs(DEFAULT_QUICK_ACTIONS);
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

  // Derived KPI calculations
  const totalJobsCount = jobs.length;
  const inProgressCount = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;
  const newJobsCount = jobs.filter((j) => j.status === 'NEW' || j.status === 'PENDING').length;
  const archivedCount = archivedJobs.length;

  // Recharts pie metrics mapping
  const getJobStatusOverviewData = () => {
    const completed = jobs.filter((j) => j.status === 'COMPLETED').length;
    const inProgress = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
    const pending = jobs.filter((j) => j.status === 'NEW' || j.status === 'PENDING').length;
    const cancelled = jobs.filter((j) => j.status === 'CANCELLED').length;
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
    const sortedJobs = [...jobs].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return sortedJobs.slice(0, 10).map((job) => {
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

  // Announcements formatting mapping
  const getAnnouncementsData = (): Announcement[] => {
    return announcements.slice(0, 2).map((post) => ({
      id: post.id || 0,
      title: post.groupName || (post.isPublic ? 'Public System Post' : 'Internal Announcement'),
      content: post.content || '',
      date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
      author: post.authorName || 'Admin',
    }));
  };

  // Calendar metrics mapping
  const getDueSoonTasksData = (): TaskData[] => {
    const inProgressJobs = jobs.filter((j) => j.status === 'IN_PROGRESS');
    const sorted = [...inProgressJobs].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, 10).map((job) => ({
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
        newJobsCount={newJobsCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        archivedCount={archivedCount}
        totalJobsCount={totalJobsCount}
        loading={loadingMetrics}
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
            <LiveJobLocationsWidget
              markers={mapMarkers}
              loading={loadingMap}
              onViewFullMap={handleViewFullMap}
            />
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
              loading={loadingJobs}
              onViewAll={handleViewActivity}
              onJobClick={handleJobClickOverview}
            />
          </S.GridItem>
        )}

        {isVisible('announcements') && (
          <S.GridItem lgSpan={5} mdSpan={6} smSpan={12}>
            <CompanyAnnouncementsWidget
              announcements={getAnnouncementsData()}
              loading={loadingAnnouncements}
              onViewAllAnnouncements={handleViewAnnouncements}
            />
          </S.GridItem>
        )}

        {isVisible('donut') && (
          <S.GridItem lgSpan={4} mdSpan={6} smSpan={12}>
            <JobStatusOverviewWidget
              data={getJobStatusOverviewData()}
              loading={loadingJobs}
            />
          </S.GridItem>
        )}

        {isVisible('due_jobs') && (
          <S.GridItem lgSpan={3} mdSpan={6} smSpan={12}>
            <JobsDueSoonWidget
              jobs={getDueSoonTasksData()}
              loading={loadingJobs}
              onViewJobs={handleViewJobs}
              onJobClick={handleJobClickOverview}
            />
          </S.GridItem>
        )}
      </S.DashboardGrid>

      {/* 4. Bottom Quick Actions Row */}
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

      {/* 5. Customizer Drawer Overlay */}
      <DashboardCustomizerDrawer
        open={customizerOpen}
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
