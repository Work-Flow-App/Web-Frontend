import type { Meta, StoryObj } from '@storybook/react';
import { TopNav } from './TopNav';
import { Box, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

const meta = {
  title: 'UI/TopNav',
  component: TopNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive top navigation bar with FloowLogo on left and notifications/profile on right. Follows HeaderNav responsive pattern.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const RightActions = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(12) }}>
    <NotificationsIcon sx={{ cursor: 'pointer', color: floowColors.white, fontSize: rem(20) }} />
    <SettingsIcon sx={{ cursor: 'pointer', color: floowColors.white, fontSize: rem(20) }} />
    <Avatar sx={{ width: rem(36), height: rem(36), background: floowColors.grey[300], cursor: 'pointer', fontSize: rem(14), color: floowColors.black, fontWeight: 600 }}>
      AH
    </Avatar>
  </Box>
);

export const Default: Story = {
  args: {
    rightContent: <RightActions />,
  },
  render: (args) => (
    <Box sx={{ minHeight: '100vh', background: floowColors.grey[50] }}>
      <TopNav {...args} />
      <Box sx={{ padding: 3 }}>
        <h1>Page Content</h1>
        <p>TopNav with default FloowLogo and right-side actions</p>
      </Box>
    </Box>
  ),
};

export const WithoutRightContent: Story = {
  args: {},
  render: (args) => (
    <Box sx={{ minHeight: '100vh', background: floowColors.grey[50] }}>
      <TopNav {...args} />
      <Box sx={{ padding: 3 }}>
        <h1>Page Content</h1>
        <p>TopNav with only logo</p>
      </Box>
    </Box>
  ),
};

export const ResponsiveDesktop: Story = {
  args: {
    rightContent: <RightActions />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: (args) => (
    <Box sx={{ minHeight: '100vh', background: floowColors.grey[50] }}>
      <TopNav {...args} />
      <Box sx={{ padding: 3 }}>
        <h1>Desktop View</h1>
        <p>Full size display with all elements visible</p>
      </Box>
    </Box>
  ),
};

export const ResponsiveTablet: Story = {
  args: {
    rightContent: <RightActions />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
  render: (args) => (
    <Box sx={{ minHeight: '100vh', background: floowColors.grey[50] }}>
      <TopNav {...args} />
      <Box sx={{ padding: 3 }}>
        <h1>Tablet View</h1>
        <p>Responsive scaling for tablets</p>
      </Box>
    </Box>
  ),
};

export const ResponsiveMobile: Story = {
  args: {
    rightContent: <RightActions />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
  render: (args) => (
    <Box sx={{ minHeight: '100vh', background: floowColors.grey[50] }}>
      <TopNav {...args} />
      <Box sx={{ padding: 3 }}>
        <h1>Mobile View</h1>
        <p>Optimized for mobile screens</p>
      </Box>
    </Box>
  ),
};
