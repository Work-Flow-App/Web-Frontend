import type { Meta, StoryObj } from '@storybook/react';
import { Search } from './Search';

const meta: Meta<typeof Search> = {
  title: 'UI/Search',
  component: Search,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'Controlled value for the search input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled',
    },
    width: {
      control: 'text',
      description: 'Width of the search component (number or string with units)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the input value changes',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback fired when Enter key is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    placeholder: 'Search',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search for anything...',
  },
};

export const CustomWidth: Story = {
  args: {
    placeholder: 'Search',
    width: 400,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search',
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    placeholder: 'Search',
    value: 'Initial search term',
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: 'Search',
    width: '100%',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};
