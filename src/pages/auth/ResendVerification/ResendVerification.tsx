import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { useSchema } from '../../../utils/validation';
import { ResendVerificationFormSchema } from './ResendVerificationSchema';
import {
  ResendVerificationContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  BackToLoginLink,
} from './ResendVerification.styles';
import type { ResendVerificationFormData } from './IResendVerification';

export const ResendVerification: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(ResendVerificationFormSchema);

  const methods = useForm<ResendVerificationFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });

  const onSubmit = async (data: ResendVerificationFormData) => {
    setIsLoading(true);

    try {
      await authService.resendVerification(data.email);
    } catch {
      // Intentionally ignored — backend always returns 200 (doesn't reveal if email exists)
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (submitted) {
    return (
      <ResendVerificationContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Email Sent</Title>
              <Subtitle>
                If your email is registered and unverified, a new verification email has been sent.
              </Subtitle>
            </HeaderSection>
            <BackToLoginLink onClick={handleBackToLogin}>
              Back to Login
            </BackToLoginLink>
          </FormContainer>
        </LeftSection>
        <AuthRightSection />
      </ResendVerificationContainer>
    );
  }

  return (
    <FormProvider {...methods}>
      <ResendVerificationContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Resend Verification Email</Title>
              <Subtitle>
                Enter your email address and we'll resend the verification link.
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
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
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
      </ResendVerificationContainer>
    </FormProvider>
  );
};
