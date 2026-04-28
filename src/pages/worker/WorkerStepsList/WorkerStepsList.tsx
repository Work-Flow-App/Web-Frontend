import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table from '../../../components/UI/Table/Table';
import type { ITableColumn } from '../../../components/UI/Table/ITable';
import { workerJobWorkflowService } from '../../../services/api';
import type { WorkerAssignedStepResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';

interface StepRow {
  id: number;
  name?: string;
  description?: string;
  status?: string;
  jobId?: number;
  jobRef?: number;
  customerName?: string;
  jobAddress?: string;
  startedAt?: string;
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

const formatAddress = (addr?: WorkerAssignedStepResponse['jobAddress']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.postalCode].filter(Boolean).join(', ');
};

export const WorkerStepsList: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [steps, setSteps] = useState<StepRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSteps = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getMyAssignedSteps();
      const data: WorkerAssignedStepResponse[] = Array.isArray(response.data) ? response.data : [];
      const rows: StepRow[] = data
        .filter((s) => s.step?.id != null)
        .map((s) => ({
          id: s.step!.id!,
          name: s.step?.name,
          description: s.step?.description,
          status: s.step?.status,
          jobId: s.jobId,
          jobRef: s.jobRef,
          customerName: s.customer?.name,
          jobAddress: formatAddress(s.jobAddress),
          startedAt: s.step?.startedAt,
        }));
      setSteps(rows);
    } catch (error) {
      console.error('Error fetching worker steps:', error);
      showError(extractErrorMessage(error, 'Failed to load steps'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  const handleRowClick = useCallback(
    (row: StepRow) => {
      navigate(`/worker/steps/${row.id}`);
    },
    [navigate],
  );

  const columns: ITableColumn<StepRow>[] = useMemo(
    () => [
      {
        id: 'name',
        label: 'Step',
        accessor: 'name',
        sortable: true,
        width: 'auto',
        render: (row) => row.name || `Step #${row.id}`,
      },
      {
        id: 'jobRef',
        label: 'Job',
        accessor: 'jobRef',
        sortable: true,
        width: 'auto',
        render: (row) => `Job #${row.jobRef ?? row.jobId ?? '-'}`,
      },
      {
        id: 'customerName',
        label: 'Customer',
        accessor: 'customerName',
        sortable: true,
        width: 'auto',
        render: (row) => row.customerName || '-',
      },
      {
        id: 'jobAddress',
        label: 'Address',
        accessor: 'jobAddress',
        sortable: false,
        width: 'auto',
        render: (row) => row.jobAddress || '-',
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
      title="My Steps"
      description="All workflow steps assigned to you"
      showSearch
      searchPlaceholder="Search steps"
    >
      <Table<StepRow>
        columns={columns}
        data={steps}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No steps assigned to you yet."
        rowsPerPage={10}
        showPagination
      />
    </PageWrapper>
  );
};
