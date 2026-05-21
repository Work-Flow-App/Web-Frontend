import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../../../../components/UI/Forms/Input';
import { StandaloneDropdown } from '../../../../../components/UI/Forms/Dropdown';
import { companyMemberService } from '../../../../../services/api/companyMember';
import type { CompanyRole } from '../../../../../services/api/companyMember';
import { MemberInviteRequestCompanyRoleEnum } from '../../../../../../workflow-api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { FormContainer, FormWrapper } from './InviteMemberForm.styles';

interface InviteMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface InviteFormData {
  email: string;
}

const inviteSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format')
    .max(100, 'Email must be at most 100 characters'),
});

const ROLE_OPTIONS = [
  { label: 'Manager', value: MemberInviteRequestCompanyRoleEnum.Manager },
  { label: 'Editor', value: MemberInviteRequestCompanyRoleEnum.Editor },
  { label: 'Viewer', value: MemberInviteRequestCompanyRoleEnum.Viewer },
];

export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({ onSuccess, onCancel }) => {
  const methods = useForm<InviteFormData>({
    resolver: yupResolver(inviteSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors } } = methods;
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  const [companyRole, setCompanyRole] = useState<CompanyRole>(MemberInviteRequestCompanyRoleEnum.Editor);
  const companyRoleRef = useRef<CompanyRole>(MemberInviteRequestCompanyRoleEnum.Editor);

  useEffect(() => {
    updateModalTitle('Invite Team Member');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Send Invitation',
      cancelButtonText: 'Cancel',
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => {
      handleSubmit(onSubmit)();
    });
  }, [updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, onCancel]);

  const onSubmit = async (data: InviteFormData) => {
    try {
      const response = await companyMemberService.inviteMember({
        email: data.email,
        companyRole: companyRoleRef.current,
      });
      showSuccess(
        `Invitation sent to ${response.data.email}. Expires: ${new Date(response.data.expiresAt ?? '').toLocaleDateString()}`
      );
      onSuccess?.();
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to send invitation. Please try again.'));
    }
  };

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <FormWrapper>
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="member@example.com"
            fullWidth
            error={errors.email}
          />
          <StandaloneDropdown
            name="companyRole"
            label="Role"
            placeHolder="Select role"
            preFetchedOptions={ROLE_OPTIONS}
            defaultValue={companyRole}
            disablePortal
            onChange={(value) => {
              setCompanyRole(value as CompanyRole);
              companyRoleRef.current = value as CompanyRole;
            }}
          />
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
