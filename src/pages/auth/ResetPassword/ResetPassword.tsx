import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { useSchema } from '../../../utils/validation';
import { ResetPasswordFormSchema } from './ResetPasswordSchema';
import {
  ResetPasswordContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  BackToLoginLink,
} from './ResetPassword.styles';
import type { ResetPasswordFormData } from './IResetPassword';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email') || '';

  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(ResetPasswordFormSchema);

  const methods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues: emailFromParams ? { ...defaultValues, email: emailFromParams } : defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      // TODO: Integrate with actual reset password API
      // API payload structure:
      // {
      //   "email": data.email,
      //   "code": data.code,
      //   "newPassword": data.newPassword
      // }

      // For now, simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Password reset payload:', {
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });

      setSnackbar({
        open: true,
        message: 'Password has been reset successfully! Redirecting to login...',
        variant: 'success',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      let errorMessage = 'Failed to reset password. Please try again.';

      if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <FormProvider {...methods}>
      <ResetPasswordContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Reset Password</Title>
              <Subtitle>
                Enter the verification code sent to your email and create a new password.
              </Subtitle>
            </HeaderSection>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="email"
                label={fieldLabels.email}
                type="email"
                placeholder={placeHolders.email}
                fullWidth
                error={errors.email}
              />

              <Input
                name="code"
                label={fieldLabels.code}
                type="text"
                placeholder={placeHolders.code}
                fullWidth
                error={errors.code}
              />

              <PasswordInput
                name="newPassword"
                label={fieldLabels.newPassword}
                placeholder={placeHolders.newPassword}
                fullWidth
                error={errors.newPassword}
              />

              <PasswordInput
                name="confirmPassword"
                label={fieldLabels.confirmPassword}
                placeholder={placeHolders.confirmPassword}
                fullWidth
                error={errors.confirmPassword}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <BackToLoginLink onClick={handleBackToLogin}>
                Back to Login
              </BackToLoginLink>
            </FormWrapper>
          </FormContainer>
        </LeftSection>

        <AuthRightSection />

        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          variant={snackbar.variant}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </ResetPasswordContainer>
    </FormProvider>
  );
};
