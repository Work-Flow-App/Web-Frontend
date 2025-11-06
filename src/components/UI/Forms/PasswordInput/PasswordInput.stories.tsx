import type { Meta, StoryObj } from '@storybook/react';
import { useForm, FormProvider } from 'react-hook-form';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'UI/Forms/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A password input component with show/hide toggle functionality built on top of the Input component.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for react-hook-form
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

// Basic password input
export const Default: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '300px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// With helper text
export const WithHelperText: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '300px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// With error
export const WithError: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    error: { message: 'Password is required' },
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '300px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <FormWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
        <PasswordInput
          name="password-small"
          label="Small"
          placeholder="Small password input"
          size="small"
        />
        <PasswordInput
          name="password-medium"
          label="Medium"
          placeholder="Medium password input"
          size="medium"
        />
        <PasswordInput
          name="password-large"
          label="Large"
          placeholder="Large password input"
          size="large"
        />
      </div>
    </FormWrapper>
  ),
};

// Full width
export const FullWidth: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    fullWidth: true,
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// Disabled
export const Disabled: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    disabled: true,
    value: 'secretpassword123',
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '300px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// Without toggle
export const WithoutToggle: Story = {
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    showToggle: false,
    helperText: 'No visibility toggle',
  },
  render: (args) => (
    <FormWrapper>
      <div style={{ width: '300px' }}>
        <PasswordInput {...args} />
      </div>
    </FormWrapper>
  ),
};

// Form example - Signup
export const SignupForm: Story = {
  render: () => {
    const SignupExample = () => {
      const methods = useForm();

      const onSubmit = (data: Record<string, unknown>) => {
        console.log('Form submitted:', data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Create Account</h3>
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Create a password"
                helperText="Minimum 8 characters"
              />
              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                Sign Up
              </button>
            </div>
          </form>
        </FormProvider>
      );
    };
    return <SignupExample />;
  },
};

// Form example - Login
export const LoginForm: Story = {
  render: () => {
    const LoginExample = () => {
      const methods = useForm();

      const onSubmit = (data: Record<string, unknown>) => {
        console.log('Form submitted:', data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '400px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Sign In</h3>
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        </FormProvider>
      );
    };
    return <LoginExample />;
  },
};
