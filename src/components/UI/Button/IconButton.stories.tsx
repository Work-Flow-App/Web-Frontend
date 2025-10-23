import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Box } from '@mui/material';

// Example icons
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12084 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable icon button component following the Floow design system.',
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
    disabled: {
      control: 'boolean',
      description: 'If true, button is disabled',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Color variants
export const Primary: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    'aria-label': 'Search',
  },
};

export const Secondary: Story = {
  args: {
    children: <HeartIcon />,
    variant: 'contained',
    color: 'secondary',
    size: 'medium',
    'aria-label': 'Like',
  },
};

export const Tertiary: Story = {
  args: {
    children: <EditIcon />,
    variant: 'contained',
    color: 'tertiary',
    size: 'medium',
    'aria-label': 'Edit',
  },
};

export const Success: Story = {
  args: {
    children: <PlusIcon />,
    variant: 'contained',
    color: 'success',
    size: 'medium',
    'aria-label': 'Add',
  },
};

export const Warning: Story = {
  args: {
    children: <EditIcon />,
    variant: 'contained',
    color: 'warning',
    size: 'medium',
    'aria-label': 'Warning',
  },
};

export const Error: Story = {
  args: {
    children: <DeleteIcon />,
    variant: 'contained',
    color: 'error',
    size: 'medium',
    'aria-label': 'Delete',
  },
};

// Variant examples
export const Outlined: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'outlined',
    color: 'primary',
    size: 'medium',
    'aria-label': 'Search',
  },
};

export const Text: Story = {
  args: {
    children: <CloseIcon />,
    variant: 'text',
    color: 'primary',
    size: 'medium',
    'aria-label': 'Close',
  },
};

// Size variants
export const Small: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'small',
    'aria-label': 'Search',
  },
};

export const Medium: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    'aria-label': 'Search',
  },
};

export const Large: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'large',
    'aria-label': 'Search',
  },
};

// State variants
export const Loading: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    loading: true,
    'aria-label': 'Loading',
  },
};

export const Disabled: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    disabled: true,
    'aria-label': 'Search',
  },
};

// All colors showcase
export const AllColors: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
  render: () => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton variant="contained" color="primary" aria-label="Primary">
        <SearchIcon />
      </IconButton>
      <IconButton variant="contained" color="secondary" aria-label="Secondary">
        <HeartIcon />
      </IconButton>
      <IconButton variant="contained" color="tertiary" aria-label="Tertiary">
        <EditIcon />
      </IconButton>
      <IconButton variant="contained" color="success" aria-label="Success">
        <PlusIcon />
      </IconButton>
      <IconButton variant="contained" color="warning" aria-label="Warning">
        <EditIcon />
      </IconButton>
      <IconButton variant="contained" color="error" aria-label="Error">
        <DeleteIcon />
      </IconButton>
    </Box>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
  render: () => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton variant="contained" color="primary" size="small" aria-label="Small">
        <SearchIcon />
      </IconButton>
      <IconButton variant="contained" color="primary" size="medium" aria-label="Medium">
        <SearchIcon />
      </IconButton>
      <IconButton variant="contained" color="primary" size="large" aria-label="Large">
        <SearchIcon />
      </IconButton>
    </Box>
  ),
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    children: <SearchIcon />,
    variant: 'contained',
    color: 'primary',
    size: 'medium',
  },
  render: () => (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton variant="contained" color="primary" aria-label="Contained">
        <SearchIcon />
      </IconButton>
      <IconButton variant="outlined" color="primary" aria-label="Outlined">
        <SearchIcon />
      </IconButton>
      <IconButton variant="text" color="primary" aria-label="Text">
        <SearchIcon />
      </IconButton>
    </Box>
  ),
};

// Interactive example
export const Interactive: Story = {
  args: {
    children: <HeartIcon />,
    variant: 'contained',
    color: 'error',
    size: 'large',
    onClick: () => alert('Icon button clicked!'),
    'aria-label': 'Like',
  },
};
