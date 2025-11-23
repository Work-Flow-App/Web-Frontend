import type { Meta, StoryObj } from '@storybook/react';
import Table from './Table';
import type { ITableColumn, ITableRow } from './ITable';
import { StatusPill, AvatarCell, Avatar, MemberInfo, MemberName, MemberEmail, DateText, DateMain, DateSub } from './Table.styles';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive table component with context-based architecture, supporting global search, column search, sorting, selection, and pagination.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data matching the Figma design
interface MemberRow extends ITableRow {
  id: number;
  addedOn: string;
  addedTime: string;
  member: {
    name: string;
    email: string;
    initials: string;
  };
  jobAssignments: number;
  role: string;
  status: 'active' | 'deactivated' | 'pending';
}

const sampleData: MemberRow[] = [
  {
    id: 1,
    addedOn: '1/28/17',
    addedTime: '07:13 am',
    member: {
      name: 'Darlene Robertson',
      email: 'anna.lawson@example.com',
      initials: 'DR',
    },
    jobAssignments: 21,
    role: 'Manager',
    status: 'active',
  },
  {
    id: 2,
    addedOn: '6/19/14',
    addedTime: '10:56 pm',
    member: {
      name: 'Ella Martinez',
      email: 'ella.martinez@example.com',
      initials: 'EM',
    },
    jobAssignments: 25,
    role: 'Manager',
    status: 'active',
  },
  {
    id: 3,
    addedOn: '10/6/13',
    addedTime: '06:49 pm',
    member: {
      name: 'Cameron Johnson',
      email: 'cameron.johnson@example.com',
      initials: 'CJ',
    },
    jobAssignments: 24,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 4,
    addedOn: '4/21/12',
    addedTime: '03:12 am',
    member: {
      name: 'Freddy Smith',
      email: 'freddy.smith@example.com',
      initials: 'FS',
    },
    jobAssignments: 27,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 5,
    addedOn: '4/4/18',
    addedTime: '05:14 pm',
    member: {
      name: 'Beatrice Hayes',
      email: 'beatrice.hayes@example.com',
      initials: 'BH',
    },
    jobAssignments: 26,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 6,
    addedOn: '9/23/16',
    addedTime: '01:08 pm',
    member: {
      name: 'Derek Porter',
      email: 'derek.porter@example.com',
      initials: 'DP',
    },
    jobAssignments: 22,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 7,
    addedOn: '7/18/17',
    addedTime: '02:34 am',
    member: {
      name: 'Darlene Robertson',
      email: 'anna.lawson@example.com',
      initials: 'DR',
    },
    jobAssignments: 23,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 8,
    addedOn: '12/10/13',
    addedTime: '12:13 pm',
    member: {
      name: 'Grace Taylor',
      email: 'grace.taylor@example.com',
      initials: 'GT',
    },
    jobAssignments: 28,
    role: 'Worker',
    status: 'deactivated',
  },
  {
    id: 9,
    addedOn: '5/19/12',
    addedTime: '04:35 pm',
    member: {
      name: 'Alexander Grant',
      email: 'alex.grant@example.com',
      initials: 'AG',
    },
    jobAssignments: 21,
    role: 'Worker',
    status: 'deactivated',
  },
  {
    id: 10,
    addedOn: '8/15/19',
    addedTime: '09:22 am',
    member: {
      name: 'Sophia Anderson',
      email: 'sophia.anderson@example.com',
      initials: 'SA',
    },
    jobAssignments: 30,
    role: 'Manager',
    status: 'pending',
  },
  {
    id: 11,
    addedOn: '2/3/20',
    addedTime: '11:45 am',
    member: {
      name: 'Lucas Brown',
      email: 'lucas.brown@example.com',
      initials: 'LB',
    },
    jobAssignments: 19,
    role: 'Worker',
    status: 'active',
  },
  {
    id: 12,
    addedOn: '11/28/18',
    addedTime: '03:18 pm',
    member: {
      name: 'Isabella White',
      email: 'isabella.white@example.com',
      initials: 'IW',
    },
    jobAssignments: 29,
    role: 'Manager',
    status: 'active',
  },
];

