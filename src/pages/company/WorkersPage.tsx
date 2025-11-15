import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Avatar, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Table } from '../../components/UI/Table';
import type { Column, RowAction, RowData } from '../../components/UI/Table';
import { floowColors } from '../../theme/colors';
import { rem } from '../../components/UI/Typography/utility';

/**
 * Worker data type
 */
interface Worker extends RowData {
  id: number;
  name: string;
  initials: string;
  telephone: string;
  mobile: string;
  email: string;
  username: string;
  loginLocked: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Page header section
 */
const PageHeader = styled(Box)({
  marginBottom: rem(32),
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

import { Typography } from '@mui/material';

/**
 * Sample worker data
 */
const sampleWorkers: Worker[] = [
  {
    id: 1,
    name: 'John Doe',
    initials: 'JD',
    telephone: '+1-555-1234',
    mobile: '+1-555-5678',
    email: 'john.doe@example.com',
    username: 'johndoe',
    loginLocked: false,
    archived: false,
    createdAt: '2025-01-15T10:30:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    initials: 'JS',
    telephone: '+1-555-2345',
    mobile: '+1-555-6789',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    loginLocked: false,
    archived: false,
    createdAt: '2025-02-20T14:15:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    initials: 'MJ',
    telephone: '+1-555-3456',
    mobile: '+1-555-7890',
    email: 'michael.johnson@example.com',
    username: 'mjohnson',
    loginLocked: true,
    archived: false,
    createdAt: '2025-03-10T09:45:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
  {
    id: 4,
    name: 'Emily Brown',
    initials: 'EB',
    telephone: '+1-555-4567',
    mobile: '+1-555-8901',
    email: 'emily.brown@example.com',
    username: 'ebrown',
    loginLocked: false,
    archived: true,
    createdAt: '2025-04-05T11:20:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
  {
    id: 5,
    name: 'Robert Wilson',
    initials: 'RW',
    telephone: '+1-555-5678',
    mobile: '+1-555-9012',
    email: 'robert.wilson@example.com',
    username: 'rwilson',
    loginLocked: false,
    archived: false,
    createdAt: '2025-05-12T13:50:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
  {
    id: 6,
    name: 'Sarah Davis',
    initials: 'SD',
    telephone: '+1-555-6789',
    mobile: '+1-555-0123',
    email: 'sarah.davis@example.com',
    username: 'sdavis',
    loginLocked: false,
    archived: false,
    createdAt: '2025-06-18T15:25:00.000Z',
    updatedAt: '2025-11-14T23:28:03.674Z',
  },
];

/**
 * Workers Page
 *
 * Displays a table of workers with management capabilities.
 * Features:
 * - Sortable columns
 * - Row selection with checkboxes
 * - Pagination
 * - Row actions (Edit, Delete, Lock/Unlock)
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
  const [workers] = useState<Worker[]>(sampleWorkers);

  /**
   * Handle edit worker
   */
  const handleEditWorker = (worker: Worker) => {
    console.log('Edit worker:', worker);
    // TODO: Implement edit functionality
  };

  /**
   * Handle delete worker
   */
  const handleDeleteWorker = (worker: Worker) => {
    console.log('Delete worker:', worker);
    // TODO: Implement delete functionality
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
            {row.initials}
          </Avatar>
          <Box sx={{ fontWeight: 500, color: floowColors.black, fontSize: rem(13), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value as string}</Box>
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
          icon={value ? <LockIcon /> : <LockOpenIcon />}
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

  return (
    <Box sx={{ padding: rem(32) }}>
      <PageHeader>
        <PageTitle>Workers</PageTitle>
        <PageSubtitle>Manage and view all workers in your organization</PageSubtitle>
      </PageHeader>

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
        emptyMessage="No workers found"
      />
    </Box>
  );
};

export default WorkersPage;
