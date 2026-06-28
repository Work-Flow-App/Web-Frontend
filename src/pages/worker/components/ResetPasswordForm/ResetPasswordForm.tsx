import React, { useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AxiosError } from 'axios';
import { Input } from '../../../../components/Forms/Input';
import { PasswordInput } from '../../../../components/Forms/PasswordInput';
import { workerService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/GlobalModal';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { FormContainer, FormWrapper } from '../InviteWorkerForm/InviteWorkerForm.styles';
import { UsernameRow, UsernameValue } from './ResetPasswordForm.styles';

interface ResetPasswordFormProps {
  workerId: number;
  workerName: string;
  workerUsername: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ResetCredentialsFormData {
  newPassword: string;
  newUsername: string;
}

const schema = yup.object({
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters'),
  newUsername: yup
    .string()
    .default('')
    .test('username-format', 'Must be 3–20 characters with no spaces', (value) => {
      if (!value?.trim()) return true;
      const trimmed = value.trim();
      return trimmed.length >= 3 && trimmed.length <= 20 && !/\s/.test(trimmed);
    }),
});

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  workerId,
  workerName,
  workerUsername,
  onSuccess,
  onCancel,
}) => {
  const methods = useForm<ResetCredentialsFormData>({
    resolver: yupResolver(schema),
    defaultValues: { newPassword: '', newUsername: '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors }, setError } = methods;
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  const onSubmit = useCallback(
    async (data: ResetCredentialsFormData) => {
      try {
        const trimmedUsername = data.newUsername?.trim();
        await workerService.resetPassword(workerId, {
          newPassword: data.newPassword,
          ...(trimmedUsername ? { newUsername: trimmedUsername } : {}),
        });
        showSuccess(`Credentials updated for ${workerName}.`);
        onSuccess?.();
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 409) {
          setError('newUsername', {
            type: 'manual',
            message: error.response.data?.message || 'Username already taken',
          });
          return;
        }
        showError(extractErrorMessage(error, 'Failed to update credentials.'));
      }
    },
    [workerId, workerName, showSuccess, showError, onSuccess, setError]
  );

  useEffect(() => {
    updateModalTitle(`Reset Credentials — ${workerName}`);
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => handleSubmit(onSubmit)());
  }, [updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, onCancel, onSubmit, handleSubmit, workerName]);

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <UsernameRow>
          Current Username: <UsernameValue>{workerUsername}</UsernameValue>
        </UsernameRow>
        <FormWrapper>
          <PasswordInput
            name="newPassword"
            label="New Password"
            placeholder="Min 8 characters"
            fullWidth
            required
            error={errors.newPassword}
          />
          <Input
            name="newUsername"
            label="New Username (optional)"
            placeholder="Leave blank to keep current"
            fullWidth
            error={errors.newUsername}
          />
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
