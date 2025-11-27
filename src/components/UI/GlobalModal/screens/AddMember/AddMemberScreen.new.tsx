import { SetupFormWrapper } from '../../../SetupFormWrapper';
import type { AddMemberScreenProps, AddMemberFormData } from './AddMemberScreen.types';
import { AddMemberFormSchema } from './AddMemberSchema';
import { Input } from '../../../Forms/Input';
import { Dropdown } from '../../../Forms/Dropdown';
import * as S from './AddMemberScreen.styled';

const DEFAULT_ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Worker', value: 'worker' },
  { label: 'Viewer', value: 'viewer' },
];

export const AddMemberScreen = (props: AddMemberScreenProps) => {
  const { roles = DEFAULT_ROLES, onInvite } = props;

  return (
    <SetupFormWrapper<AddMemberFormData>
      title="Add Member"
      schema={AddMemberFormSchema}
      confirmButtonText="Invite"
      cancelButtonText="Cancel"
      successMessage="Member invited successfully!"
      errorMessage="Failed to invite member. Please try again."
      onSubmit={async (data) => {
        if (onInvite) {
          await onInvite(data);
        }
      }}
      closeModalOnSuccess={true}
    >
      <S.FieldWrapper>
        <Input
          name="email"
          label="Email"
          placeholder="Enter email address"
          fullWidth
        />
      </S.FieldWrapper>

      <S.FieldWrapper>
        <Dropdown
          name="role"
          label="Role"
          placeHolder="Select a role"
          preFetchedOptions={roles}
          fullWidth
        />
      </S.FieldWrapper>
    </SetupFormWrapper>
  );
};
