import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import type { RowData, Column } from './Table.types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible, customizable, and reusable table component with support for sorting, pagination, row selection, and custom rendering.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Sample data types
 */
interface User extends RowData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  salary: number;
}

interface Product extends RowData {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

/**
 * Sample data
 */
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Manager',
    status: 'active',
    joinDate: '2023-01-15',
    salary: 85000,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Developer',
    status: 'active',
    joinDate: '2023-03-20',
    salary: 75000,
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Designer',
    status: 'inactive',
    joinDate: '2023-02-10',
    salary: 65000,
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Developer',
    status: 'active',
    joinDate: '2023-04-05',
    salary: 75000,
  },
  {
    id: 5,
    name: 'Eve Davis',
    email: 'eve@example.com',
    role: 'Manager',
    status: 'pending',
    joinDate: '2023-05-12',
    salary: 90000,
  },
  {
    id: 6,
    name: 'Frank Wilson',
    email: 'frank@example.com',
    role: 'Developer',
    status: 'active',
    joinDate: '2023-06-01',
    salary: 72000,
  },
  {
    id: 7,
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Designer',
    status: 'active',
    joinDate: '2023-07-15',
    salary: 68000,
  },
  {
    id: 8,
    name: 'Henry Martinez',
    email: 'henry@example.com',
    role: 'Developer',
    status: 'active',
    joinDate: '2023-08-22',
    salary: 76000,
  },
];

const sampleProducts: Product[] = [
  {
    id: 101,
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299,
    stock: 45,
    rating: 4.8,
  },
  {
    id: 102,
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29,
    stock: 320,
    rating: 4.5,
  },
  {
    id: 103,
    name: 'USB-C Cable',
    category: 'Cables',
    price: 12,
    stock: 1000,
    rating: 4.2,
  },
  {
    id: 104,
    name: 'Monitor 4K',
    category: 'Electronics',
    price: 599,
    stock: 78,
    rating: 4.7,
  },
  {
    id: 105,
    name: 'Keyboard Mechanical',
    category: 'Accessories',
    price: 149,
    stock: 125,
    rating: 4.9,
  },
];

/**
 * Basic table with no features
 */
export const BasicTable: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
    ],
  },
};

/**
 * Table with sorting enabled
 */
export const WithSorting: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
      { label: 'Salary', accessor: 'salary' },
    ],
    sortable: true,
  },
  render: (args) => {
    const [sortInfo, setSortInfo] = React.useState<string>('');

    return (
      <Box>
        <Table
          {...args}
          onSortChange={(config) => {
            setSortInfo(`Sorted by ${config.column} (${config.direction})`);
          }}
        />
        {sortInfo && (
          <Box sx={{ mt: rem(16), p: rem(12), backgroundColor: floowColors.grey[50] }}>
            <strong>Sort Info:</strong> {sortInfo}
          </Box>
        )}
      </Box>
    );
  },
};

/**
 * Table with custom cell renderers
 */
export const WithCustomRenderers: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      {
        label: 'Role',
        accessor: 'role',
        render: (value) => (
          <Box
            sx={{
              display: 'inline-block',
              px: rem(8),
              py: rem(4),
              backgroundColor:
                value === 'Manager'
                  ? floowColors.info.light
                  : value === 'Developer'
                    ? floowColors.success.light
                    : floowColors.warning.light,
              color:
                value === 'Manager'
                  ? floowColors.info.main
                  : value === 'Developer'
                    ? floowColors.success.main
                    : floowColors.warning.main,
              borderRadius: rem(4),
              fontSize: rem(12),
              fontWeight: 500,
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        label: 'Status',
        accessor: 'status',
        render: (value) => (
          <Box
            sx={{
              display: 'inline-block',
              px: rem(8),
              py: rem(4),
              backgroundColor:
                value === 'active'
                  ? 'rgba(0, 166, 62, 0.15)'
                  : value === 'pending'
                    ? 'rgba(255, 165, 0, 0.15)'
                    : 'rgba(241, 60, 79, 0.15)',
              color:
                value === 'active'
                  ? floowColors.success.main
                  : value === 'pending'
                    ? floowColors.warning.main
                    : floowColors.error.main,
              borderRadius: rem(4),
              fontSize: rem(12),
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        label: 'Salary',
        accessor: 'salary',
        render: (value) => `$${(value as number).toLocaleString()}`,
        align: 'right',
      },
    ],
  },
};

/**
 * Table with pagination
 */
export const WithPagination: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
      { label: 'Status', accessor: 'status' },
    ],
    pagination: { pageSize: 3 },
  },
  render: (args) => {
    const [pageInfo, setPageInfo] = React.useState<string>('Page 1');

    return (
      <Box>
        <Table
          {...args}
          onPageChange={(page) => {
            setPageInfo(`Current page: ${page}`);
          }}
        />
        <Box sx={{ mt: rem(12), p: rem(12), backgroundColor: floowColors.grey[50] }}>
          <strong>Page Info:</strong> {pageInfo}
        </Box>
      </Box>
    );
  },
};

