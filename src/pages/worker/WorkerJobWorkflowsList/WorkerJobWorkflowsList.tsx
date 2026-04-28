import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table from '../../../components/UI/Table/Table';
import type { ITableColumn } from '../../../components/UI/Table/ITable';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';

interface WorkflowRow {
  id: number;
  jobId?: number;
  status?: string;
  stepCount: number;
  completedSteps: number;
}

const getStatusChipProps = (status?: string) => {
  switch (status) {
    case 'COMPLETED':
      return { label: 'COMPLETED', bg: '#E8F5E9', color: '#2E7D32' };
    case 'STARTED':
    case 'ONGOING':
      return { label: status, bg: '#E3F2FD', color: '#1565C0' };
    case 'PENDING':
      return { label: 'PENDING', bg: '#FFF8E1', color: '#F9A825' };
    case 'SKIPPED':
      return { label: 'SKIPPED', bg: '#FFEBEE', color: '#C62828' };
    case 'INITIATED':
      return { label: 'INITIATED', bg: '#F3E5F5', color: '#7B1FA2' };
    default:
      return { label: status || 'NOT_STARTED', bg: '#F5F5F5', color: '#616161' };
  }
};

export const WorkerJobWorkflowsList: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [workflows, setWorkflows] = useState<WorkflowRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getMyJobWorkflows();
      const data: JobWorkflowResponse[] = Array.isArray(response.data) ? response.data : [];
      const rows: WorkflowRow[] = data.map((wf) => ({
        id: wf.id ?? 0,
        jobId: wf.jobId,
        status: wf.status,
        stepCount: wf.steps?.length ?? 0,
        completedSteps: wf.steps?.filter((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED').length ?? 0,
      }));
      setWorkflows(rows);
    } catch (error) {
      console.error('Error fetching worker workflows:', error);
      showError(extractErrorMessage(error, 'Failed to load workflows'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleRowClick = useCallback(
    (row: WorkflowRow) => {
      navigate(`/worker/job-workflows/${row.id}`);
    },
    [navigate],
  );

  const columns: ITableColumn<WorkflowRow>[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'Workflow ID',
        accessor: 'id',
        sortable: true,
        width: 'auto',
      },
      {
        id: 'jobId',
        label: 'Job',
        accessor: 'jobId',
        sortable: true,
        width: 'auto',
        render: (row) => (row.jobId ? `Job #${row.jobId}` : '-'),
      },
      {
        id: 'progress',
        label: 'Progress',
        sortable: false,
        width: 'auto',
        render: (row) => `${row.completedSteps} / ${row.stepCount} steps`,
      },
      {
        id: 'status',
        label: 'Status',
        accessor: 'status',
        sortable: true,
        width: 'auto',
        render: (row) => {
          const info = getStatusChipProps(row.status);
          return (
            <Chip
              label={info.label}
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: info.bg,
                color: info.color,
              }}
            />
          );
        },
      },
    ],
    [],
  );

  return (
    <PageWrapper
      title="My Workflows"
      description="Job workflows assigned to you"
      showSearch
      searchPlaceholder="Search workflows"
    >
      <Table<WorkflowRow>
        columns={columns}
        data={workflows}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No workflows assigned to you yet."
        rowsPerPage={10}
        showPagination
      />
    </PageWrapper>
  );
};
