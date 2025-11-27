import type { Meta, StoryObj } from '@storybook/react';
import { GlobalModal } from './GlobalModal';
import { GlobalModalOuterContextProvider, useGlobalModalOuterContext } from './context';
import { AddMemberScreen } from './screens/AddMember';
import { ModalSizes } from './enums';
import { Button } from '../Button';
import { Box } from '@mui/material';

const meta: Meta<typeof GlobalModal> = {
  title: 'UI/GlobalModal',
  component: GlobalModal,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <GlobalModalOuterContextProvider>
        <Story />
      </GlobalModalOuterContextProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlobalModal>;

// Example component that demonstrates how to use the GlobalModal
const AddMemberExample = () => {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleOpenModal = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: (
        <AddMemberScreen
          onInvite={async (data) => {
            console.log('Member invited:', data);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert(`Invitation sent to ${data.email} with role ${data.role}`);
          }}
        />
      ),
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return (
    <Box>
      <Button onClick={handleOpenModal} color="primary" variant="contained">
        Add Member
      </Button>
      <GlobalModal />
    </Box>
  );
};

export const AddMemberModal: Story = {
  render: () => <AddMemberExample />,
};

// Example with different roles
const AddMemberWithCustomRolesExample = () => {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const customRoles = [
    { label: 'Super Admin', value: 'super_admin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Contributor', value: 'contributor' },
    { label: 'Viewer', value: 'viewer' },
  ];

  const handleOpenModal = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: (
        <AddMemberScreen
          roles={customRoles}
          onInvite={async (data) => {
            console.log('Member invited with custom role:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert(`Invitation sent to ${data.email} with role ${data.role}`);
          }}
        />
      ),
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return (
    <Box>
      <Button onClick={handleOpenModal} color="primary" variant="contained">
        Add Member (Custom Roles)
      </Button>
      <GlobalModal />
    </Box>
  );
};

export const AddMemberWithCustomRoles: Story = {
  render: () => <AddMemberWithCustomRolesExample />,
};
