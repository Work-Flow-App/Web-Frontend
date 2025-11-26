import type { Meta, StoryObj } from '@storybook/react';
import { PageWrapper } from './PageWrapper';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof PageWrapper> = {
  title: 'UI/PageWrapper',
  component: PageWrapper,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Page title',
    },
    description: {
      control: 'text',
      description: 'Page description',
    },
    showSearch: {
      control: 'boolean',
      description: 'Show search input',
    },
    showFilter: {
      control: 'boolean',
      description: 'Show filter button',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the page container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageWrapper>;

const DemoContent = () => (
  <Box padding={3}>
    <Typography variant="body1">
      This is the page content area. You can place any components here like tables, cards, forms, etc.
    </Typography>
  </Box>
);

const AddMemberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 5V15M5 10H15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Default: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    children: <DemoContent />,
  },
};

export const WithSearch: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    showSearch: true,
    searchPlaceholder: 'Search workers...',
    onSearchChange: (value) => console.log('Search:', value),
    children: <DemoContent />,
  },
};

export const WithFilter: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    showSearch: true,
    showFilter: true,
    onFilterClick: () => console.log('Filter clicked'),
    children: <DemoContent />,
  },
};

export const WithDropdown: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    dropdownOptions: [
      { label: 'All Members', value: 'all' },
      { label: 'Active Members', value: 'active' },
      { label: 'Inactive Members', value: 'inactive' },
      { label: 'Pending Members', value: 'pending' },
    ],
    dropdownValue: 'all',
    dropdownPlaceholder: 'All Member',
    onDropdownChange: (value) => console.log('Dropdown changed:', value),
    children: <DemoContent />,
  },
};

export const WithActions: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    showSearch: true,
    showFilter: true,
    onFilterClick: () => console.log('Filter clicked'),
    actions: [
      {
        label: 'Add Member',
        icon: <AddMemberIcon />,
        onClick: () => console.log('Add member clicked'),
        variant: 'contained',
        color: 'primary',
      },
    ],
    children: <DemoContent />,
  },
};

export const WithMultipleActions: Story = {
  args: {
    title: 'Company Dashboard',
    description: 'Overview of all company data and metrics.',
    showSearch: true,
    showFilter: true,
    onFilterClick: () => console.log('Filter clicked'),
    actions: [
      {
        label: 'Export',
        onClick: () => console.log('Export clicked'),
        variant: 'outlined',
        color: 'secondary',
      },
      {
        label: 'Add Member',
        icon: <AddMemberIcon />,
        onClick: () => console.log('Add member clicked'),
        variant: 'contained',
        color: 'primary',
      },
    ],
    children: <DemoContent />,
  },
};

export const MinimalWithoutDescription: Story = {
  args: {
    title: 'Recent Activities',
    children: <DemoContent />,
  },
};

export const CustomMaxWidth: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    showSearch: true,
    showFilter: true,
    maxWidth: 1200,
    children: <DemoContent />,
  },
};

export const FullExample: Story = {
  args: {
    title: 'All Workers',
    description: 'Manage worker details, roles, and assignments in one place.',
    dropdownOptions: [
      { label: 'All Members', value: 'all' },
      { label: 'Active Members', value: 'active' },
      { label: 'Inactive Members', value: 'inactive' },
      { label: 'Pending Members', value: 'pending' },
    ],
    dropdownValue: 'all',
    dropdownPlaceholder: 'All Member',
    onDropdownChange: (value) => console.log('Dropdown changed:', value),
    showSearch: true,
    searchPlaceholder: 'Search',
    showFilter: true,
    onFilterClick: () => alert('Filter clicked!'),
    onSearchChange: (value) => console.log('Search changed:', value),
    onSearch: (value) => console.log('Search submitted:', value),
    actions: [
      {
        label: 'Add Member',
        icon: <AddMemberIcon />,
        onClick: () => alert('Add member clicked!'),
        variant: 'contained',
        color: 'primary',
      },
    ],
    children: <DemoContent />,
  },
};
