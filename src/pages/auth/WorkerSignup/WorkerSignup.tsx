import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { PasswordStrength } from '../../../components/UI/PasswordStrength';
import { Snackbar } from '../../../components/UI/Snackbar';
import { AuthRightSection } from '../../../components/Auth/AuthRightSection';
import { authService } from '../../../services/api';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { WorkerSignupSchema } from './WorkerSignupSchema';
import {
  SignupContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  DividerContainer,
  DividerLine,
  DividerText,
  SignInLink,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
} from './WorkerSignup.styles';
import type { WorkerSignupFormData } from './IWorkerSignup';

export const WorkerSignup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const { fieldRules, defaultValues, placeHolders, fieldLabels } = useSchema(
    WorkerSignupSchema
  );

  const methods = useForm<WorkerSignupFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues: {
      ...defaultValues,
      email: emailParam || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    control,
  } = methods;

  // Watch password field for strength indicator
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });

  useEffect(() => {
    if (!token) {
      setTokenError('Invalid invitation link. Missing token parameter.');
    }
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [token, emailParam, setValue]);

  const onSubmit = async (data: WorkerSignupFormData) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: 'Invalid invitation token',
        variant: 'error',
      });
      return;
    }

    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await authService.signupWorkerViaInvitation({
        invitationToken: token,
        email: data.email,
        name: data.name,
        initials: data.initials,
        telephone: data.telephone,
        mobile: data.mobile,
        username: data.username,
        password: data.password,
      });

      console.log('Worker signup successful:', response);

      const receivedCompanyName = response.data.companyName || 'your company';
      setCompanyName(receivedCompanyName);

      setSnackbar({
        open: true,
        message: `Account created successfully! Welcome to ${receivedCompanyName}. Redirecting to login...`,
        variant: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      console.error('Worker signup failed:', error);
      const errorMessage = extractErrorMessage(
        error,
        'Failed to create account. Please try again.'
      );

      setSnackbar({
        open: true,
        message: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError || !token) {
    return (
      <SignupContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
            </HeaderSection>
            <ErrorContainer>
              <ErrorTitle>Invalid Invitation Link</ErrorTitle>
              <ErrorMessage>
                {tokenError ||
                  'This invitation link is invalid or has expired. Please contact your company administrator for a new invitation.'}
              </ErrorMessage>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ marginTop: '20px' }}
              >
                Go to Login
              </Button>
            </ErrorContainer>
          </FormContainer>
        </LeftSection>
        <AuthRightSection />
      </SignupContainer>
    );
  }

  return (
    <FormProvider {...methods}>
      <SignupContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>{companyName ? `You're Invited to Join ${companyName}` : 'Join Your Team'}</Title>
              <Subtitle>
                Complete your profile to join your company's workspace.
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
                disabled
              />

              <Input
                name="name"
                label={fieldLabels.name}
                type="text"
                placeholder={placeHolders.name}
                fullWidth
                error={errors.name}
              />

              <Input
                name="username"
                label={fieldLabels.username}
                type="text"
                placeholder={placeHolders.username}
                fullWidth
                error={errors.username}
              />

              <div>
                <PasswordInput
                  name="password"
                  label={fieldLabels.password}
                  placeholder={placeHolders.password}
                  fullWidth
                  error={errors.password}
                  onChange={() => {
                    trigger('confirmPassword');
                  }}
                />
                <PasswordStrength password={password} />
              </div>

              <PasswordInput
                name="confirmPassword"
                label={fieldLabels.confirmPassword}
                placeholder={placeHolders.confirmPassword}
                fullWidth
                error={errors.confirmPassword}
              />

              <Input
                name="initials"
                label={fieldLabels.initials}
                type="text"
                placeholder={placeHolders.initials}
                fullWidth
                error={errors.initials}
              />

              <Input
                name="telephone"
                label={fieldLabels.telephone}
                type="text"
                placeholder={placeHolders.telephone}
                fullWidth
                error={errors.telephone}
              />

              <Input
                name="mobile"
                label={fieldLabels.mobile}
                type="text"
                placeholder={placeHolders.mobile}
                fullWidth
                error={errors.mobile}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <DividerContainer>
                <DividerLine />
                <DividerText>Or</DividerText>
                <DividerLine />
              </DividerContainer>

              <SignInLink>
                Already have an account, <a href="/login">Sign in</a>
              </SignInLink>
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
      </SignupContainer>
    </FormProvider>
  );
};
