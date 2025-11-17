import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Avatar, Chip, CircularProgress, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Table } from '../../components/UI/Table';
import type { Column, RowAction, RowData } from '../../components/UI/Table';
import { workerService } from '../../services/api/workers';
import type { WorkerResponse } from '../../services/api/workers';
import { floowColors } from '../../theme/colors';
import { rem } from '../../components/UI/Typography/utility';
import { Typography } from '@mui/material';
import { AddWorkerDialog } from '../../components/Dialogs/AddWorkerDialog';

/**
 * Worker data type extending generated WorkerResponse
 */
interface Worker extends WorkerResponse, RowData {
  id: number;
}

/**
 * Page header section
 */
const PageHeader = styled(Box)({
  marginBottom: rem(32),
});

/**
 * Header container with title and button
 */
const HeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: rem(32),
  gap: rem(16),
});

/**
 * Header left section (title and subtitle)
 */
const HeaderLeft = styled(Box)({
  flex: 1,
});

/**
 * Page title
 */
const PageTitle = styled(Typography)({
  fontSize: rem(32),
  fontWeight: 700,
  color: floowColors.black,
  marginBottom: rem(8),
  margin: 0,
});

/**
 * Page subtitle
 */
const PageSubtitle = styled('p')({
  fontSize: rem(14),
  color: floowColors.grey[600],
  margin: 0,
});

/**
 * Loading container
 */
const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(300),
});

/**
 * Error message container
 */
const ErrorContainer = styled(Box)({
  padding: rem(16),
  backgroundColor: 'rgba(251, 44, 54, 0.1)',
  color: floowColors.error.main,
  borderRadius: rem(8),
  marginBottom: rem(16),
});

/**
 * Workers Page
 *
 * Displays a table of workers with management capabilities.
 * Features:
 * - Fetch workers from API
 * - Sortable columns
 * - Pagination
 * - Row actions (Edit, Delete)
 * - Custom cell renderers
 *
 * This page renders within the Layout component and maintains
 * the persistent sidebar and topnav.
 *
 * @example
 * ```tsx
 * <Route path="/company/workers" element={<WorkersPage />} />
 * ```
 */
export const WorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addWorkerDialogOpen, setAddWorkerDialogOpen] = useState(false);

  /**
   * Fetch workers on component mount
   */
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await workerService.getAllWorkers();
        setWorkers((data as Worker[]) || []);
      } catch (err) {
        console.error('Error fetching workers:', err);
        setError('Failed to load workers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  /**
   * Handle add worker button click
   */
  const handleAddWorker = () => {
    setAddWorkerDialogOpen(true);
  };

  /**
   * Handle worker added from dialog
   */
  const handleWorkerAdded = (newWorker: Worker) => {
    // Add new worker to the list
    setWorkers((prevWorkers) => [newWorker, ...prevWorkers]);
  };

  /**
   * Handle edit worker
   */
  const handleEditWorker = (worker: Worker) => {
    console.log('Edit worker:', worker);
    // TODO: Implement edit modal/dialog
  };

  /**
   * Handle delete worker
   */
  const handleDeleteWorker = async (worker: Worker) => {
    if (!confirm(`Are you sure you want to delete ${worker.name}?`)) {
      return;
    }

    try {
      await workerService.deleteWorker(worker.id);
      // Remove from state
      setWorkers(workers.filter(w => w.id !== worker.id));
    } catch (err) {
      console.error('Error deleting worker:', err);
      setError('Failed to delete worker. Please try again.');
    }
  };

  /**
   * Table columns definition
   */
  const columns: Column<Worker>[] = [
    {
      label: 'ID',
      accessor: 'id',
      width: rem(50),
      align: 'center',
    },
    {
      label: 'Name',
      accessor: 'name',
      width: rem(180),
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(6) }}>
          <Avatar
            sx={{
              width: rem(28),
              height: rem(28),
              backgroundColor: floowColors.dark.slate,
              fontSize: rem(11),
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {(value as string)?.substring(0, 2).toUpperCase() || row.initials}
          </Avatar>
          <Box
            sx={{
              fontWeight: 500,
              color: floowColors.black,
              fontSize: rem(13),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {value as string}
          </Box>
        </Box>
      ),
    },
    {
      label: 'Email',
      accessor: 'email',
      width: rem(160),
    },
    {
      label: 'Mobile',
      accessor: 'mobile',
      width: rem(120),
    },
    {
      label: 'Username',
      accessor: 'username',
      width: rem(110),
    },
    {
      label: 'Locked',
      accessor: 'loginLocked',
      width: rem(85),
      align: 'center',
      render: (value) => (
        <Chip
          label={value ? 'Yes' : 'No'}
          size="small"
          sx={{
            backgroundColor: value ? 'rgba(251, 44, 54, 0.15)' : 'rgba(0, 166, 62, 0.15)',
            color: value ? floowColors.error.main : floowColors.success.main,
            fontSize: rem(11),
            height: rem(24),
          }}
        />
      ),
    },
    {
      label: 'Archived',
      accessor: 'archived',
      width: rem(85),
      align: 'center',
      render: (value) => (
        <Chip
          label={value ? 'Yes' : 'No'}
          size="small"
          sx={{
            backgroundColor: value ? floowColors.grey[200] : 'rgba(0, 166, 62, 0.15)',
            color: value ? floowColors.grey[600] : floowColors.success.main,
            fontSize: rem(11),
            height: rem(24),
          }}
        />
      ),
    },
    {
      label: 'Created',
      accessor: 'createdAt',
      width: rem(100),
      render: (_value) => {
        const date = new Date(_value as string);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit',
        });
      },
      align: 'center',
    },
  ];

  /**
   * Table row actions
   */
  const actions: RowAction<Worker>[] = [
    {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      onClick: handleEditWorker,
    },
    {
      label: 'Delete',
      icon: <DeleteIcon fontSize="small" />,
      onClick: handleDeleteWorker,
      danger: true,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ padding: rem(32) }}>
        <PageHeader>
          <PageTitle>Workers</PageTitle>
          <PageSubtitle>Manage and view all workers in your organization</PageSubtitle>
        </PageHeader>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: rem(32) }}>
      <HeaderContainer>
        <HeaderLeft>
          <PageTitle>Workers</PageTitle>
          <PageSubtitle>Manage and view all workers in your organization</PageSubtitle>
        </HeaderLeft>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddWorker}
          sx={{
            backgroundColor: floowColors.black,
            color: floowColors.white,
            textTransform: 'none',
            fontSize: rem(14),
            fontWeight: 600,
            padding: `${rem(8)} ${rem(16)}`,
            minHeight: rem(40),
            borderRadius: rem(6),
            whiteSpace: 'nowrap',
            '&:hover': {
              backgroundColor: floowColors.grey[900],
            },
          }}
        >
          Add Worker
        </Button>
      </HeaderContainer>

      {error && (
        <ErrorContainer>
          {error}
        </ErrorContainer>
      )}

      <Table
        data={workers}
        columns={columns}
        actions={actions}
        sortable
        pagination={{ pageSize: 10 }}
        striped={false}
        hoverable
        onRowClick={(row) => {
          console.log('Clicked worker:', row);
        }}
        emptyMessage={workers.length === 0 ? 'No workers found' : undefined}
      />

      <AddWorkerDialog
        open={addWorkerDialogOpen}
        onClose={() => setAddWorkerDialogOpen(false)}
        onWorkerAdded={handleWorkerAdded}
      />
    </Box>
  );
};

export default WorkersPage;
