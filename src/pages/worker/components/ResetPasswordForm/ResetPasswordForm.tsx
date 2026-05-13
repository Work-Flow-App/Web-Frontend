import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordInput } from '../../../../components/UI/Forms/PasswordInput';
import { workerService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { FormContainer, FormWrapper } from '../InviteWorkerForm/InviteWorkerForm.styles';

interface ResetPasswordFormProps {
  workerId: number;
  workerName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object({
  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Must contain a special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm the password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  workerId,
  workerName,
  onSuccess,
  onCancel,
}) => {
  const methods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const { showSuccess, showError } = useSnackbar();
  const [, setLoading] = useState(false);

  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  useEffect(() => {
    updateModalTitle(`Reset Password — ${workerName}`);
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Reset Password',
      cancelButtonText: 'Cancel',
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => handleSubmit(onSubmit)());
  }, [updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm, onCancel]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await workerService.resetPassword(workerId, { newPassword: data.newPassword });
      showSuccess(`Password reset for ${workerName}. Share the new password out-of-band.`);
      onSuccess?.();
    } catch (error: unknown) {
      showError(extractErrorMessage(error, 'Failed to reset password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <FormWrapper>
          <PasswordInput
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            fullWidth
            error={errors.newPassword}
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm new password"
            fullWidth
            error={errors.confirmPassword}
          />
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
