import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Table from './Table';
import Pagination from './Pagination';
import type { ITableColumn, ITableRow, ISortConfig } from './ITable';
import { StatusPill, AvatarCell, Avatar, MemberInfo, MemberName, MemberEmail, DateText, DateMain, DateSub } from './Table.styles';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive table component with sorting, selection, pagination, and custom rendering capabilities.',
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

// Interactive story with all features
export const Interactive: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [sortConfig, setSortConfig] = useState<ISortConfig>({
      columnId: '',
      direction: null,
    });
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <div style={{ width: '100%', padding: '2rem' }}>
        <Table
          columns={columns}
          data={sampleData}
          selectable
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          sortable
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          showActions
          onActionClick={(row) => console.log('Action clicked:', row)}
        />
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    );
  },
};

// Basic table without additional features
export const Basic: Story = {
  args: {
    columns: columns,
    data: sampleData.slice(0, 5),
  },
};

// Table with selection
export const WithSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([1, 3]);

    return (
      <Table
        columns={columns}
        data={sampleData.slice(0, 5)}
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    );
  },
};

// Table with sorting
export const WithSorting: Story = {
  render: () => {
    const [sortConfig, setSortConfig] = useState<ISortConfig>({
      columnId: 'member',
      direction: 'asc',
    });

    return (
      <Table
        columns={columns}
        data={sampleData.slice(0, 5)}
        sortable
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />
    );
  },
};

// Table with actions menu
export const WithActions: Story = {
  args: {
    columns: columns,
    data: sampleData.slice(0, 5),
    showActions: true,
    onActionClick: (row) => console.log('Action clicked:', row),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    columns: columns,
    data: sampleData.slice(0, 5),
    loading: true,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    columns: columns,
    data: [],
    emptyMessage: 'No team members found',
  },
};

// Pagination only
export const PaginationOnly: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <div style={{ padding: '2rem' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

// Pagination with many pages
export const PaginationManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);

    return (
      <div style={{ padding: '2rem' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={100}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

// Compact table (fewer columns)
export const Compact: Story = {
  args: {
    columns: columns.slice(0, 3),
    data: sampleData.slice(0, 3),
  },
};

// Full-featured responsive table
export const FullFeatured: Story = {
  args: {
    columns: columns,
    data: sampleData,
    selectable: true,
    sortable: true,
    showActions: true,
  },
};
