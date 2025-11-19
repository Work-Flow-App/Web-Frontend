import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tab } from './Tab';
import { Box } from '@mui/material';

// Example icons
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
      fill="currentColor"
    />
  </svg>
);

const JobsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
      fill="currentColor"
    />
  </svg>
);

const WorkersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="currentColor"
    />
  </svg>
);

const meta = {
  title: 'UI/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A single tab component that can be used within a TabMenu. Supports active/inactive states, icons, and different sizes following the Floow design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Tab label text',
    },
    active: {
      control: 'boolean',
      description: 'Whether the tab is active',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tab is disabled',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the tab',
    },
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic tab states
export const Default: Story = {
  args: {
    label: 'Dashboard',
    active: false,
    size: 'medium',
  },
};

export const Active: Story = {
  args: {
    label: 'Jobs',
    active: true,
    size: 'medium',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    active: false,
    disabled: true,
    size: 'medium',
  },
};

// Tab with icon
export const WithIcon: Story = {
  args: {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    active: false,
    size: 'medium',
  },
};

export const WithIconActive: Story = {
  args: {
    label: 'Jobs',
    icon: <JobsIcon />,
    active: true,
    size: 'medium',
  },
};

// Size variants
export const Small: Story = {
  args: {
    label: 'Small Tab',
    icon: <DashboardIcon />,
    active: false,
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Tab',
    icon: <JobsIcon />,
    active: false,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Tab',
    icon: <WorkersIcon />,
    active: false,
    size: 'large',
  },
};

// All sizes showcase
export const AllSizes: Story = {
  args: {
    label: 'Tab',
  },
  render: () => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tab label="Small" icon={<DashboardIcon />} active={false} size="small" />
      <Tab label="Medium" icon={<JobsIcon />} active={true} size="medium" />
      <Tab label="Large" icon={<WorkersIcon />} active={false} size="large" />
    </Box>
  ),
};

// State comparison
export const StateComparison: Story = {
  args: {
    label: 'Tab',
  },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tab label="Inactive" icon={<DashboardIcon />} active={false} size="medium" />
        <Tab label="Active" icon={<JobsIcon />} active={true} size="medium" />
        <Tab label="Disabled" icon={<WorkersIcon />} active={false} disabled={true} size="medium" />
      </Box>
    </Box>
  ),
};

// Interactive example
export const Interactive: Story = {
  args: {
    label: 'Click me',
  },
  render: () => {
    const [active, setActive] = React.useState(false);
    return (
      <Tab
        label="Click me"
        icon={<DashboardIcon />}
        active={active}
        size="medium"
        onClick={() => setActive(!active)}
      />
    );
  },
};
