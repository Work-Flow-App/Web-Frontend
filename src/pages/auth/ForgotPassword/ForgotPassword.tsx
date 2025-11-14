import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
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
import type { ForgotPasswordFormData } from './ForgotPassword.types';

export const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

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
      // TODO: Integrate with actual forgot password API
      // For now, simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Password reset email sent to:', data.email);

      setSnackbar({
        open: true,
        message: 'Password reset link has been sent to your email!',
        variant: 'success',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      let errorMessage = 'Failed to send reset email. Please try again.';

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
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              fullWidth
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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
  );
};
