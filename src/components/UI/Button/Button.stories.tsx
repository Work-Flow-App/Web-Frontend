import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Box } from '@mui/material';

// Example icons (you can replace with actual icons from your design)
const UserAddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.41016 22C3.41016 18.13 7.26015 15 12.0002 15C12.9602 15 13.8902 15.13 14.7602 15.37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 18C22 18.32 21.96 18.63 21.88 18.93C21.79 19.33 21.63 19.72 21.42 20.06C20.73 21.22 19.46 22 18 22C16.97 22 16.04 21.61 15.34 20.97C15.04 20.71 14.78 20.4 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.92 14.43 15.93 15.13 15.21C15.86 14.46 16.88 14 18 14C19.18 14 20.25 14.51 20.97 15.33C21.61 16.04 22 16.98 22 18Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.49 17.98H16.51" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 16.52V19.51" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable button component following the Floow design system specifications from Figma.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'Visual style variant of the button',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'],
      description: 'Color scheme of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'If true, shows loading state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'If true, button takes full width of container',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Color variants
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'contained',
    color: 'secondary',
    size: 'large',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary Button',
    variant: 'contained',
    color: 'tertiary',
    size: 'large',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'contained',
    color: 'success',
    size: 'large',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'contained',
    color: 'warning',
    size: 'large',
  },
};

export const Error: Story = {
  args: {
    children: 'Error Button',
    variant: 'contained',
    color: 'error',
    size: 'large',
  },
};

// Variant examples
export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
    color: 'primary',
    size: 'large',
  },
};

export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
    color: 'primary',
    size: 'medium',
  },
};

// Button with icon
export const WithIcon: Story = {
  args: {
    children: 'Add Member',
    variant: 'contained',
    color: 'primary',
    size: 'large',
    startIcon: <UserAddIcon />,
  },
};

// Size variants
export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'contained',
    color: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
  },
};

// State variants
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
    disabled: true,
  },
};

// Full width - Matches Figma spec (451px = 28.1875rem)
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '28.1875rem' }}>
        <Story />
      </Box>
    ),
  ],
};

// All color variants showcase
export const AllColors: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'large',
  },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '28.1875rem' }}>
      <Button variant="contained" color="primary" size="large" fullWidth>
        Primary
      </Button>
      <Button variant="contained" color="secondary" size="large" fullWidth>
        Secondary
      </Button>
      <Button variant="contained" color="tertiary" size="large" fullWidth>
        Tertiary
      </Button>
      <Button variant="contained" color="success" size="large" fullWidth>
        Success
      </Button>
      <Button variant="contained" color="warning" size="large" fullWidth>
        Warning
      </Button>
      <Button variant="contained" color="error" size="large" fullWidth>
        Error
      </Button>
    </Box>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
  render: () => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant="contained" color="primary" size="small">
        Small
      </Button>
      <Button variant="contained" color="primary" size="medium">
        Medium
      </Button>
      <Button variant="contained" color="primary" size="large">
        Large
      </Button>
    </Box>
  ),
};

// Interactive example
export const Interactive: Story = {
  args: {
    children: 'Click me',
    variant: 'contained',
    color: 'primary',
    size: 'large',
    onClick: () => alert('Button clicked!'),
  },
};