/**
 * Table with row selection
 */
export const WithRowSelection: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
    ],
    selectable: true,
  },
  render: (args) => {
    const [selected, setSelected] = React.useState<(string | number)[]>([]);

    return (
      <Box>
        <Table
          {...args}
          onSelectionChange={(selectedIds) => {
            setSelected(selectedIds);
          }}
        />
        <Box sx={{ mt: rem(16), p: rem(12), backgroundColor: floowColors.grey[50] }}>
          <strong>Selected rows:</strong> {selected.length > 0 ? selected.join(', ') : 'None'}
        </Box>
      </Box>
    );
  },
};

/**
 * Table with row actions
 */
export const WithRowActions: Story = {
  args: {
    data: sampleProducts,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Category', accessor: 'category' },
      { label: 'Price', accessor: 'price', render: (value) => `$${value}` },
      { label: 'Stock', accessor: 'stock' },
      {
        label: 'Rating',
        accessor: 'rating',
        render: (value) => (
          <Box sx={{ color: floowColors.warning.main }}>★ {value}</Box>
        ),
      },
    ],
    actions: [
      {
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: (row) => console.log('Edit:', row),
      },
      {
        label: 'Delete',
        icon: <DeleteIcon fontSize="small" />,
        onClick: (row) => console.log('Delete:', row),
        danger: true,
      },
    ],
  },
};

/**
 * Table with sorting, pagination, and selection
 */
export const FullFeatured: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      {
        label: 'Role',
        accessor: 'role',
        render: (value) => (
          <Box
            sx={{
              display: 'inline-block',
              px: rem(8),
              py: rem(4),
              backgroundColor: floowColors.info.light,
              color: floowColors.info.main,
              borderRadius: rem(4),
              fontSize: rem(12),
              fontWeight: 500,
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        label: 'Status',
        accessor: 'status',
        render: (value) => (
          <Box
            sx={{
              display: 'inline-block',
              px: rem(8),
              py: rem(4),
              backgroundColor:
                value === 'active'
                  ? 'rgba(0, 166, 62, 0.15)'
                  : 'rgba(255, 165, 0, 0.15)',
              color:
                value === 'active'
                  ? floowColors.success.main
                  : floowColors.warning.main,
              borderRadius: rem(4),
              fontSize: rem(12),
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {value}
          </Box>
        ),
      },
    ],
    sortable: true,
    selectable: true,
    pagination: { pageSize: 5 },
  },
};

/**
 * Table with striped rows and hover effect
 */
export const Striped: Story = {
  args: {
    data: sampleProducts,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Category', accessor: 'category' },
      { label: 'Price', accessor: 'price', render: (value) => `$${value}` },
      { label: 'Stock', accessor: 'stock' },
    ],
    striped: true,
    hoverable: true,
  },
};

/**
 * Table with dense mode
 */
export const DenseMode: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
      { label: 'Salary', accessor: 'salary', render: (value) => `$${value}` },
    ],
    dense: true,
  },
};

/**
 * Table with loading state
 */
export const LoadingState: Story = {
  args: {
    data: sampleUsers,
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
    ],
    isLoading: true,
  },
};

/**
 * Empty table
 */
export const EmptyTable: Story = {
  args: {
    data: [],
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
    ],
    emptyMessage: 'No users found. Try adjusting your filters.',
  },
};

/**
 * Table with row click handler
 */
export const WithRowClick: Story = {
  args: {
    data: sampleUsers.slice(0, 5),
    columns: [
      { label: 'Name', accessor: 'name' },
      { label: 'Email', accessor: 'email' },
      { label: 'Role', accessor: 'role' },
    ],
    hoverable: true,
  },
  render: (args) => {
    const [clickedRow, setClickedRow] = React.useState<User | null>(null);

    return (
      <Box>
        <Table
          {...args}
          onRowClick={(row) => {
            setClickedRow(row as User);
          }}
        />
        {clickedRow && (
          <Box sx={{ mt: rem(16), p: rem(12), backgroundColor: floowColors.grey[50] }}>
            <strong>Clicked row:</strong> {clickedRow.name} ({clickedRow.email})
          </Box>
        )}
      </Box>
    );
  },
};
