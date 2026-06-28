/**
 * This file demonstrates how to use the GlobalModal component in your application
 */

import { Button } from '../Button';
import { useGlobalModalOuterContext, AddMemberScreen, ModalSizes } from './index';

/**
 * Example 1: Basic usage with AddMember modal
 */
export const AddMemberExample = () => {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleOpenModal = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: (
        <AddMemberScreen
          onInvite={async (data) => {
            console.log('Member invited:', data);
            // Here you would call your API
            // await api.inviteUser(data);
            alert(`Invitation sent to ${data.email} with role ${data.role}`);
          }}
        />
      ),
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return (
    <Button onClick={handleOpenModal} color="primary" variant="contained">
      Add Member
    </Button>
  );
};

/**
 * Example 2: With custom roles
 */
export const AddMemberWithCustomRolesExample = () => {
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
            try {
              // Your API call here
              console.log('Inviting with custom role:', data);
              // await inviteUserAPI(data);
              alert('User invited successfully!');
            } catch (error) {
              console.error('Failed to invite user:', error);
              alert('Failed to invite user. Please try again.');
            }
          }}
        />
      ),
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return (
    <Button onClick={handleOpenModal} color="secondary" variant="contained">
      Add Member (Custom Roles)
    </Button>
  );
};

/**
 * Example 3: Creating a custom modal screen
 *
 * To create your own modal screen:
 * 1. Create a new component in the screens directory
 * 2. Use useGlobalModalInnerContext to configure the modal
 * 3. Set the modal title, buttons, and callbacks
 */

/*
import { useEffect } from 'react';
import { useGlobalModalInnerContext } from '../../context';

export const CustomModalScreen = () => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm
  } = useGlobalModalInnerContext();

  useEffect(() => {
    // Configure modal
    updateModalTitle('Custom Modal');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Save',
      cancelButtonText: 'Cancel',
    });

    updateOnClose(() => {
      console.log('Modal closed');
    });

    updateOnConfirm(() => {
      console.log('Confirmed');
      // Handle your logic here
    });
  }, []);

  return (
    <div>
      Your custom modal content here
    </div>
  );
};
*/

/**
 * Example 4: Usage in a component
 */
export const MyComponent = () => {
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const handleClick = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <AddMemberScreen />,
      fieldName: 'addMember',
      size: ModalSizes.SMALL,
    });
  };

  return (
    <div>
      <h1>My Component</h1>
      <button onClick={handleClick}>Open Modal</button>
    </div>
  );
};
