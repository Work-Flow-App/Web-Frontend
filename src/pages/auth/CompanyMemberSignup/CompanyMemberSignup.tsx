import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Chip } from '@mui/material';
import { FloowLogo } from '../../../components/FloowLogo';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Forms/Input';
import { PasswordInput } from '../../../components/Forms/PasswordInput';
import { PasswordStrength } from '../../../components/PasswordStrength';
import { Snackbar } from '../../../components/Snackbar';
import { authService } from '../../../services/api/auth';
import { companyMemberService } from '../../../services/api/companyMember';
import type { CompanyRole } from '../../../services/api/companyMember';
import { useSchema } from '../../../utils/validation';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { CompanyMemberSignupSchema } from './CompanyMemberSignupSchema';
import type { CompanyMemberSignupFormData } from './CompanyMemberSignupSchema';
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
} from '../WorkerSignup/WorkerSignup.styles';

const ROLE_LABELS: Record<CompanyRole, string> = {
  COMPANY_ADMIN: 'Admin',
  MANAGER: 'Manager',
  EDITOR: 'Editor',
  VIEWER: 'Viewer',
};

export const CompanyMemberSignup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { fieldRules, defaultValues, placeHolders, fieldLabels } = useSchema(CompanyMemberSignupSchema);

  const methods = useForm<CompanyMemberSignupFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues: { ...defaultValues, email: '' },
    mode: 'onChange',
  });

  const { handleSubmit, formState: { errors }, trigger, setValue, control } = methods;
  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingInvitation, setIsCheckingInvitation] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companyRole, setCompanyRole] = useState<CompanyRole | null>(null);
  const [invitationEmail, setInvitationEmail] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', variant: 'success' });

  useEffect(() => {
    const checkInvitation = async () => {
      if (!token) {
        setTokenError('Invalid invitation link. Missing token parameter.');
        setIsCheckingInvitation(false);
        return;
      }

      try {
        const { data } = await companyMemberService.checkInvitation(token);

        if (!data.valid) {
          const msg =
            data.status === 'EXPIRED'
              ? 'This invitation has expired. Contact your company administrator for a new one.'
              : data.status === 'ACCEPTED'
                ? 'This invitation has already been used.'
                : 'This invitation is not valid.';
          setTokenError(msg);
          setIsCheckingInvitation(false);
          return;
        }

        if (data.email) {
          setInvitationEmail(data.email);
          setValue('email', data.email);
        }
        if (data.companyName) setCompanyName(data.companyName);
        if (data.companyRole) setCompanyRole(data.companyRole as CompanyRole);

        setIsCheckingInvitation(false);
      } catch (error) {
        setTokenError(
          extractErrorMessage(error, 'Failed to validate invitation. Please try again or contact your administrator.')
        );
        setIsCheckingInvitation(false);
      }
    };

    checkInvitation();
  }, [token, setValue]);

  const onSubmit = async (data: CompanyMemberSignupFormData) => {
    if (!token) {
      setSnackbar({ open: true, message: 'Invalid invitation token', variant: 'error' });
      return;
    }

    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      await authService.signupCompanyMember({
        invitationToken: token,
        email: data.email,
        name: data.name,
        username: data.username,
        password: data.password,
      });

      setSnackbar({
        open: true,
        message: `Account created successfully! Welcome to ${companyName || 'your company'}. Redirecting to login...`,
        variant: 'success',
      });

      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractErrorMessage(error, 'Failed to create account. Please try again.'),
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                {tokenError || 'This invitation link is invalid or has expired. Contact your administrator.'}
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

  const roleLabel = companyRole ? ROLE_LABELS[companyRole] : null;

  return (
    <FormProvider {...methods}>
      <SignupContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>
                {companyName ? `Join ${companyName}` : 'Join Your Team'}
              </Title>
              <Subtitle>
                {roleLabel
                  ? `You're invited as ${roleLabel}. Complete your profile to get started.`
                  : 'Complete your profile to join your company workspace.'}
              </Subtitle>
              {roleLabel && (
                <Chip
                  label={roleLabel}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: 'center', mt: 0.5 }}
                />
              )}
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
                  onChange={() => trigger('confirmPassword')}
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
                Already have an account? <a href="/login">Sign in</a>
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
