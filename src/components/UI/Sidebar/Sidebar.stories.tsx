import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive sidebar navigation component with icon and label support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeItemId: {
      control: 'select',
      options: ['dashboard', 'workers', 'jobs', 'settings'],
      description: 'Currently active navigation item ID',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'workers', label: 'Workers' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'settings', label: 'Settings' },
];

const itemsWithIcons = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'workers', label: 'Workers', icon: <PeopleIcon /> },
  { id: 'jobs', label: 'Jobs', icon: <WorkIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    activeItemId: 'dashboard',
  },
  render: (args) => {
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          {...args}
          activeItemId={activeItemId}
          onItemClick={setActiveItemId}
        />
        <Box sx={{ flex: 1, padding: 3, backgroundColor: '#f5f5f5' }}>
          <h1>Content for {activeItemId}</h1>
          <p>Click on sidebar items to navigate.</p>
        </Box>
      </Box>
    );
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    activeItemId: 'dashboard',
  },
  render: (args) => {
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          {...args}
          activeItemId={activeItemId}
          onItemClick={setActiveItemId}
        />
        <Box sx={{ flex: 1, padding: 3, backgroundColor: '#f5f5f5' }}>
          <h1>Content for {activeItemId}</h1>
          <p>Click on sidebar items to navigate.</p>
        </Box>
      </Box>
    );
  },
};

export const WithCustomStyling: Story = {
  args: {
    items: itemsWithIcons,
    activeItemId: 'dashboard',
    sx: {
      width: '280px',
    },
  },
  render: (args) => {
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          {...args}
          activeItemId={activeItemId}
          onItemClick={setActiveItemId}
        />
        <Box sx={{ flex: 1, padding: 3, backgroundColor: '#f5f5f5' }}>
          <h1>Content for {activeItemId}</h1>
          <p>Sidebar with custom styling (280px)</p>
        </Box>
      </Box>
    );
  },
};

export const ManyItems: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'workers', label: 'Workers', icon: <PeopleIcon /> },
      { id: 'jobs', label: 'Jobs', icon: <WorkIcon /> },
      { id: 'analytics', label: 'Analytics', icon: <DashboardIcon /> },
      { id: 'reports', label: 'Reports', icon: <WorkIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ],
    activeItemId: 'dashboard',
  },
  render: (args) => {
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          {...args}
          activeItemId={activeItemId}
          onItemClick={setActiveItemId}
        />
        <Box sx={{ flex: 1, padding: 3, backgroundColor: '#f5f5f5' }}>
          <h1>Content for {activeItemId}</h1>
          <p>Scrollable sidebar with many items</p>
        </Box>
      </Box>
    );
  },
};
