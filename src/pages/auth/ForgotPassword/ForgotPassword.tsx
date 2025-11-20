import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { useSchema } from '../../../utils/validation';
import { ForgotPasswordFormSchema } from './ForgotPasswordSchema';
import { authService } from '../../../services/api/auth';
import { extractErrorMessage } from '../../../utils/errorHandler';
import {
  ForgotPasswordContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  BackToLoginLink,
} from './ForgotPassword.styles';
import type { ForgotPasswordFormData } from './IForgotPassword';

export const ForgotPassword: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(ForgotPasswordFormSchema);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await authService.forgotPassword({ email: data.email });

      setSnackbar({
        open: true,
        message: response.data.message || 'Password reset link has been sent to your email!',
        variant: 'success',
      });

      // Redirect to reset password page with email after 2 seconds
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to send reset email. Please try again.');

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
      <ForgotPasswordContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Forgot Password?</Title>
              <Subtitle>
                No worries! Enter your email address and we'll send you a link to reset your password.
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                loading={true}
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
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
      </ForgotPasswordContainer>
    </FormProvider>
  );
};
