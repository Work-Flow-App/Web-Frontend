import type { Meta, StoryObj } from '@storybook/react';
import { NotificationDropdown } from './NotificationDropdown';
import type { INotification } from './INotificationList';
import { CalendarExceededIcon, ChecklistIcon, DocumentIcon } from './icons';
import { Box } from '@mui/material';

const meta: Meta<typeof NotificationDropdown> = {
  title: 'UI/NotificationDropdown',
  component: NotificationDropdown,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationDropdown>;

// Sample notifications data
const sampleNotifications: INotification[] = [
  {
    id: '1',
    title: 'Due date exceeded, action required',
    jobId: 'J-0001',
    user: 'Esther Howard',
    icon: <CalendarExceededIcon />,
    isRead: false,
  },
  {
    id: '2',
    title: 'Job completed successfully',
    jobId: 'J-0002',
    user: 'Wade Warren',
    icon: <ChecklistIcon />,
    isRead: false,
  },
  {
    id: '3',
    title: 'Workflow needs your approval',
    jobId: 'J-0003',
    user: 'Robert Fox',
    icon: <DocumentIcon />,
    isRead: true,
  },
];

// Simple notification icon button for demo
const NotificationButton = () => (
  <Box
    sx={{
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#171717',
      borderRadius: 1,
      cursor: 'pointer',
      position: 'relative',
      '&:hover': {
        background: '#262626',
      },
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.90002 21.18C9.36002 20.64 9.02002 19.88 9.02002 19.06"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
    {/* Red badge */}
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        background: '#FB2C36',
        borderRadius: '50%',
      }}
    />
  </Box>
);

export const Default: Story = {
  args: {
    trigger: <NotificationButton />,
    notifications: sampleNotifications,
    title: 'Notifications',
    showClearAll: true,
    position: 'bottom-right',
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const BottomLeft: Story = {
  args: {
    ...Default.args,
    position: 'bottom-left',
  },
};

export const TopRight: Story = {
  args: {
    ...Default.args,
    position: 'top-right',
  },
  decorators: [
    (Story) => (
      <Box sx={{ paddingTop: '500px' }}>
        <Story />
      </Box>
    ),
  ],
};

export const ManyNotifications: Story = {
  args: {
    trigger: <NotificationButton />,
    notifications: [
      ...sampleNotifications,
      {
        id: '4',
        title: 'New task assigned to you',
        jobId: 'J-0004',
        user: 'Jane Cooper',
        icon: <DocumentIcon />,
        isRead: false,
      },
      {
        id: '5',
        title: 'Payment received',
        jobId: 'J-0005',
        user: 'John Doe',
        icon: <ChecklistIcon />,
        isRead: false,
      },
      {
        id: '6',
        title: 'Review required',
        jobId: 'J-0006',
        user: 'Sarah Smith',
        icon: <CalendarExceededIcon />,
        isRead: false,
      },
    ],
    title: 'Notifications',
    showClearAll: true,
    position: 'bottom-right',
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const WithAvatars: Story = {
  args: {
    trigger: <NotificationButton />,
    notifications: [
      {
        id: '1',
        title: 'Due date exceeded, action required',
        jobId: 'J-0001',
        user: 'Esther Howard',
        avatar: 'https://i.pravatar.cc/150?img=1',
        icon: <CalendarExceededIcon />,
        isRead: false,
      },
      {
        id: '2',
        title: 'Job completed successfully',
        jobId: 'J-0002',
        user: 'Wade Warren',
        avatar: 'https://i.pravatar.cc/150?img=2',
        icon: <ChecklistIcon />,
        isRead: false,
      },
    ],
    title: 'Notifications',
    showClearAll: true,
    position: 'bottom-right',
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};