const columns: ITableColumn<MemberRow>[] = [
  {
    id: 'addedOn',
    label: 'Added on',
    sortable: true,
    width: '200px',
    render: (row) => (
      <DateText>
        <DateMain>{row.addedOn}</DateMain>
        <DateSub>{row.addedTime}</DateSub>
      </DateText>
    ),
  },
  {
    id: 'member',
    label: 'Member',
    sortable: true,
    width: '300px',
    render: (row) => (
      <AvatarCell>
        <Avatar>{row.member.initials}</Avatar>
        <MemberInfo>
          <MemberName>{row.member.name}</MemberName>
          <MemberEmail>{row.member.email}</MemberEmail>
        </MemberInfo>
      </AvatarCell>
    ),
  },
  {
    id: 'jobAssignments',
    label: 'Job Assignments',
    accessor: 'jobAssignments',
    sortable: true,
    width: '300px',
  },
  {
    id: 'role',
    label: 'Role',
    accessor: 'role',
    sortable: true,
    width: '300px',
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    width: '264px',
    render: (row) => <StatusPill status={row.status}>{row.status}</StatusPill>,
  },
];

const manyColumns: ITableColumn<MemberRow>[] = [
  ...columns,
  {
    id: 'department',
    label: 'Department',
    sortable: true,
    width: '200px',
    render: () => 'Engineering',
  },
  {
    id: 'location',
    label: 'Location',
    sortable: true,
    width: '200px',
    render: () => 'New York',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    sortable: true,
    width: '200px',
    render: () => '2023-01-15',
  },
  {
    id: 'salary',
    label: 'Salary',
    sortable: true,
    width: '200px',
    render: () => '$85,000',
  },
  {
    id: 'manager',
    label: 'Manager',
    sortable: true,
    width: '200px',
    render: () => 'John Smith',
  },
];

// Full-featured table with all new capabilities
export const FullFeatured: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData,
    selectable: true,
    showActions: true,
    showColumnSearch: true,
    showPagination: true,
    rowsPerPage: 5,
    maxPageButtons: 5,
    showPrevNext: true,
    onActionClick: (row) => console.log('Action clicked:', row),
  },
};

// Basic table without extra features
export const Basic: Story = {
  args: {
    columns: columns,
    data: sampleData.slice(0, 5),
    showPagination: false,
  },
};

// Table with column-level search
export const WithColumnSearch: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData,
    showColumnSearch: true,
    rowsPerPage: 5,
  },
};

// Table with selection
export const WithSelection: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData.slice(0, 5),
    selectable: true,
    showPagination: false,
  },
};

// Table with actions
export const WithActions: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData.slice(0, 5),
    showActions: true,
    showPagination: false,
    onActionClick: (row) => console.log('Action clicked:', row),
  },
};

// Table with pagination
export const WithPagination: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData,
    showPagination: true,
    rowsPerPage: 5,
    maxPageButtons: 5,
    showPrevNext: true,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData.slice(0, 5),
    loading: true,
    showPagination: false,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: [],
    emptyMessage: 'No team members found',
    showPagination: false,
  },
};

// Table with sticky columns (for large datasets)
export const WithStickyColumns: Story = {
  args: {
    title: 'Team Members',
    columns: columns,
    data: sampleData,
    selectable: true,
    showActions: true,
    enableStickyLeft: true,
    enableStickyRight: true,
    showPagination: true,
    rowsPerPage: 5,
  },
};

// Compact table
export const Compact: Story = {
  args: {
    columns: columns.slice(0, 3),
    data: sampleData.slice(0, 3),
    showPagination: false,
  },
};

// Table with many columns to test sticky first column
export const ManyColumnsWithStickyFirst: Story = {
  args: {
    title: 'Team Members - Many Columns',
    columns: manyColumns,
    data: sampleData,
    selectable: true,
    showActions: true,
    showPagination: true,
    rowsPerPage: 5,
    onActionClick: (row) => console.log('Action clicked:', row),
  },
};
