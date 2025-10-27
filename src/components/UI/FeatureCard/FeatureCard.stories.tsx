import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TeamIcon from '@mui/icons-material/Groups';

const meta: Meta<typeof FeatureCard> = {
  title: 'UI/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'black', value: '#000000' },
        { name: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the feature card',
    },
    description: {
      control: 'text',
      description: 'The description text of the feature card',
    },
    icon: {
      control: false,
      description: 'Optional icon/image to display above the title',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler for the card',
    },
    background: {
      control: 'text',
      description: 'Custom background color/gradient',
    },
    borderColor: {
      control: 'text',
      description: 'Custom border color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const JobTracking: Story = {
  args: {
    title: 'Job Tracking',
    description:
      'Keep all your jobs organized and visible in one place. With Floow.\n\nNo more scattered notes or missed deadlines, everything you need stays right where you can see it.',
    background: 'rgba(0, 0, 0, 0.6)', // More visible background for Storybook
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Calendar: Story = {
  args: {
    title: 'Smart Calendar',
    description:
      'Never miss an important date again. Floow keeps track of all your deadlines and appointments in one beautiful interface.',
    icon: <CalendarTodayIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
  },
};

export const Analytics: Story = {
  args: {
    title: 'Analytics Dashboard',
    description:
      'Get insights into your productivity and track your progress over time with our powerful analytics tools.',
    icon: <AnalyticsIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
  },
};

export const TeamCollaboration: Story = {
  args: {
    title: 'Team Collaboration',
    description:
      'Work together seamlessly with your team. Share updates, assign tasks, and stay connected all in one place.',
    icon: <TeamIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Simple Feature',
    description: 'This card demonstrates a feature card without an icon. Clean and minimal design that focuses on the content.',
  },
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    description: 'This card has a click handler and will show a pointer cursor on hover. Try clicking it!',
    icon: <WorkIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
    onClick: () => alert('Card clicked!'),
  },
};

// Custom Background Variants
export const CustomBlueBackground: Story = {
  args: {
    title: 'Custom Blue Theme',
    description: 'This card uses a custom blue gradient background with matching border for a unique look.',
    icon: <AnalyticsIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const CustomPurpleBackground: Story = {
  args: {
    title: 'Purple Gradient',
    description: 'A vibrant purple gradient background that stands out on any page.',
    icon: <TeamIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const CustomGreenBackground: Story = {
  args: {
    title: 'Success Theme',
    description: 'Perfect for success messages or positive feature highlights with a green gradient.',
    icon: <CalendarTodayIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const SolidBackground: Story = {
  args: {
    title: 'Solid Dark Card',
    description: 'Sometimes less is more. This card uses a solid dark background for a more subtle appearance.',
    icon: <WorkIcon sx={{ fontSize: '48px', color: '#FFFFFF' }} />,
    background: 'rgba(30, 30, 30, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
