import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { FloowLogo } from '../../../components/UI/FloowLogo';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../components/UI/Forms/PasswordInput';
import { PasswordStrength } from '../../../components/UI/PasswordStrength';
import { Snackbar } from '../../../components/UI/Snackbar';
import { authService, workerService } from '../../../services/api';
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

  const { fieldRules, defaultValues, placeHolders, fieldLabels } = useSchema(WorkerSignupSchema);

  const methods = useForm<WorkerSignupFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues: {
      ...defaultValues,
      email: '',
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
  const [isCheckingInvitation, setIsCheckingInvitation] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [invitationEmail, setInvitationEmail] = useState<string>('');
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
    const checkInvitation = async () => {
      if (!token) {
        setTokenError('Invalid invitation link. Missing token parameter.');
        setIsCheckingInvitation(false);
        return;
      }

      try {
        setIsCheckingInvitation(true);
        const response = await workerService.checkInvitation(token);

        // Check if invitation is valid
        if (!response.data.valid) {
          const statusMessage =
            response.data.status === 'EXPIRED'
              ? 'This invitation has expired. Please contact your company administrator for a new invitation.'
              : response.data.status === 'ACCEPTED'
                ? 'This invitation has already been used.'
                : 'This invitation is not valid.';
          setTokenError(statusMessage);
          setIsCheckingInvitation(false);
          return;
        }

        // Set email from API response and make it non-editable
        if (response.data.email) {
          setInvitationEmail(response.data.email);
          setValue('email', response.data.email);
        }

        // Set company name from API response
        if (response.data.companyName) {
          setCompanyName(response.data.companyName);
        }

        setIsCheckingInvitation(false);
      } catch (error: unknown) {
        console.error('Failed to check invitation:', error);
        const errorMessage = extractErrorMessage(
          error,
          'Failed to validate invitation. Please try again or contact your company administrator.'
        );
        setTokenError(errorMessage);
        setIsCheckingInvitation(false);
      }
    };

    checkInvitation();
  }, [token, setValue]);

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

      // Handle specific error cases
      let errorMessage = extractErrorMessage(error, 'Failed to create account. Please try again.');

      // Check if it's a 409 conflict error
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          if (error.response?.data?.message?.includes('constraint')) {
            errorMessage =
              'This email or username is already registered, or the invitation has already been used. Please use a different username or contact your administrator.';
          } else {
            errorMessage =
              error.response?.data?.message || 'This invitation has already been used or account already exists.';
          }
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

  // Show loading state while checking invitation
  if (isCheckingInvitation) {
    return (
      <SignupContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
            </HeaderSection>
            <ErrorContainer>
              <ErrorTitle>Validating Invitation...</ErrorTitle>
              <ErrorMessage>Please wait while we verify your invitation link.</ErrorMessage>
            </ErrorContainer>
          </FormContainer>
        </LeftSection>
      </SignupContainer>
    );
  }

  // Show error if token is invalid
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
              <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ marginTop: '20px' }}>
                Go to Login
              </Button>
            </ErrorContainer>
          </FormContainer>
        </LeftSection>
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
              <Subtitle>Complete your profile to join your company's workspace.</Subtitle>
            </HeaderSection>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="email"
                label={fieldLabels.email}
                type="email"
                placeholder={placeHolders.email}
                fullWidth
                required
                error={errors.email}
                isDisabled={true}
                readOnly={true}
                defaultValue={invitationEmail}
                styles={{
                  input: {
                    '& input': {
                      color: '#1e293b !important',
                      WebkitTextFillColor: '#1e293b !important',
                      fontWeight: 500,
                    },
                  },
                }}
              />

              <Input
                name="name"
                label={fieldLabels.name}
                type="text"
                placeholder={placeHolders.name}
                fullWidth
                required
                error={errors.name}
              />

              <Input
                name="username"
                label={fieldLabels.username}
                type="text"
                placeholder={placeHolders.username}
                fullWidth
                required
                error={errors.username}
              />

              <div>
                <PasswordInput
                  name="password"
                  label={fieldLabels.password}
                  placeholder={placeHolders.password}
                  fullWidth
                  required
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
                required
                error={errors.confirmPassword}
              />

              <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={isLoading}>
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
