import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'UI/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A styled search input field with accessibility support and keyboard handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'Current value of the search input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    variant: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Variant style of the search input',
    },
    'aria-label': {
      control: 'text',
      description: 'Aria label for accessibility',
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default search input with placeholder text and icon
 */
export const Default: Story = {
  args: {
    placeholder: 'Search...',
  },
};

/**
 * Search input with a value
 */
export const WithValue: Story = {
  args: {
    placeholder: 'Search...',
    value: 'Example search',
  },
};

/**
 * Dark variant search input (for dark backgrounds)
 */
export const Dark: Story = {
  args: {
    placeholder: 'Search...',
    variant: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1b232d', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Disabled search input
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Search...',
    disabled: true,
  },
};

/**
 * Disabled dark variant search input
 */
export const DisabledDark: Story = {
  args: {
    placeholder: 'Search...',
    variant: 'dark',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1b232d', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Search input with custom aria label
 */
export const WithAriaLabel: Story = {
  args: {
    placeholder: 'Search products...',
    'aria-label': 'Search for products',
  },
};

/**
 * Interactive search input with state management
 */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');

    const handleSearch = (query: string) => {
      console.log('Search query:', query);
    };

    return (
      <SearchInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={handleSearch}
      />
    );
  },
  args: {
    placeholder: 'Press Enter to search...',
  },
};
