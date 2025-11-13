import type { Meta, StoryObj } from '@storybook/react';
import { NotificationList } from './NotificationList';
import type { Notification } from './NotificationList.types';
import { CalendarExceededIcon, ChecklistIcon, DocumentIcon } from './icons';

const meta: Meta<typeof NotificationList> = {
  title: 'UI/NotificationList',
  component: NotificationList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NotificationList>;

// Sample notifications data
const sampleNotifications: Notification[] = [
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

const notificationsWithAvatars: Notification[] = [
  {
    id: '1',
    title: 'Due date exceeded, action required',
    jobId: 'J-0001',
    user: 'Esther Howard',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isRead: false,
  },
  {
    id: '2',
    title: 'Job completed successfully',
    jobId: 'J-0002',
    user: 'Wade Warren',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isRead: false,
  },
  {
    id: '3',
    title: 'Workflow needs your approval',
    jobId: 'J-0003',
    user: 'Robert Fox',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isRead: true,
  },
];

export const Default: Story = {
  args: {
    notifications: sampleNotifications,
    title: 'Notifications',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const WithAvatars: Story = {
  args: {
    notifications: notificationsWithAvatars,
    title: 'Notifications',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const Empty: Story = {
  args: {
    notifications: [],
    title: 'Notifications',
    showClearAll: true,
  },
};

export const WithoutClearAll: Story = {
  args: {
    notifications: sampleNotifications,
    title: 'Notifications',
    showClearAll: false,
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const ManyNotifications: Story = {
  args: {
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
      {
        id: '7',
        title: 'Deadline approaching',
        jobId: 'J-0007',
        user: 'Mike Johnson',
        icon: <CalendarExceededIcon />,
        isRead: false,
      },
    ],
    title: 'Notifications',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const AllRead: Story = {
  args: {
    notifications: sampleNotifications.map(n => ({ ...n, isRead: true })),
    title: 'Notifications',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const MixedContent: Story = {
  args: {
    notifications: [
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
        title: 'System update completed',
        subtitle: '2 minutes ago',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isRead: false,
      },
      {
        id: '3',
        title: 'New comment on your post',
        user: 'Robert Fox',
        isRead: true,
      },
    ],
    title: 'Notifications',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};

export const CustomTitle: Story = {
  args: {
    notifications: sampleNotifications,
    title: 'Recent Activity',
    showClearAll: true,
    onClearAll: () => console.log('Clear all clicked'),
    onMailClick: (id) => console.log('Mail clicked:', id),
    onViewClick: (notification) => console.log('View clicked:', notification),
  },
};
