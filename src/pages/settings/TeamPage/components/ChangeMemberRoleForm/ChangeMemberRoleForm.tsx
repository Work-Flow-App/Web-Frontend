import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { StandaloneDropdown } from '../../../../../components/UI/Forms/Dropdown';
import type { CompanyRole } from '../../../../../services/api/companyMember';
import { MemberInviteRequestCompanyRoleEnum } from '../../../../../../workflow-api';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal';
import { FormContainer } from './ChangeMemberRoleForm.styles';

interface ChangeMemberRoleFormProps {
  memberName: string;
  currentRole: string;
  onConfirm: (newRole: CompanyRole) => void;
  onCancel?: () => void;
}

const ROLE_OPTIONS = [
  { label: 'Manager', value: MemberInviteRequestCompanyRoleEnum.Manager },
  { label: 'Editor', value: MemberInviteRequestCompanyRoleEnum.Editor },
  { label: 'Viewer', value: MemberInviteRequestCompanyRoleEnum.Viewer },
];

export const ChangeMemberRoleForm: React.FC<ChangeMemberRoleFormProps> = ({
  memberName,
  currentRole,
  onConfirm,
  onCancel,
}) => {
  const selectedRoleRef = useRef<CompanyRole>(
    (currentRole !== MemberInviteRequestCompanyRoleEnum.CompanyAdmin
      ? currentRole
      : MemberInviteRequestCompanyRoleEnum.Manager) as CompanyRole
  );

  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle('Change Member Role');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Save',
      cancelButtonText: 'Cancel',
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => onConfirm(selectedRoleRef.current));
  }, [updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, onCancel, onConfirm]);

  return (
    <FormContainer>
      <Typography variant="body2" color="text.secondary">
        Change role for <strong>{memberName}</strong>
      </Typography>
      <StandaloneDropdown
        name="companyRole"
        label="New Role"
        placeHolder="Select role"
        preFetchedOptions={ROLE_OPTIONS}
        defaultValue={selectedRoleRef.current}
        disablePortal
        onChange={(value) => {
          selectedRoleRef.current = value as CompanyRole;
        }}
      />
    </FormContainer>
  );
};
