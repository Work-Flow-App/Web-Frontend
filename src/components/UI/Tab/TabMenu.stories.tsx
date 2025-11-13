import type { Meta, StoryObj } from '@storybook/react';
import { TabMenu } from './TabMenu';
import { Box } from '@mui/material';
import { useState } from 'react';

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

const ResourcesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
      fill="currentColor"
    />
  </svg>
);

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
  { id: 'workers', label: 'Workers', icon: <WorkersIcon /> },
  { id: 'resources', label: 'Resources', icon: <ResourcesIcon /> },
];

const tabsWithoutIcons = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'workers', label: 'Workers' },
  { id: 'resources', label: 'Resources' },
];

const tabsWithDisabled = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
  { id: 'workers', label: 'Workers', icon: <WorkersIcon />, disabled: true },
  { id: 'resources', label: 'Resources', icon: <ResourcesIcon /> },
];

const meta = {
  title: 'UI/TabMenu',
  component: TabMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A container component that manages multiple tabs. Handles tab selection and provides a consistent navigation interface matching the Floow design system specifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'text',
      description: 'Currently active tab id',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of all tabs',
    },
  },
} satisfies Meta<typeof TabMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default TabMenu
export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('jobs');
    return <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />;
  },
};

// TabMenu without icons
export const WithoutIcons: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    return (
      <TabMenu tabs={tabsWithoutIcons} activeTab={activeTab} onChange={setActiveTab} size="medium" />
    );
  },
};

// TabMenu with disabled tab
export const WithDisabledTab: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('jobs');
    return (
      <TabMenu tabs={tabsWithDisabled} activeTab={activeTab} onChange={setActiveTab} size="medium" />
    );
  },
};

// Small size
export const SmallSize: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    return <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="small" />;
  },
};

// Medium size (default)
export const MediumSize: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('jobs');
    return <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />;
  },
};

// Large size
export const LargeSize: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('workers');
    return <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="large" />;
  },
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => {
    const [smallActive, setSmallActive] = useState('jobs');
    const [mediumActive, setMediumActive] = useState('jobs');
    const [largeActive, setLargeActive] = useState('jobs');

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <Box>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>Small</h4>
          <TabMenu tabs={tabs} activeTab={smallActive} onChange={setSmallActive} size="small" />
        </Box>
        <Box>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>Medium</h4>
          <TabMenu tabs={tabs} activeTab={mediumActive} onChange={setMediumActive} size="medium" />
        </Box>
        <Box>
          <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: '#fff' }}>Large</h4>
          <TabMenu tabs={tabs} activeTab={largeActive} onChange={setLargeActive} size="large" />
        </Box>
      </Box>
    );
  },
};

// Two tabs only
export const TwoTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const twoTabs = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { id: 'jobs', label: 'Jobs', icon: <JobsIcon /> },
    ];
    return <TabMenu tabs={twoTabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />;
  },
};

// Many tabs (demonstrating scrolling on mobile)
export const ManyTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab3');
    const manyTabs = [
      { id: 'tab1', label: 'Tab 1', icon: <DashboardIcon /> },
      { id: 'tab2', label: 'Tab 2', icon: <JobsIcon /> },
      { id: 'tab3', label: 'Tab 3', icon: <WorkersIcon /> },
      { id: 'tab4', label: 'Tab 4', icon: <ResourcesIcon /> },
      { id: 'tab5', label: 'Tab 5', icon: <DashboardIcon /> },
      { id: 'tab6', label: 'Tab 6', icon: <JobsIcon /> },
    ];
    return <TabMenu tabs={manyTabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />;
  },
};

// Interactive with content
export const WithContent: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const getContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return 'Dashboard Content';
        case 'jobs':
          return 'Jobs Content';
        case 'workers':
          return 'Workers Content';
        case 'resources':
          return 'Resources Content';
        default:
          return '';
      }
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />
        <Box
          sx={{
            padding: '2rem',
            background: '#262626',
            borderRadius: '8px',
            minWidth: '300px',
            textAlign: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 600,
          }}
        >
          {getContent()}
        </Box>
      </Box>
    );
  },
};

// Dark background showcase (matching design)
export const DesignShowcase: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('jobs');
    return (
      <Box
        sx={{
          background: '#0A0A0A',
          padding: '3rem',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <Box sx={{ textAlign: 'center', color: '#fff', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Floow Navigation</h2>
          <p style={{ margin: 0, color: '#A1A1A1', fontSize: '14px' }}>
            Select a tab to navigate
          </p>
        </Box>
        <TabMenu tabs={tabs} activeTab={activeTab} onChange={setActiveTab} size="medium" />
      </Box>
    );
  },
};
