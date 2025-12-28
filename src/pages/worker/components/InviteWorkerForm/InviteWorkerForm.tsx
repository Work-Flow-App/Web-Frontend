import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../../../components/UI/Forms/Input';
import { workerService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { FormContainer, FormWrapper } from './InviteWorkerForm.styles';

interface InviteWorkerFormProps {
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

export const InviteWorkerForm: React.FC<InviteWorkerFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const methods = useForm<InviteFormData>({
    resolver: yupResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const { showSuccess, showError } = useSnackbar();
  const [, setLoading] = useState(false);

  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
  } = useGlobalModalInnerContext();

  // Configure modal
  useEffect(() => {
    updateModalTitle('Invite Worker');

    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Send Invitation',
      cancelButtonText: 'Cancel',
    });

    updateOnClose(() => {
      onCancel?.();
    });

    updateOnConfirm(() => {
      handleSubmit(onSubmit)();
    });
  }, [updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, onCancel]);

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true);
    try {
      const response = await workerService.sendWorkerInvitation({
        email: data.email,
      });

      showSuccess(
        `Invitation sent successfully to ${response.email}. Expires: ${new Date(
          response.expiresAt
        ).toLocaleDateString()}`
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error('Error sending invitation:', error);
      const errorMessage = extractErrorMessage(
        error,
        'Failed to send invitation. Please try again.'
      );
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <FormWrapper>
          <Input
            name="email"
            label="Worker Email"
            type="email"
            placeholder="worker@example.com"
            fullWidth
            error={errors.email}
          />
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
