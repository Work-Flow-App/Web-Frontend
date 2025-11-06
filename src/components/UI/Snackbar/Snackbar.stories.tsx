import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Snackbar } from './Snackbar';
import { Button } from '../Button';

const meta = {
  title: 'UI/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A notification component to display success, error, warning, and info messages.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Success variant
export const Success: Story = {
  args: {
    open: false,
    message: 'Account created successfully!',
    variant: 'success',
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)}>Show Success</Button>
          <Snackbar
            open={open}
            message="Account created successfully!"
            variant="success"
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// Error variant
export const Error: Story = {
  args: {
    open: false,
    message: 'Failed to create account. Please try again.',
    variant: 'error',
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)} color="error">
            Show Error
          </Button>
          <Snackbar
            open={open}
            message="Failed to create account. Please try again."
            variant="error"
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// Warning variant
export const Warning: Story = {
  args: {
    open: false,
    message: 'Your session will expire in 5 minutes.',
    variant: 'warning',
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)}>Show Warning</Button>
          <Snackbar
            open={open}
            message="Your session will expire in 5 minutes."
            variant="warning"
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// Info variant
export const Info: Story = {
  args: {
    open: false,
    message: 'New features are now available!',
    variant: 'info',
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)}>Show Info</Button>
          <Snackbar
            open={open}
            message="New features are now available!"
            variant="info"
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// Different positions
export const Positions: Story = {
  args: {
    open: false,
    message: 'Position example',
  },
  render: () => {
    const PositionsExample = () => {
      const [topLeft, setTopLeft] = useState(false);
      const [topCenter, setTopCenter] = useState(false);
      const [topRight, setTopRight] = useState(false);
      const [bottomLeft, setBottomLeft] = useState(false);
      const [bottomCenter, setBottomCenter] = useState(false);
      const [bottomRight, setBottomRight] = useState(false);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button onClick={() => setTopLeft(true)}>Top Left</Button>
          <Button onClick={() => setTopCenter(true)}>Top Center</Button>
          <Button onClick={() => setTopRight(true)}>Top Right</Button>
          <Button onClick={() => setBottomLeft(true)}>Bottom Left</Button>
          <Button onClick={() => setBottomCenter(true)}>Bottom Center</Button>
          <Button onClick={() => setBottomRight(true)}>Bottom Right</Button>

          <Snackbar
            open={topLeft}
            message="Top Left Position"
            variant="success"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={() => setTopLeft(false)}
          />
          <Snackbar
            open={topCenter}
            message="Top Center Position"
            variant="info"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setTopCenter(false)}
          />
          <Snackbar
            open={topRight}
            message="Top Right Position"
            variant="warning"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() => setTopRight(false)}
          />
          <Snackbar
            open={bottomLeft}
            message="Bottom Left Position"
            variant="error"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={() => setBottomLeft(false)}
          />
          <Snackbar
            open={bottomCenter}
            message="Bottom Center Position"
            variant="success"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={() => setBottomCenter(false)}
          />
          <Snackbar
            open={bottomRight}
            message="Bottom Right Position (Default)"
            variant="info"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={() => setBottomRight(false)}
          />
        </div>
      );
    };
    return <PositionsExample />;
  },
};

// Long message
export const LongMessage: Story = {
  args: {
    open: false,
    message: 'This is a very long message that demonstrates how the snackbar handles text wrapping when the content exceeds the maximum width.',
    variant: 'warning',
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)}>Show Long Message</Button>
          <Snackbar
            open={open}
            message="This is a very long message that demonstrates how the snackbar handles text wrapping when the content exceeds the maximum width."
            variant="warning"
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// Custom duration
export const CustomDuration: Story = {
  args: {
    open: false,
    message: 'This message will auto-hide after 10 seconds',
    variant: 'info',
    autoHideDuration: 10000,
  },
  render: () => {
    const SnackbarExample = () => {
      const [open, setOpen] = useState(false);

      return (
        <div>
          <Button onClick={() => setOpen(true)}>Show for 10 seconds</Button>
          <Snackbar
            open={open}
            message="This message will auto-hide after 10 seconds"
            variant="info"
            autoHideDuration={10000}
            onClose={() => setOpen(false)}
          />
        </div>
      );
    };
    return <SnackbarExample />;
  },
};

// All variants showcase
export const AllVariants: Story = {
  args: {
    open: false,
    message: 'All variants showcase',
  },
  render: () => {
    const AllVariantsExample = () => {
      const [success, setSuccess] = useState(false);
      const [error, setError] = useState(false);
      const [warning, setWarning] = useState(false);
      const [info, setInfo] = useState(false);

      const showAll = () => {
        setSuccess(true);
        setTimeout(() => setError(true), 500);
        setTimeout(() => setWarning(true), 1000);
        setTimeout(() => setInfo(true), 1500);
      };

      return (
        <div>
          <Button onClick={showAll}>Show All Variants</Button>
          <Snackbar
            open={success}
            message="Success: Account created!"
            variant="success"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() => setSuccess(false)}
          />
          <Snackbar
            open={error}
            message="Error: Failed to save changes"
            variant="error"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={() => setError(false)}
          />
          <Snackbar
            open={warning}
            message="Warning: Session expiring soon"
            variant="warning"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={() => setWarning(false)}
          />
          <Snackbar
            open={info}
            message="Info: New updates available"
            variant="info"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={() => setInfo(false)}
          />
        </div>
      );
    };
    return <AllVariantsExample />;
  },
};
