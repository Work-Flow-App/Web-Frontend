import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../../../components/UI/Forms/Input';
import { Button } from '../../../../components/UI/Button';
import { workerService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import {
  FormContainer,
  FormWrapper,
  ButtonGroup,
} from './InviteWorkerForm.styles';

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
    formState: { errors, isSubmitting },
  } = methods;

  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);

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
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            label="Worker Email"
            type="email"
            placeholder="worker@example.com"
            fullWidth
            error={errors.email}
            helperText="Enter the email address of the worker you want to invite"
          />

          <ButtonGroup>
            {onCancel && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                disabled={loading || isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </ButtonGroup>
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
