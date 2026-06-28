import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleLogin } from '@react-oauth/google';
import { FloowLogo } from '../../../components/FloowLogo';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Forms/Input';
import { PasswordInput } from '../../../components/Forms/PasswordInput';
import { Snackbar } from '../../../components/Snackbar';
import { AuthRightSection } from '../components/AuthRightSection';
import { getRoleFromToken } from '../../../utils/jwt';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { useAuth } from '../../../contexts/AuthContext';
import { useSchema } from '../../../utils/validation';
import { LoginFormSchema } from './LoginSchema';
import {
  LoginContainer,
  LeftSection,
  FormContainer,
  HeaderSection,
  Title,
  Subtitle,
  FormWrapper,
  ForgotPasswordLink,
  DividerContainer,
  DividerLine,
  DividerText,
  SignUpLink,
} from './Login.styles';
import type { LoginFormData } from './ILogin';


export const Login: React.FC = () => {
  const { fieldRules, defaultValues, placeHolders, fieldLabels } =
    useSchema(LoginFormSchema);

  const methods = useForm<LoginFormData>({
    resolver: yupResolver(fieldRules),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    variant: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    variant: 'success',
  });

  const redirectByRole = (role: string | null) => {
    if (role === 'ROLE_COMPANY' || role === 'COMPANY') {
      navigate('/company');
    } else if (role === 'ROLE_WORKER' || role === 'WORKER') {
      navigate('/worker');
    } else {
      navigate('/company');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setSnackbar({ open: false, message: '', variant: 'success' });

    try {
      const response = await login({ userName: data.userName, password: data.password });
      const role = response.data.accessToken ? getRoleFromToken(response.data.accessToken) : null;
      if (role) localStorage.setItem('user_role', role);

      setSnackbar({ open: true, message: 'Login successful! Redirecting...', variant: 'success' });
      setTimeout(() => redirectByRole(role), 1000);
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to sign in. Please try again.');

      if (errorMessage === 'User is disabled') {
        setShowResendLink(true);
        setSnackbar({ open: true, message: 'Please verify your email before logging in.', variant: 'warning' });
      } else {
        setShowResendLink(false);
        setSnackbar({ open: true, message: errorMessage, variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setIsLoading(true);
    try {
      const response = await loginWithGoogle(credential);
      const role = response.data.accessToken ? getRoleFromToken(response.data.accessToken) : null;
      if (role) localStorage.setItem('user_role', role);

      setSnackbar({ open: true, message: 'Login successful! Redirecting...', variant: 'success' });
      setTimeout(() => redirectByRole(role), 1000);
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error, 'Google sign-in failed. Please try again.');
      setSnackbar({ open: true, message: errorMessage, variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <LoginContainer>
        <LeftSection>
          <FormContainer>
            <HeaderSection>
              <FloowLogo variant="light" showText={true} />
              <Title>Welcome Back!</Title>
              <Subtitle>
                Enter your valid email address and password to access your account.
              </Subtitle>
            </HeaderSection>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
              <Input
                name="userName"
                label={fieldLabels.userName}
                type="text"
                placeholder={placeHolders.userName}
                fullWidth
                error={errors.userName}
              />

              <PasswordInput
                label={fieldLabels.password}
                placeholder={placeHolders.password}
                fullWidth
                name="password"
                error={errors.password}
              />

              <ForgotPasswordLink onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </ForgotPasswordLink>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </Button>

              <DividerContainer>
                <DividerLine />
                <DividerText>Or</DividerText>
                <DividerLine />
              </DividerContainer>

              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleSuccess(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  setSnackbar({ open: true, message: 'Google sign-in was cancelled or failed.', variant: 'error' });
                }}
                width="100%"
                text="signin_with"
                shape="rectangular"
                theme="outline"
              />

              {showResendLink && (
                <SignUpLink>
                  <Link to="/resend-verification">Resend verification email</Link>
                </SignUpLink>
              )}

              <SignUpLink>
                Don't have an account? <Link to="/signup">Create an account</Link>
              </SignUpLink>
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
      </LoginContainer>
    </FormProvider>
  );
};
