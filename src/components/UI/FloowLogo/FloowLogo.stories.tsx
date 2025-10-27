import type { Meta, StoryObj } from '@storybook/react';
import { FloowLogo } from './FloowLogo';

const meta: Meta<typeof FloowLogo> = {
  title: 'UI/FloowLogo',
  component: FloowLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showText: {
      control: 'boolean',
      description: 'Show or hide the "Floow" text next to the logo',
      defaultValue: true,
    },
    width: {
      control: 'text',
      description: 'Custom width for the logo icon (e.g., "100px", "5rem")',
    },
    height: {
      control: 'text',
      description: 'Custom height for the logo icon (e.g., "100px", "5rem")',
    },
    variant: {
      control: 'radio',
      options: ['light', 'white'],
      description: 'Logo variant - light (black text for light backgrounds) or white (white gradient text for dark backgrounds)',
      defaultValue: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FloowLogo>;

export const Default: Story = {
  args: {
    showText: true,
  },
};

export const LogoOnly: Story = {
  args: {
    showText: false,
  },
};

export const CustomSize: Story = {
  args: {
    showText: true,
    width: '100px',
    height: '100px',
  },
};

export const SmallSize: Story = {
  args: {
    showText: true,
    width: '40px',
    height: '40px',
  },
};

export const LargeSize: Story = {
  args: {
    showText: true,
    width: '120px',
    height: '120px',
  },
};

export const WhiteVariant: Story = {
  args: {
    showText: true,
    variant: 'white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const WhiteVariantLogoOnly: Story = {
  args: {
    showText: false,
    variant: 'white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const LightVariant: Story = {
  args: {
    showText: true,
    variant: 'light',
  },
};
