import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from './PricingCard';

const meta: Meta<typeof PricingCard> = {
  title: 'UI/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    planName: {
      control: 'text',
      description: 'The plan name/title',
    },
    planDescription: {
      control: 'text',
      description: 'The plan description/subtitle',
    },
    price: {
      control: 'text',
      description: 'The price amount',
    },
    pricePeriod: {
      control: 'text',
      description: 'The price period (e.g., "per month", "per year")',
    },
    currency: {
      control: 'text',
      description: 'The currency symbol',
    },
    buttonText: {
      control: 'text',
      description: 'The button text',
    },
    onButtonClick: {
      action: 'button clicked',
      description: 'Button click handler',
    },
    background: {
      control: 'text',
      description: 'Optional custom background gradient',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

export const Standard: Story = {
  args: {
    planName: 'Standard',
    planDescription: 'Best for professional use',
    price: '15',
    pricePeriod: 'per month',
    currency: '$',
    buttonText: 'Get Started',
    features: [
      { text: 'Clients directory', included: true },
      { text: 'Jobs management', included: true },
      { text: 'File storage upto 8Gb', included: true },
      { text: 'Collaboration tools', included: true },
      { text: 'Dashboard and analytics', included: true },
    ],
  },
};

export const Premium: Story = {
  args: {
    planName: 'Premium',
    planDescription: 'For teams and enterprises',
    price: '49',
    pricePeriod: 'per month',
    currency: '$',
    buttonText: 'Get Started',
    features: [
      { text: 'Everything in Standard', included: true },
      { text: 'Unlimited storage', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Team management', included: true },
    ],
  },
};

export const Basic: Story = {
  args: {
    planName: 'Basic',
    planDescription: 'Perfect for individuals',
    price: '9',
    pricePeriod: 'per month',
    currency: '$',
    buttonText: 'Get Started',
    features: [
      { text: 'Up to 10 clients', included: true },
      { text: 'Basic job tracking', included: true },
      { text: 'File storage upto 2Gb', included: true },
      { text: 'Email support', included: true },
    ],
  },
};

export const Yearly: Story = {
  args: {
    planName: 'Standard',
    planDescription: 'Save 20% with annual billing',
    price: '144',
    pricePeriod: 'per year',
    currency: '$',
    buttonText: 'Subscribe Now',
    features: [
      { text: 'All Standard features', included: true },
      { text: '2 months free', included: true },
      { text: 'Priority onboarding', included: true },
      { text: 'Dedicated support', included: true },
    ],
  },
};

export const WithoutFeatures: Story = {
  args: {
    planName: 'Starter',
    planDescription: 'Try before you buy',
    price: '0',
    pricePeriod: 'forever free',
    currency: '$',
    buttonText: 'Start Free Trial',
    features: [],
  },
};

export const CustomBackground: Story = {
  args: {
    planName: 'Enterprise',
    planDescription: 'Custom solutions for large teams',
    price: '99',
    pricePeriod: 'per month',
    currency: '$',
    buttonText: 'Contact Sales',
    features: [
      { text: 'Unlimited everything', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom SLA', included: true },
      { text: 'On-premise deployment', included: true },
    ],
  },
};
