import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../../../../../components/Forms/Input';
import { StandaloneDropdown } from '../../../../../components/Forms/Dropdown';
import { companyMemberService } from '../../../../../services/api/companyMember';
import type { CompanyRole } from '../../../../../services/api/companyMember';
import { MemberInviteRequestCompanyRoleEnum } from '../../../../../../workflow-api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../../components/GlobalModal';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { useSchema } from '../../../../../utils/validation';
import { InviteMemberFormSchema } from './InviteMemberFormSchema';
import { FormContainer, FormWrapper } from './InviteMemberForm.styles';

interface InviteMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface InviteFormData {
  email: string;
}

const ROLE_OPTIONS = [
  { label: 'Manager', value: MemberInviteRequestCompanyRoleEnum.Manager },
  { label: 'Editor', value: MemberInviteRequestCompanyRoleEnum.Editor },
  { label: 'Viewer', value: MemberInviteRequestCompanyRoleEnum.Viewer },
];

export const InviteMemberForm: React.FC<InviteMemberFormProps> = ({ onSuccess, onCancel }) => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } = useSchema(InviteMemberFormSchema);

  const methods = useForm<InviteFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
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
        response.data.expiresAt
          ? `Invitation sent to ${response.data.email}. Expires: ${new Date(response.data.expiresAt).toLocaleDateString()}`
          : `Invitation sent to ${response.data.email}.`
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
            label={fieldLabels.email}
            type="email"
            placeholder={placeHolders.email}
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
